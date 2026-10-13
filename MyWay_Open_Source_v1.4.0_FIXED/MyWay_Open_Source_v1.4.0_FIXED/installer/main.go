//go:build windows

package main

import (
	"embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"
	"unsafe"
)

//go:embed payload/MyWay.exe payload/MyWay.ico
var payload embed.FS

const version = "1.3.9"

const (
	mbOK           = 0
	mbYesNo        = 4
	mbIconInfo     = 0x40
	mbIconQuestion = 0x20
	mbIconError    = 0x10
	idYes          = 6

	wsOverlapped  = 0x00000000
	wsCaption     = 0x00C00000
	wsSysMenu     = 0x00080000
	wsMinimizeBox = 0x00020000
	wsVisible     = 0x10000000
	wsChild       = 0x40000000
	wsTabStop     = 0x00010000
	wsBorder      = 0x00800000
	esAutoHScroll = 0x0080
	bsAutoCheck   = 0x00000003
	ssLeft        = 0x00000000

	wmCreate  = 0x0001
	wmDestroy = 0x0002
	wmClose   = 0x0010
	wmCommand = 0x0111
	wmSetFont = 0x0030
	wmSetIcon = 0x0080

	bmSetCheck = 0x00F1
	bmGetCheck = 0x00F0
	bstChecked = 1

	idPath    = 1001
	idBrowse  = 1002
	idDesktop = 1003
	idStart   = 1004
	idLaunch  = 1005
	idInstall = 1006
	idCancel  = 1007
	idStatus  = 1008

	swShow = 5

	bifReturnOnlyFSDirs = 0x0001
	bifNewDialogStyle   = 0x0040
	imageIcon           = 1
	lrLoadFromFile      = 0x0010
	lrDefaultSize       = 0x0040
)

type point struct{ X, Y int32 }
type msg struct {
	Hwnd    uintptr
	Message uint32
	WParam  uintptr
	LParam  uintptr
	Time    uint32
	Pt      point
}
type wndClassEx struct {
	CbSize        uint32
	Style         uint32
	LpfnWndProc   uintptr
	CbClsExtra    int32
	CbWndExtra    int32
	HInstance     uintptr
	HIcon         uintptr
	HCursor       uintptr
	HbrBackground uintptr
	LpszMenuName  *uint16
	LpszClassName *uint16
	HIconSm       uintptr
}
type browseInfo struct {
	HwndOwner      uintptr
	PidlRoot       uintptr
	PszDisplayName *uint16
	LpszTitle      *uint16
	UlFlags        uint32
	Lpfn           uintptr
	LParam         uintptr
	IImage         int32
}

var (
	user32               = syscall.NewLazyDLL("user32.dll")
	kernel32             = syscall.NewLazyDLL("kernel32.dll")
	gdi32                = syscall.NewLazyDLL("gdi32.dll")
	shell32              = syscall.NewLazyDLL("shell32.dll")
	ole32                = syscall.NewLazyDLL("ole32.dll")
	messageBoxW          = user32.NewProc("MessageBoxW")
	registerClassExW     = user32.NewProc("RegisterClassExW")
	createWindowExW      = user32.NewProc("CreateWindowExW")
	defWindowProcW       = user32.NewProc("DefWindowProcW")
	showWindow           = user32.NewProc("ShowWindow")
	updateWindow         = user32.NewProc("UpdateWindow")
	getMessageW          = user32.NewProc("GetMessageW")
	translateMessage     = user32.NewProc("TranslateMessage")
	dispatchMessageW     = user32.NewProc("DispatchMessageW")
	postQuitMessage      = user32.NewProc("PostQuitMessage")
	destroyWindow        = user32.NewProc("DestroyWindow")
	getWindowTextW       = user32.NewProc("GetWindowTextW")
	setWindowTextW       = user32.NewProc("SetWindowTextW")
	sendMessageW         = user32.NewProc("SendMessageW")
	enableWindow         = user32.NewProc("EnableWindow")
	loadCursorW          = user32.NewProc("LoadCursorW")
	loadImageW           = user32.NewProc("LoadImageW")
	getModuleHandleW     = kernel32.NewProc("GetModuleHandleW")
	getStockObject       = gdi32.NewProc("GetStockObject")
	shBrowseForFolderW   = shell32.NewProc("SHBrowseForFolderW")
	shGetPathFromIDListW = shell32.NewProc("SHGetPathFromIDListW")
	coTaskMemFree        = ole32.NewProc("CoTaskMemFree")

	hwndMain, hPath, hDesktop, hStart, hLaunch, hInstall, hCancel, hStatus uintptr
	fontHandle                                                             uintptr
	windowIcon                                                             uintptr
)

func u16(s string) *uint16    { p, _ := syscall.UTF16PtrFromString(s); return p }
func loword(v uintptr) uint16 { return uint16(v & 0xffff) }

func message(title, text string, flags uintptr) int {
	r, _, _ := messageBoxW.Call(0, uintptr(unsafe.Pointer(u16(text))), uintptr(unsafe.Pointer(u16(title))), flags)
	return int(r)
}

func defaultInstallDir() string {
	p := os.Getenv("LOCALAPPDATA")
	if p == "" {
		p = filepath.Join(os.Getenv("USERPROFILE"), "AppData", "Local")
	}
	return filepath.Join(p, "Programs", "MyWay")
}

func registryInstallDir() string {
	key := `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\MyWay`
	cmd := exec.Command("reg.exe", "query", key, "/v", "InstallLocation")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	b, err := cmd.Output()
	if err != nil {
		return ""
	}
	for _, line := range strings.Split(string(b), "\n") {
		if i := strings.Index(line, "REG_SZ"); i >= 0 {
			return strings.TrimSpace(line[i+len("REG_SZ"):])
		}
	}
	return ""
}

func hidden(name string, args ...string) error {
	c := exec.Command(name, args...)
	c.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return c.Run()
}
func quotePS(s string) string { return "'" + strings.ReplaceAll(s, "'", "''") + "'" }
func stop()                   { _ = hidden("taskkill.exe", "/IM", "MyWay.exe", "/F"); time.Sleep(300 * time.Millisecond) }

func removeShortcuts() {
	ps := `$ErrorActionPreference='SilentlyContinue';$d=[Environment]::GetFolderPath('Desktop');Remove-Item -Force (Join-Path $d 'MyWay.lnk');Remove-Item -Recurse -Force (Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\MyWay')`
	_ = hidden("powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps)
}
func shortcuts(dst string, desktop, startMenu bool) {
	removeShortcuts()
	exe := filepath.Join(dst, "MyWay.exe")
	ico := filepath.Join(dst, "MyWay.ico")
	parts := []string{`$ErrorActionPreference='SilentlyContinue';$w=New-Object -ComObject WScript.Shell;`}
	if desktop {
		parts = append(parts, `$d=[Environment]::GetFolderPath('Desktop');$s=$w.CreateShortcut((Join-Path $d 'MyWay.lnk'));$s.TargetPath=`+quotePS(exe)+`;$s.WorkingDirectory=`+quotePS(dst)+`;$s.IconLocation=`+quotePS(ico+",0")+`;$s.Description='MyWay';$s.Save();`)
	}
	if startMenu {
		parts = append(parts, `$m=Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\MyWay';New-Item -Force -ItemType Directory -Path $m|Out-Null;$s=$w.CreateShortcut((Join-Path $m 'MyWay.lnk'));$s.TargetPath=`+quotePS(exe)+`;$s.WorkingDirectory=`+quotePS(dst)+`;$s.IconLocation=`+quotePS(ico+",0")+`;$s.Description='MyWay';$s.Save();`)
	}
	_ = hidden("powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", strings.Join(parts, ""))
}

func copySelf(src, dst string) error {
	b, e := os.ReadFile(src)
	if e != nil {
		return e
	}
	return os.WriteFile(dst, b, 0o755)
}
func register(dst, self string) {
	u := filepath.Join(dst, "Desinstalar_MyWay.exe")
	_ = copySelf(self, u)
	key := `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\MyWay`
	vals := [][]string{
		{"DisplayName", "MyWay Open"}, {"DisplayVersion", version}, {"InstallLocation", dst},
		{"UninstallString", `"` + u + `"`}, {"DisplayIcon", filepath.Join(dst, "MyWay.ico")}, {"Publisher", "MyWay"},
	}
	for _, v := range vals {
		_ = hidden("reg.exe", "add", key, "/v", v[0], "/t", "REG_SZ", "/d", v[1], "/f")
	}
}

func uninstall() {
	if message("MyWay", "Remover o MyWay deste computador?\n\nSeus dados em AppData\\Local\\MyWay serão preservados.", mbYesNo|mbIconQuestion) != idYes {
		return
	}
	stop()
	removeShortcuts()
	_ = hidden("reg.exe", "delete", `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\MyWay`, "/f")
	self, _ := os.Executable()
	dst := filepath.Dir(self)
	ps := `Start-Sleep -Seconds 2; Remove-Item -Recurse -Force ` + quotePS(dst)
	c := exec.Command("powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-Command", ps)
	c.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	_ = c.Start()
	message("MyWay", "MyWay removido. Seus dados pessoais foram preservados.", mbOK|mbIconInfo)
}

func checkboxChecked(hwnd uintptr) bool {
	r, _, _ := sendMessageW.Call(hwnd, bmGetCheck, 0, 0)
	return r == bstChecked
}
func setChecked(hwnd uintptr, on bool) {
	var v uintptr
	if on {
		v = bstChecked
	}
	sendMessageW.Call(hwnd, bmSetCheck, v, 0)
}
func setText(hwnd uintptr, s string) { setWindowTextW.Call(hwnd, uintptr(unsafe.Pointer(u16(s)))) }
func text(hwnd uintptr) string {
	buf := make([]uint16, 2048)
	r, _, _ := getWindowTextW.Call(hwnd, uintptr(unsafe.Pointer(&buf[0])), uintptr(len(buf)))
	return syscall.UTF16ToString(buf[:int(r)])
}

func createControl(class, caption string, style uint32, x, y, w, height int32, id int) uintptr {
	hwnd, _, _ := createWindowExW.Call(0, uintptr(unsafe.Pointer(u16(class))), uintptr(unsafe.Pointer(u16(caption))), uintptr(style), uintptr(x), uintptr(y), uintptr(w), uintptr(height), hwndMain, uintptr(id), 0, 0)
	if hwnd != 0 && fontHandle != 0 {
		sendMessageW.Call(hwnd, wmSetFont, fontHandle, 1)
	}
	return hwnd
}

func browseFolder(owner uintptr) string {
	display := make([]uint16, 260)
	bi := browseInfo{HwndOwner: owner, PszDisplayName: &display[0], LpszTitle: u16("Escolha a pasta onde o MyWay será instalado"), UlFlags: bifReturnOnlyFSDirs | bifNewDialogStyle}
	pidl, _, _ := shBrowseForFolderW.Call(uintptr(unsafe.Pointer(&bi)))
	if pidl == 0 {
		return ""
	}
	defer coTaskMemFree.Call(pidl)
	pathBuf := make([]uint16, 32768)
	ok, _, _ := shGetPathFromIDListW.Call(pidl, uintptr(unsafe.Pointer(&pathBuf[0])))
	if ok == 0 {
		return ""
	}
	return syscall.UTF16ToString(pathBuf)
}

func install(dst string, desktop, startMenu bool) (string, error) {
	dst = filepath.Clean(strings.TrimSpace(dst))
	if dst == "." || dst == "" {
		return "", fmt.Errorf("escolha uma pasta de instalação")
	}
	stop()
	if err := os.MkdirAll(dst, 0o755); err != nil {
		return "", err
	}
	b, err := payload.ReadFile("payload/MyWay.exe")
	if err != nil {
		return "", err
	}
	exe := filepath.Join(dst, "MyWay.exe")
	if err = os.WriteFile(exe, b, 0o755); err != nil {
		return "", err
	}
	ico, err := payload.ReadFile("payload/MyWay.ico")
	if err != nil {
		return "", err
	}
	if err = os.WriteFile(filepath.Join(dst, "MyWay.ico"), ico, 0o644); err != nil {
		return "", err
	}
	self, _ := os.Executable()
	register(dst, self)
	shortcuts(dst, desktop, startMenu)
	return exe, nil
}

func wndProc(hwnd uintptr, messageID uint32, wParam, lParam uintptr) uintptr {
	switch messageID {
	case wmCreate:
		hwndMain = hwnd
		fontHandle, _, _ = getStockObject.Call(17) // DEFAULT_GUI_FONT
		createControl("STATIC", "Instalar MyWay", wsChild|wsVisible|ssLeft, 30, 24, 520, 34, 0)
		createControl("STATIC", "Escolha onde instalar o aplicativo. Seus dados pessoais ficam separados e são preservados em atualizações.", wsChild|wsVisible|ssLeft, 30, 64, 540, 42, 0)
		createControl("STATIC", "Pasta de instalação", wsChild|wsVisible|ssLeft, 30, 120, 190, 22, 0)
		initial := registryInstallDir()
		if initial == "" {
			initial = defaultInstallDir()
		}
		hPath = createControl("EDIT", initial, wsChild|wsVisible|wsTabStop|wsBorder|esAutoHScroll, 30, 146, 430, 28, idPath)
		createControl("BUTTON", "Procurar...", wsChild|wsVisible|wsTabStop, 470, 144, 100, 31, idBrowse)
		hDesktop = createControl("BUTTON", "Criar atalho na Área de Trabalho", wsChild|wsVisible|wsTabStop|bsAutoCheck, 30, 204, 310, 26, idDesktop)
		hStart = createControl("BUTTON", "Adicionar ao Menu Iniciar", wsChild|wsVisible|wsTabStop|bsAutoCheck, 30, 236, 310, 26, idStart)
		hLaunch = createControl("BUTTON", "Abrir o MyWay ao concluir", wsChild|wsVisible|wsTabStop|bsAutoCheck, 30, 268, 310, 26, idLaunch)
		setChecked(hDesktop, true)
		setChecked(hStart, true)
		setChecked(hLaunch, true)
		hStatus = createControl("STATIC", "Pronto para instalar.", wsChild|wsVisible|ssLeft, 30, 314, 330, 24, idStatus)
		hCancel = createControl("BUTTON", "Cancelar", wsChild|wsVisible|wsTabStop, 368, 350, 96, 34, idCancel)
		hInstall = createControl("BUTTON", "Instalar", wsChild|wsVisible|wsTabStop, 474, 350, 96, 34, idInstall)
		if windowIcon != 0 {
			sendMessageW.Call(hwnd, wmSetIcon, 1, windowIcon)
			sendMessageW.Call(hwnd, wmSetIcon, 0, windowIcon)
		}
		return 0
	case wmCommand:
		switch loword(wParam) {
		case idBrowse:
			if p := browseFolder(hwnd); p != "" {
				setText(hPath, p)
			}
			return 0
		case idCancel:
			destroyWindow.Call(hwnd)
			return 0
		case idInstall:
			enableWindow.Call(hInstall, 0)
			enableWindow.Call(hCancel, 0)
			setText(hStatus, "Instalando…")
			exe, err := install(text(hPath), checkboxChecked(hDesktop), checkboxChecked(hStart))
			if err != nil {
				setText(hStatus, "Não foi possível concluir.")
				enableWindow.Call(hInstall, 1)
				enableWindow.Call(hCancel, 1)
				message("Erro ao instalar MyWay", err.Error(), mbOK|mbIconError)
				return 0
			}
			setText(hStatus, "Instalação concluída.")
			if checkboxChecked(hLaunch) {
				c := exec.Command(exe)
				c.Dir = filepath.Dir(exe)
				_ = c.Start()
			}
			message("MyWay", "Instalação concluída.\n\nO atalho foi criado com o ícone do MyWay e você pode alterar a pasta em futuras instalações.", mbOK|mbIconInfo)
			destroyWindow.Call(hwnd)
			return 0
		}
	case wmClose:
		destroyWindow.Call(hwnd)
		return 0
	case wmDestroy:
		postQuitMessage.Call(0)
		return 0
	}
	r, _, _ := defWindowProcW.Call(hwnd, uintptr(messageID), wParam, lParam)
	return r
}

func loadInstallerIcon() (uintptr, func()) {
	b, err := payload.ReadFile("payload/MyWay.ico")
	if err != nil {
		return 0, func() {}
	}
	f, err := os.CreateTemp("", "myway-installer-*.ico")
	if err != nil {
		return 0, func() {}
	}
	name := f.Name()
	_, _ = f.Write(b)
	_ = f.Close()
	h, _, _ := loadImageW.Call(0, uintptr(unsafe.Pointer(u16(name))), imageIcon, 0, 0, lrLoadFromFile|lrDefaultSize)
	return h, func() { _ = os.Remove(name) }
}

func runInstallerWindow() error {
	inst, _, _ := getModuleHandleW.Call(0)
	windowIcon, cleanup := loadInstallerIcon()
	defer cleanup()
	className := u16("MyWayInstaller134")
	cursor, _, _ := loadCursorW.Call(0, 32512) // IDC_ARROW
	wc := wndClassEx{CbSize: uint32(unsafe.Sizeof(wndClassEx{})), LpfnWndProc: syscall.NewCallback(wndProc), HInstance: inst, HIcon: windowIcon, HCursor: cursor, HbrBackground: 16, LpszClassName: className, HIconSm: windowIcon}
	if r, _, e := registerClassExW.Call(uintptr(unsafe.Pointer(&wc))); r == 0 {
		return fmt.Errorf("não foi possível iniciar o instalador: %v", e)
	}
	style := uint32(wsOverlapped | wsCaption | wsSysMenu | wsMinimizeBox)
	hwnd, _, e := createWindowExW.Call(0, uintptr(unsafe.Pointer(className)), uintptr(unsafe.Pointer(u16("MyWay Open v"+version+" — Instalação"))), uintptr(style), 0x80000000, 0x80000000, 620, 450, 0, 0, inst, 0)
	if hwnd == 0 {
		return fmt.Errorf("não foi possível abrir o instalador: %v", e)
	}
	hwndMain = hwnd
	showWindow.Call(hwnd, swShow)
	updateWindow.Call(hwnd)
	var m msg
	for {
		r, _, _ := getMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
		if int32(r) <= 0 {
			break
		}
		translateMessage.Call(uintptr(unsafe.Pointer(&m)))
		dispatchMessageW.Call(uintptr(unsafe.Pointer(&m)))
	}
	return nil
}

func main() {
	self, _ := os.Executable()
	if strings.HasPrefix(strings.ToLower(filepath.Base(self)), "desinstalar_myway") {
		uninstall()
		return
	}
	if err := runInstallerWindow(); err != nil {
		message("MyWay", err.Error(), mbOK|mbIconError)
	}
}
