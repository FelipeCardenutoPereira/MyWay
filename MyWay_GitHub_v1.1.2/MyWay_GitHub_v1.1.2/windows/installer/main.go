package main

import (
    "embed"
    "io/fs"
    "os"
    "os/exec"
    "path/filepath"
    "strings"
    "syscall"
    "time"
    "unsafe"
)

//go:embed payload
var payload embed.FS

const version = "1.1.2"

var (
    user32 = syscall.NewLazyDLL("user32.dll")
    messageBoxW = user32.NewProc("MessageBoxW")
)

const (
    mbOK = 0x00000000
    mbYesNo = 0x00000004
    mbIconInfo = 0x00000040
    mbIconQuestion = 0x00000020
    mbIconError = 0x00000010
    idYes = 6
)

func msg(title, text string, flags uintptr) int {
    t, _ := syscall.UTF16PtrFromString(title)
    m, _ := syscall.UTF16PtrFromString(text)
    r, _, _ := messageBoxW.Call(0, uintptr(unsafe.Pointer(m)), uintptr(unsafe.Pointer(t)), flags)
    return int(r)
}

func installDir() string {
    local := os.Getenv("LOCALAPPDATA")
    if local == "" { local = filepath.Join(os.Getenv("USERPROFILE"), "AppData", "Local") }
    return filepath.Join(local, "Programs", "MyWay")
}

func runHidden(name string, args ...string) error {
    cmd := exec.Command(name, args...)
    cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
    return cmd.Run()
}

func stopRunning() {
    _ = runHidden("taskkill.exe", "/IM", "MyWay.exe", "/F")
    time.Sleep(500 * time.Millisecond)
}

func extractPayload(dst string) error {
    if err := os.MkdirAll(dst, 0755); err != nil { return err }
    return fs.WalkDir(payload, "payload", func(path string, d fs.DirEntry, err error) error {
        if err != nil { return err }
        rel, err := filepath.Rel("payload", path)
        if err != nil || rel == "." { return err }
        out := filepath.Join(dst, filepath.FromSlash(rel))
        if d.IsDir() { return os.MkdirAll(out, 0755) }
        b, err := payload.ReadFile(path)
        if err != nil { return err }
        if err := os.MkdirAll(filepath.Dir(out), 0755); err != nil { return err }
        return os.WriteFile(out, b, 0644)
    })
}

func quotePS(s string) string { return "'" + strings.ReplaceAll(s, "'", "''") + "'" }

func createShortcuts(dst string) {
    exe := filepath.Join(dst, "MyWay.exe")
    ico := filepath.Join(dst, "MyWay.ico")
    ps := `$ErrorActionPreference='SilentlyContinue';` +
        `$w=New-Object -ComObject WScript.Shell;` +
        `$desktop=[Environment]::GetFolderPath('Desktop');` +
        `$start=Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\MyWay';` +
        `New-Item -ItemType Directory -Force -Path $start|Out-Null;` +
        `$s=$w.CreateShortcut((Join-Path $desktop 'MyWay.lnk'));$s.TargetPath=` + quotePS(exe) + `;$s.WorkingDirectory=` + quotePS(dst) + `;$s.IconLocation=` + quotePS(ico) + `;$s.Save();` +
        `$s=$w.CreateShortcut((Join-Path $start 'MyWay.lnk'));$s.TargetPath=` + quotePS(exe) + `;$s.WorkingDirectory=` + quotePS(dst) + `;$s.IconLocation=` + quotePS(ico) + `;$s.Save();`
    _ = runHidden("powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps)
}

func removeShortcuts() {
    ps := `$ErrorActionPreference='SilentlyContinue';` +
        `$desktop=[Environment]::GetFolderPath('Desktop');Remove-Item -Force (Join-Path $desktop 'MyWay.lnk');` +
        `$start=Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\MyWay';Remove-Item -Recurse -Force $start;`
    _ = runHidden("powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps)
}

func registerUninstall(dst, self string) {
    uninstall := filepath.Join(dst, "Desinstalar_MyWay.exe")
    _ = copyFile(self, uninstall)
    key := `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\MyWay`
    _ = runHidden("reg.exe", "add", key, "/v", "DisplayName", "/t", "REG_SZ", "/d", "MyWay", "/f")
    _ = runHidden("reg.exe", "add", key, "/v", "DisplayVersion", "/t", "REG_SZ", "/d", version, "/f")
    _ = runHidden("reg.exe", "add", key, "/v", "Publisher", "/t", "REG_SZ", "/d", "MyWay", "/f")
    _ = runHidden("reg.exe", "add", key, "/v", "InstallLocation", "/t", "REG_SZ", "/d", dst, "/f")
    _ = runHidden("reg.exe", "add", key, "/v", "UninstallString", "/t", "REG_SZ", "/d", `"`+uninstall+`"`, "/f")
}

func copyFile(src, dst string) error {
    b, err := os.ReadFile(src); if err != nil { return err }
    return os.WriteFile(dst, b, 0644)
}

func uninstall() {
    if msg("MyWay", "Deseja remover o aplicativo MyWay deste computador? Seus dados pessoais em AppData\\Local\\MyWay não serão apagados.", mbYesNo|mbIconQuestion) != idYes { return }
    stopRunning()
    removeShortcuts()
    _ = runHidden("reg.exe", "delete", `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\MyWay`, "/f")
    dst := installDir()
    // Remove after this uninstaller process exits.
    ps := `Start-Sleep -Seconds 2; Remove-Item -Recurse -Force ` + quotePS(dst)
    cmd := exec.Command("powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-Command", ps)
    cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
    _ = cmd.Start()
    msg("MyWay", "O MyWay foi removido. Seus dados pessoais foram preservados.", mbOK|mbIconInfo)
}

func main() {
    self, _ := os.Executable()
    if strings.HasPrefix(strings.ToLower(filepath.Base(self)), "desinstalar_myway") {
        uninstall(); return
    }
    if msg("MyWay v"+version, "Instalar/atualizar o MyWay?\n\nA atualização substitui apenas os arquivos do aplicativo. Seus dados pessoais e sua conta são preservados.", mbYesNo|mbIconQuestion) != idYes { return }
    stopRunning()
    dst := installDir()
    // Remove stale files from older packages that should no longer ship.
    _ = os.RemoveAll(filepath.Join(dst, "assets", "fonts"))
    _ = os.Remove(filepath.Join(dst, "assets", "mfma-cover.jpg"))
    _ = os.Remove(filepath.Join(dst, "assets", "mfma-checklist.pdf"))
    if err := extractPayload(dst); err != nil {
        msg("MyWay - erro", "Não foi possível concluir a instalação:\n"+err.Error(), mbOK|mbIconError); return
    }
    registerUninstall(dst, self)
    createShortcuts(dst)
    app := filepath.Join(dst, "MyWay.exe")
    cmd := exec.Command(app)
    cmd.Dir = dst
    _ = cmd.Start()
    msg("MyWay", "Instalação concluída.\n\nO MyWay v"+version+" foi instalado em:\n"+dst+"\n\nO aplicativo será aberto agora.", mbOK|mbIconInfo)
}
