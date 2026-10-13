package main

import (
	"io/fs"
	"net/http"
	"net/http/httptest"
	"testing"
	"testing/fstest"
)

func testStaticHandler(sub fs.FS) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		serveStaticNoRedirect(sub, w, r, "testbuild")
	})
	return mux
}

func TestStaticRoutesNeverRedirect(t *testing.T) {
	h := testStaticHandler(fstest.MapFS{
		"index.html":     {Data: []byte("<!doctype html><title>MyWay</title>")},
		"styles/app.css": {Data: []byte("body{margin:0}")},
		"js/app.js":      {Data: []byte("window.MyWayTest=true")},
	})
	for _, target := range []string{
		"http://127.0.0.1/",
		"http://127.0.0.1/app?v=1.2.3-open",
		"http://127.0.0.1/index.html",
		"http://127.0.0.1/styles/app.css",
		"http://127.0.0.1/js/app.js",
	} {
		req := httptest.NewRequest(http.MethodGet, target, nil)
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Fatalf("%s status = %d, want 200", target, rec.Code)
		}
		if loc := rec.Header().Get("Location"); loc != "" {
			t.Fatalf("%s redirected to %q", target, loc)
		}
	}
}

func TestExistingMyWayVersion(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true,"native":true,"version":"1.3.6-open","build":"abc123"}`))
	}))
	defer srv.Close()
	version, build, ok := existingMyWayVersion(srv.URL)
	if !ok || version != "1.3.6-open" || build != "abc123" {
		t.Fatalf("version=%q build=%q ok=%v", version, build, ok)
	}
}
