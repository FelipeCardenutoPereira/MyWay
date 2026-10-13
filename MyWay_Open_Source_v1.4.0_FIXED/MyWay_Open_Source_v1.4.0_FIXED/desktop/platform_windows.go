//go:build windows

package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
)

func edgePath() string {
	candidates := []string{
		filepath.Join(os.Getenv("ProgramFiles(x86)"), "Microsoft", "Edge", "Application", "msedge.exe"),
		filepath.Join(os.Getenv("ProgramFiles"), "Microsoft", "Edge", "Application", "msedge.exe"),
		filepath.Join(os.Getenv("LOCALAPPDATA"), "Microsoft", "Edge", "Application", "msedge.exe"),
	}
	for _, p := range candidates {
		if p != "" {
			if _, e := os.Stat(p); e == nil {
				return p
			}
		}
	}
	return ""
}
func launchAppWindow(rawURL, dataDir string) (*exec.Cmd, error) {
	edge := edgePath()
	if edge == "" {
		return nil, fmt.Errorf("Microsoft Edge não encontrado")
	}
	profile := filepath.Join(dataDir, "EdgeProfile-open")
	args := []string{"--app=" + rawURL, "--start-maximized", "--user-data-dir=" + profile, "--no-first-run", "--no-default-browser-check", "--disable-session-crashed-bubble"}
	cmd := exec.Command(edge, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	if err := cmd.Start(); err != nil {
		return nil, err
	}
	return cmd, nil
}
func launchSecondaryWindow(rawURL, dataDir, name string) error {
	edge := edgePath()
	if edge == "" {
		return openDefaultBrowser(rawURL)
	}
	args := []string{"--app=" + rawURL, "--window-size=860,620", "--user-data-dir=" + filepath.Join(dataDir, "EdgeProfile-open"), "--no-first-run", "--no-default-browser-check"}
	cmd := exec.Command(edge, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd.Start()
}
func openDefaultBrowser(rawURL string) error {
	cmd := exec.Command("rundll32.exe", "url.dll,FileProtocolHandler", rawURL)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd.Start()
}
func setStartup(enabled bool) error {
	exe, err := os.Executable()
	if err != nil {
		return err
	}
	key := `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`
	if enabled {
		return runHidden("reg.exe", "add", key, "/v", "MyWay", "/t", "REG_SZ", "/d", strconv.Quote(exe), "/f")
	}
	return runHidden("reg.exe", "delete", key, "/v", "MyWay", "/f")
}
func startupEnabled() bool {
	key := `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`
	cmd := exec.Command("reg.exe", "query", key, "/v", "MyWay")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd.Run() == nil
}
func runHidden(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd.Run()
}

func stopStaleMyWayListener(address string) error {
	// Só é chamado depois de /api/system/status confirmar que quem ocupa a porta é MyWay.
	cmd := exec.Command("netstat.exe", "-ano", "-p", "tcp")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	out, err := cmd.Output()
	if err != nil {
		return err
	}
	port := address
	if i := strings.LastIndex(address, ":"); i >= 0 {
		port = address[i+1:]
	}
	for _, line := range strings.Split(string(out), "\n") {
		fields := strings.Fields(line)
		if len(fields) < 5 || !strings.EqualFold(fields[0], "TCP") || !strings.EqualFold(fields[3], "LISTENING") {
			continue
		}
		if !strings.HasSuffix(fields[1], ":"+port) {
			continue
		}
		pid := strings.TrimSpace(fields[4])
		if pid == "" || pid == "0" || pid == strconv.Itoa(os.Getpid()) {
			continue
		}
		return runHidden("taskkill.exe", "/PID", pid, "/F")
	}
	return fmt.Errorf("processo MyWay antigo não localizado na porta %s", port)
}

func launchKnownApp(name string) error {
	n := strings.ToLower(strings.TrimSpace(name))
	var exe string
	switch n {
	case "calculator", "calc", "calculadora":
		exe = "calc.exe"
	case "explorer", "files", "arquivos":
		exe = "explorer.exe"
	case "notepad", "bloco", "notes":
		exe = "notepad.exe"
	default:
		return fmt.Errorf("aplicativo não permitido")
	}
	cmd := exec.Command(exe)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: false}
	return cmd.Start()
}
