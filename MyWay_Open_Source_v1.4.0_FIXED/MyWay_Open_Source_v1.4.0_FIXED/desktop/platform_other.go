//go:build !windows

package main

import (
	"fmt"
	"os/exec"
)

func launchAppWindow(rawURL, dataDir string) (*exec.Cmd, error) {
	cmd := exec.Command("xdg-open", rawURL)
	if err := cmd.Start(); err != nil {
		return nil, err
	}
	return cmd, nil
}
func launchSecondaryWindow(rawURL, dataDir, name string) error { return openDefaultBrowser(rawURL) }
func openDefaultBrowser(rawURL string) error                   { return exec.Command("xdg-open", rawURL).Start() }
func setStartup(enabled bool) error                            { return nil }
func startupEnabled() bool                                     { return false }
func stopStaleMyWayListener(address string) error              { return nil }
func launchKnownApp(name string) error                         { return fmt.Errorf("recurso disponível somente no Windows") }
