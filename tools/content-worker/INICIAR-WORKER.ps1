$ErrorActionPreference = 'Stop'
$workerRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $workerRoot
$workerScript = Join-Path $PSScriptRoot 'scripts/worker-loop.mjs'
$nodeBinary = (Get-Command node -ErrorAction Stop).Source
$logFolder = Join-Path $repoRoot 'output/conteudo/worker-logs'
New-Item -ItemType Directory -Path $logFolder -Force | Out-Null
$existingWorker = Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($workerScript) }
if ($existingWorker) { Write-Output 'Worker já está em execução.'; exit 0 }
$workerProcess = Start-Process -FilePath $nodeBinary -ArgumentList @('"' + $workerScript + '"') -WorkingDirectory $repoRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logFolder 'stdout.log') -RedirectStandardError (Join-Path $logFolder 'stderr.log') -PassThru
Write-Output ('Worker local iniciado. PID: ' + $workerProcess.Id)
