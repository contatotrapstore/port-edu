# Liga o agente da Central junto com o Windows (ou desliga, com -Remover).
# Cria um atalho na pasta Inicializar que roda scripts\iniciar-oculto.vbs: sem janela, log em data\agente.log.
# Uso: npm run autostart:on  |  npm run autostart:off
param([switch]$Remover, [switch]$IniciarAgora)
$startup = [Environment]::GetFolderPath('Startup')
$lnk = Join-Path $startup 'Central de Agentes EDevsHub.lnk'
$vbs = Join-Path $PSScriptRoot 'iniciar-oculto.vbs'
if ($Remover) { if (Test-Path $lnk) { Remove-Item $lnk; 'Atalho removido. O agente não abre mais com o Windows.' } else { 'Nenhum atalho para remover.' }; exit 0 }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Error 'Node não encontrado no PATH.'; exit 1 }
$sh = New-Object -ComObject WScript.Shell
$s = $sh.CreateShortcut($lnk)
$s.TargetPath = Join-Path $env:WINDIR 'System32\wscript.exe'
$s.Arguments = '"' + $vbs + '"'
$s.WorkingDirectory = Split-Path $PSScriptRoot
$s.Description = 'Agente local da Central de Agentes EDevsHub'
$s.Save()
"Atalho criado: $lnk"
if ($IniciarAgora) { Start-Process -FilePath (Join-Path $env:WINDIR 'System32\wscript.exe') -ArgumentList ('"' + $vbs + '"'); 'Agente iniciado em segundo plano: http://localhost:4321/predio' }
