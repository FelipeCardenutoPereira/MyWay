package main

import (
	"crypto/sha256"
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"mime"
	"net"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// www is generated from ../src by `npm run sync`.
// The source of truth remains editable HTML/CSS/JavaScript in /src.
//
//go:embed www
var embedded embed.FS

const appVersion = "1.3.9-open"

type jsonMap map[string]any

type serverState struct {
	mu          sync.Mutex
	preferences jsonMap
}

func main() {
	buildID := executableBuildID()
	dataDir := appDataDir()
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		log.Fatal(err)
	}
	st := &serverState{preferences: readJSONFile(filepath.Join(dataDir, "preferences.json"))}

	sub, err := fs.Sub(embedded, "www")
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	registerAPI(mux, dataDir, st, buildID)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}
		serveStaticNoRedirect(sub, w, r, buildID)
	})

	const stableAddress = "127.0.0.1:43129"
	ln, err := net.Listen("tcp", stableAddress)
	if err != nil {
		// A origem precisa continuar estável para preservar localStorage, mas uma instalação nova
		// não pode reutilizar silenciosamente o backend de uma versão antiga.
		if version, runningBuild, ok := existingMyWayVersion("http://" + stableAddress + "/api/system/status"); ok {
			if version == appVersion && runningBuild != "" && runningBuild == buildID {
				_, _ = launchAppWindow("http://"+stableAddress+"/app?v="+url.QueryEscape(appVersion+"-"+buildID), dataDir)
				return
			}
			// Mesmo número de versão não significa o mesmo build. Uma instância antiga
			// servindo a porta fixa faria o executável novo abrir JS/CSS antigos.
			if stopStaleMyWayListener(stableAddress) == nil {
				for i := 0; i < 24; i++ {
					time.Sleep(125 * time.Millisecond)
					if retry, retryErr := net.Listen("tcp", stableAddress); retryErr == nil {
						ln = retry
						err = nil
						break
					}
				}
			}
		}
		if err != nil {
			log.Fatal(err)
		}
	}
	address := "http://" + stableAddress + "/app?v=" + url.QueryEscape(appVersion+"-"+buildID)
	srv := &http.Server{Handler: securityHeaders(mux)}
	go func() {
		if err := srv.Serve(ln); err != nil && err != http.ErrServerClosed {
			log.Printf("server: %v", err)
		}
	}()

	cmd, err := launchAppWindow(address, dataDir)
	if err != nil {
		// Last-resort default browser. The local API still works while this process lives.
		if e := openDefaultBrowser(address); e != nil {
			log.Printf("browser: %v / fallback: %v", err, e)
		}
	}
	// O processo inicial do Edge pode terminar imediatamente ao reutilizar um processo
	// já existente. Não vincule a vida do backend a esse processo: o atalho deve
	// continuar servindo a mesma origem estável durante toda a sessão do Windows.
	_ = cmd
	select {}
}

func executableBuildID() string {
	exe, err := os.Executable()
	if err != nil {
		return "unknown"
	}
	b, err := os.ReadFile(exe)
	if err != nil {
		return "unknown"
	}
	sum := sha256.Sum256(b)
	return fmt.Sprintf("%x", sum[:8])
}

func existingMyWayVersion(statusURL string) (string, string, bool) {
	c := &http.Client{Timeout: 900 * time.Millisecond}
	r, err := c.Get(statusURL)
	if err != nil {
		return "", "", false
	}
	defer r.Body.Close()
	if r.StatusCode != http.StatusOK {
		return "", "", false
	}
	var v jsonMap
	if json.NewDecoder(r.Body).Decode(&v) != nil {
		return "", "", false
	}
	ok, _ := v["ok"].(bool)
	native, _ := v["native"].(bool)
	version, _ := v["version"].(string)
	build, _ := v["build"].(string)
	return version, build, ok && native
}

func existingMyWay(statusURL string) bool {
	_, _, ok := existingMyWayVersion(statusURL)
	return ok
}

func serveStaticNoRedirect(sub fs.FS, w http.ResponseWriter, r *http.Request, buildID string) {
	clean := path.Clean("/" + r.URL.Path)
	rel := strings.TrimPrefix(clean, "/")
	if rel == "" || rel == "." || rel == "app" || rel == "index.html" {
		rel = "index.html"
	}
	if strings.Contains(rel, "..") {
		http.Error(w, "caminho inválido", http.StatusBadRequest)
		return
	}
	b, err := fs.ReadFile(sub, rel)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	if rel == "index.html" || strings.HasSuffix(rel, ".js") || strings.HasSuffix(rel, ".css") {
		// HTML/JS/CSS são pequenos e locais. Nunca reutilizar um bundle anterior é mais
		// importante do que economizar uma leitura do executável embutido.
		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
		w.Header().Set("Pragma", "no-cache")
	} else {
		etag := `"myway-` + appVersion + `-` + buildID + `-` + strings.ReplaceAll(rel, `"`, ``) + `"`
		w.Header().Set("ETag", etag)
		w.Header().Set("Cache-Control", "private, max-age=0, must-revalidate")
		if r.Header.Get("If-None-Match") == etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}
	}
	if typ := mime.TypeByExtension(filepath.Ext(rel)); typ != "" {
		w.Header().Set("Content-Type", typ)
	}
	w.Header().Set("X-MyWay-Version", appVersion)
	w.Header().Set("X-MyWay-Build", buildID)
	w.WriteHeader(http.StatusOK)
	if r.Method != http.MethodHead {
		_, _ = w.Write(b)
	}
}

func registerAPI(mux *http.ServeMux, dataDir string, st *serverState, buildID string) {
	stateFile := filepath.Join(dataDir, "state.json")
	prefsFile := filepath.Join(dataDir, "preferences.json")

	mux.HandleFunc("/api/state", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			b, err := os.ReadFile(stateFile)
			if err != nil {
				if os.IsNotExist(err) {
					writeJSON(w, jsonMap{})
				} else {
					http.Error(w, err.Error(), 500)
				}
				return
			}
			w.Header().Set("Content-Type", "application/json; charset=utf-8")
			_, _ = w.Write(b)
			return
		}
		if r.Method == http.MethodPost {
			body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 32<<20))
			if err != nil {
				http.Error(w, "dados muito grandes", 413)
				return
			}
			var tmp any
			if json.Unmarshal(body, &tmp) != nil {
				http.Error(w, "JSON inválido", 400)
				return
			}
			if err := atomicWrite(stateFile, body); err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			writeJSON(w, jsonMap{"ok": true})
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	})

	mux.HandleFunc("/api/system/status", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, jsonMap{"ok": true, "native": true, "version": appVersion, "build": buildID, "pid": os.Getpid(), "nativeNotifications": false, "notificationsEnabled": false, "startupEnabled": startupEnabled(), "openSource": true})
	})
	mux.HandleFunc("/api/system/preferences", func(w http.ResponseWriter, r *http.Request) {
		st.mu.Lock()
		defer st.mu.Unlock()
		if r.Method == http.MethodPost {
			var patch jsonMap
			if json.NewDecoder(r.Body).Decode(&patch) == nil {
				for k, v := range patch {
					st.preferences[k] = v
				}
				_ = writeJSONFile(prefsFile, st.preferences)
			}
		}
		writeJSON(w, st.preferences)
	})
	mux.HandleFunc("/api/system/startup", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			var p struct {
				Enabled bool `json:"enabled"`
			}
			if json.NewDecoder(r.Body).Decode(&p) == nil {
				_ = setStartup(p.Enabled)
			}
		}
		writeJSON(w, jsonMap{"ok": true, "enabled": startupEnabled()})
	})
	mux.HandleFunc("/api/system/show", func(w http.ResponseWriter, r *http.Request) {
		target := r.URL.Query().Get("target")
		if target == "notes" {
			_ = launchSecondaryWindow("http://"+r.Host+"/#sticky", dataDir, "notes")
		}
		writeJSON(w, jsonMap{"ok": true})
	})
	mux.HandleFunc("/api/system/window", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, jsonMap{"ok": true, "managedBy": "browser-app-window"})
	})
	mux.HandleFunc("/api/system/notifications", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, jsonMap{"ok": true, "nativeNotifications": false, "enabled": false})
	})
	mux.HandleFunc("/api/system/notify", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, jsonMap{"ok": false, "error": "Notificações nativas ainda não fazem parte do shell aberto."})
	})
	mux.HandleFunc("/api/system/launch", func(w http.ResponseWriter, r *http.Request) {
		app := r.URL.Query().Get("app")
		err := launchKnownApp(app)
		if err != nil {
			writeJSON(w, jsonMap{"ok": false, "error": err.Error()})
			return
		}
		writeJSON(w, jsonMap{"ok": true})
	})
	mux.HandleFunc("/api/youtube/oembed", func(w http.ResponseWriter, r *http.Request) {
		raw := r.URL.Query().Get("url")
		if raw == "" {
			writeJSON(w, jsonMap{"ok": false})
			return
		}
		q := "https://www.youtube.com/oembed?format=json&url=" + url.QueryEscape(raw)
		c := &http.Client{Timeout: 8 * time.Second}
		resp, err := c.Get(q)
		if err != nil {
			writeJSON(w, jsonMap{"ok": false})
			return
		}
		defer resp.Body.Close()
		var v jsonMap
		if json.NewDecoder(resp.Body).Decode(&v) != nil {
			writeJSON(w, jsonMap{"ok": false})
			return
		}
		v["ok"] = true
		writeJSON(w, v)
	})
	// Legacy native-only APIs return an explicit, non-fatal response so the web layer can use its browser fallbacks.
	for _, path := range []string{"/api/cloud/status", "/api/cloud/sync", "/api/cloud/open", "/api/cloud/share", "/api/inspiration/search", "/api/inspiration/upload", "/api/inspiration/delete", "/api/integrations/status", "/api/integrations/pinterest/connect", "/api/integrations/pinterest/pins", "/api/openai/key", "/api/openai/research", "/api/research/web", "/api/scrape", "/api/relationships/photos", "/api/relationships/photo", "/api/relationships/photo/upload", "/api/relationships/photo/delete", "/api/relationships/vault/status", "/api/relationships/vault/setup", "/api/relationships/vault/unlock", "/api/relationships/vault/lock", "/api/relationships/vault/upload", "/api/relationships/vault/file", "/api/relationships/vault/delete"} {
		p := path
		mux.HandleFunc(p, func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, jsonMap{"ok": false, "available": false, "error": "Recurso do shell legado; o modo aberto usa a alternativa web quando disponível."})
		})
	}
}

func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "no-referrer")
		next.ServeHTTP(w, r)
	})
}
func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_ = json.NewEncoder(w).Encode(v)
}
func appDataDir() string {
	if p := os.Getenv("LOCALAPPDATA"); p != "" {
		return filepath.Join(p, "MyWay")
	}
	if h, err := os.UserHomeDir(); err == nil {
		return filepath.Join(h, ".myway")
	}
	return filepath.Join(os.TempDir(), "MyWay")
}
func atomicWrite(path string, b []byte) error {
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, b, 0o600); err != nil {
		return err
	}
	return os.Rename(tmp, path)
}
func readJSONFile(path string) jsonMap {
	b, e := os.ReadFile(path)
	if e != nil {
		return jsonMap{}
	}
	var v jsonMap
	if json.Unmarshal(b, &v) != nil {
		return jsonMap{}
	}
	return v
}
func writeJSONFile(path string, v any) error {
	b, e := json.MarshalIndent(v, "", "  ")
	if e != nil {
		return e
	}
	return atomicWrite(path, b)
}

// Tiny context helper avoids importing app-specific frameworks.
type cancelContext interface {
	Done() <-chan struct{}
	Err() error
	Deadline() (time.Time, bool)
	Value(any) any
}

func timeoutContext(d time.Duration) (cancelContext, func()) { return newTimeoutContext(d) }

func init() { fmt.Sprint("") }
