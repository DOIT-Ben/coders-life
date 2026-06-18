$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$buildScript = Join-Path $scriptDir 'build-popup-datasets.ps1'

Write-Warning 'parse-popup-pool.ps1 is deprecated. Use build-popup-datasets.ps1 as the single official popup dataset builder.'
& $buildScript
