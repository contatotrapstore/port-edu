# Traz para a frente a janela onde a sessão roda. Varre TODAS as janelas de topo (o Trae e o VS Code abrem
# várias janelas no mesmo processo, e o Get-Process só enxerga uma), compara o título com os termos e
# prefere editores e terminais. Uso: focar.ps1 -Termos "Central · MX Corp","Marcelo"
param([string[]]$Termos)
$Termos = ($Termos -join ",") -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ }
Add-Type @"
using System; using System.Text; using System.Collections.Generic; using System.Runtime.InteropServices;
public class Janelas {
  public delegate bool Cb(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] static extern bool EnumWindows(Cb f, IntPtr l);
  [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern void keybd_event(byte k, byte s, uint f, UIntPtr e);
  public static List<object[]> Todas() {
    var r = new List<object[]>();
    EnumWindows((h, l) => { if (!IsWindowVisible(h)) return true; var s = new StringBuilder(512); GetWindowText(h, s, 512);
      if (s.Length == 0) return true; uint pid; GetWindowThreadProcessId(h, out pid); r.Add(new object[]{ h, s.ToString(), (int)pid }); return true; }, IntPtr.Zero);
    return r;
  }
}
"@
$ordem = @('Trae', 'Code', 'Cursor', 'Windsurf', 'WindowsTerminal', 'pwsh', 'powershell', 'cmd')
$nomes = @{}; Get-Process | ForEach-Object { $nomes[$_.Id] = $_.ProcessName }
$todas = [Janelas]::Todas() | ForEach-Object { [pscustomobject]@{ H = $_[0]; Titulo = $_[1]; Proc = $nomes[$_[2]] } }
foreach ($t in $Termos) {
  if (-not $t) { continue }
  $alvo = $todas | Where-Object { $_.Titulo -like ('*' + $t + '*') -and $_.Proc -ne 'chrome' -and $_.Proc -ne 'msedge' } |
    Sort-Object { $i = $ordem.IndexOf($_.Proc); if ($i -lt 0) { 99 } else { $i } } | Select-Object -First 1
  if ($alvo) {
    if ([Janelas]::IsIconic($alvo.H)) { [void][Janelas]::ShowWindow($alvo.H, 9) }
    # o Windows só deixa trocar o foco depois de uma tecla; um Alt "vazio" libera a troca
    [Janelas]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero); [Janelas]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
    [void][Janelas]::SetForegroundWindow($alvo.H)
    'ok ' + $alvo.Proc + ' · ' + $alvo.Titulo; exit
  }
}
'nada'
