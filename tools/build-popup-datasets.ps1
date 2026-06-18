$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $scriptDir
$sourceDir = Join-Path $root 'docs'
$outputDir = Join-Path $root 'data'
$files = Get-ChildItem -LiteralPath $sourceDir | Sort-Object Name
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$expectedCount = 1325
$htmlPath = (Get-ChildItem -LiteralPath $root -Filter '*.html' | Select-Object -First 1 -ExpandProperty FullName)
if (-not $htmlPath) {
    throw "Missing HTML entry file in $root"
}
$html = Get-Content -LiteralPath $htmlPath -Encoding UTF8 -Raw
$runtimeMatch = [regex]::Match($html, '<script\s+src="([^"]+_2026-06-18\.js)"></script>')
if (-not $runtimeMatch.Success) {
    throw "Missing runtime popup script reference in HTML"
}
$runtimeJs = Join-Path $root $runtimeMatch.Groups[1].Value

function Decode-SourceName {
    param([string]$Value)
    return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Value))
}

function Resolve-SourceDoc {
    param([string]$Name)

    $path = Join-Path $sourceDir $Name
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing source markdown: $path"
    }
    return $path
}

function New-TempOutputPath {
    param([string]$Path)

    $directory = Split-Path -Parent $Path
    $fileName = Split-Path -Leaf $Path
    $uniqueSuffix = "$PID.$([System.Guid]::NewGuid().ToString('N'))"
    return (Join-Path $directory ".$fileName.$uniqueSuffix.tmp")
}

function Commit-AtomicFile {
    param(
        [string]$TempPath,
        [string]$FinalPath
    )

    $resolvedTemp = [System.IO.Path]::GetFullPath($TempPath)
    $resolvedFinal = [System.IO.Path]::GetFullPath($FinalPath)
    $resolvedTempDir = [System.IO.Path]::GetDirectoryName($resolvedTemp)
    $resolvedFinalDir = [System.IO.Path]::GetDirectoryName($resolvedFinal)
    if ($resolvedTempDir -ne $resolvedFinalDir) {
        throw "Atomic replace requires temp and final paths in the same directory: $resolvedTemp -> $resolvedFinal"
    }
    if ([System.IO.File]::Exists($resolvedFinal)) {
        $uniqueSuffix = "$PID.$([System.Guid]::NewGuid().ToString('N'))"
        $backupPath = "$resolvedFinal.$uniqueSuffix.replace-backup"
        if ([System.IO.File]::Exists($backupPath)) {
            [System.IO.File]::Delete($backupPath)
        }
        [System.IO.File]::Replace($resolvedTemp, $resolvedFinal, $backupPath, $true)
        if ([System.IO.File]::Exists($backupPath)) {
            [System.IO.File]::Delete($backupPath)
        }
        return
    }
    [System.IO.File]::Move($resolvedTemp, $resolvedFinal)
}

function Write-AtomicTextFile {
    param(
        [string]$Path,
        [string]$Content,
        [scriptblock]$Validate
    )

    $tempPath = New-TempOutputPath -Path $Path
    try {
        $Content | Set-Content -LiteralPath $tempPath -Encoding UTF8
        if ($Validate) {
            & $Validate $tempPath
        }
        Commit-AtomicFile -TempPath $tempPath -FinalPath $Path
    } catch {
        if (Test-Path -LiteralPath $tempPath) {
            Remove-Item -LiteralPath $tempPath -Force
        }
        throw
    }
}

function Write-AtomicCsvFile {
    param(
        [string]$Path,
        [object[]]$Rows,
        [scriptblock]$Validate
    )

    $tempPath = New-TempOutputPath -Path $Path
    try {
        $Rows | Export-Csv -LiteralPath $tempPath -NoTypeInformation -Encoding UTF8
        if ($Validate) {
            & $Validate $tempPath
        }
        Commit-AtomicFile -TempPath $tempPath -FinalPath $Path
    } catch {
        if (Test-Path -LiteralPath $tempPath) {
            Remove-Item -LiteralPath $tempPath -Force
        }
        throw
    }
}

function Assert-JsonArrayFileCount {
    param(
        [string]$Path,
        [int]$ExpectedCount
    )

    $data = Get-Content -LiteralPath $Path -Encoding UTF8 -Raw | ConvertFrom-Json
    if (($data | Measure-Object).Count -ne $ExpectedCount) {
        throw "Output JSON count mismatch for ${Path}: expected $ExpectedCount, got $(($data | Measure-Object).Count)"
    }
}

function Assert-RuntimeFileCount {
    param(
        [string]$Path,
        [int]$ExpectedCount
    )

    $content = Get-Content -LiteralPath $Path -Encoding UTF8 -Raw
    if ($content -notmatch '^window\.PROGRAMMER_POPUP_POOL\s*=\s*') {
        throw "Runtime output missing PROGRAMMER_POPUP_POOL assignment: $Path"
    }
    $json = $content -replace '^window\.PROGRAMMER_POPUP_POOL\s*=\s*', ''
    $json = $json -replace ';\s*$', ''
    $data = $json | ConvertFrom-Json
    if (($data | Measure-Object).Count -ne $ExpectedCount) {
        throw "Runtime output count mismatch for ${Path}: expected $ExpectedCount, got $(($data | Measure-Object).Count)"
    }
}

$sourceDefs = @(
    @{
        Path = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF8yMDI2LTA2LTE3Lm1k')
        Version = '2026-06-17'
        Scope = 'work-core'
        MinId = 1
        MaxId = 240
    },
    @{
        Path = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF/lhajnu7TluqbniYhfMjAyNi0wNi0xOC5tZA==')
        Version = '2026-06-18'
        Scope = 'full-spectrum'
        MinId = 241
        MaxId = 435
    }
)

$lifeExtensionSource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF/nlJ/mtLvlrabkuaDmianlsZVfMjAyNi0wNi0xOC5tZA==')

foreach ($def in $sourceDefs) {
    if (-not (Test-Path -LiteralPath $def.Path)) {
        throw "Missing source markdown for version $($def.Version): $($def.Path)"
    }
}
if (-not (Test-Path -LiteralPath $lifeExtensionSource)) {
    throw "Missing life extension source markdown: $lifeExtensionSource"
}

function Get-StructuredItems {
    param(
        [string]$Path,
        [string]$Version,
        [string]$Scope,
        [int]$MinId,
        [int]$MaxId
    )

    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $section = ''
    $sectionCode = ''
    $inPool = $false
    $items = New-Object System.Collections.Generic.List[object]

    foreach ($line in $lines) {
        if ($line -match '^###\s+([A-Z])\.\s+(.+)$') {
            $inPool = $true
            $sectionCode = $matches[1]
            $section = $matches[2].Trim()
            continue
        }

        if ($inPool -and $line -match '^##\s+' -and $line -notmatch '^###\s+') {
            $inPool = $false
            $section = ''
            $sectionCode = ''
            continue
        }

        if (-not $inPool) { continue }

        if ($line -match '^\s*(\d+)\.\s+(.+?)\s*$') {
            $id = [int]$matches[1]
            if ($id -lt $MinId -or $id -gt $MaxId) { continue }
            if (-not $section) { continue }

            $text = $matches[2].Trim()
            $items.Add([pscustomobject]@{
                id = $id
                text = $text
                section_code = $sectionCode
                section_name = $section
                source_version = $Version
                source_scope = $Scope
            })
        }
    }

    return $items
}

function Get-Kind {
    param([string]$SectionCode, [int]$Id)
    switch ($SectionCode) {
        'N' { return 'learning' }
        'O' { return 'health' }
        'M' { return 'life' }
        'P' { return 'life' }
        'L' { return 'joke' }
        'A' { return 'event' }
        'B' { return 'event' }
        'C' { return 'event' }
        'D' { return 'event' }
        'E' { return 'event' }
        'F' { return 'event' }
        'G' { return 'event' }
        'H' { return 'event' }
        'I' { return 'event' }
        'J' { return 'event' }
        'K' { return 'event' }
        default {
            if ($Id -ge 241) { return 'life' }
            return 'light'
        }
    }
}

function Get-Tone {
    param([string]$Text, [string]$SectionCode, [string]$Kind)
    if ($Text -match 'AI|WFH|Slack|async|README|Git|LeetCode|PR|NAS') {
        return 'wry'
    }
    if ($Kind -eq 'health') {
        return 'gentle'
    }
    if ($SectionCode -in @('C','G','K')) {
        return 'sharp'
    }
    if ($SectionCode -in @('L','P')) {
        return 'wry'
    }
    return 'resonant'
}

function Get-Rarity {
    param([int]$Id, [string]$Kind, [string]$Tone)
    if ($Tone -eq 'sharp') { return 'rare' }
    if ($Kind -eq 'health' -or $Kind -eq 'learning') { return 'uncommon' }
    if ($Kind -eq 'event') { return 'uncommon' }
    return 'common'
}

function Get-BaseEffects {
    param([string]$Kind, [string]$Tone, [string]$Text, [string]$SectionCode)

    $skill = 0
    $mental = 0
    $money = 0
    $ai = 0

    switch ($Kind) {
        'learning' {
            $skill = 2
            $mental = -4
            if ($Text -match 'AI') { $ai = 3 }
        }
        'health' {
            $mental = 3
            if ($Tone -eq 'sharp') { $mental = -8 }
        }
        'life' {
            $mental = -3
            if ($SectionCode -eq 'P') { $money = -2 }
        }
        'event' {
            $skill = 2
            $mental = -8
            if ($Text -match 'AI') { $ai = 2 }
        }
        'joke' {
            $mental = 2
        }
        default {
            $mental = -2
        }
    }

    if ($Tone -eq 'sharp') {
        $mental -= 6
        if ($Kind -eq 'event') { $skill += 2 }
    } elseif ($Tone -eq 'gentle') {
        $mental += 2
    } elseif ($Tone -eq 'wry') {
        $mental += 1
    }

    return @{
        skill = $skill
        mental = $mental
        money = $money
        ai = $ai
    }
}

function Get-Trigger {
    param([string]$Kind, [string]$SectionCode, [string]$Text, [int]$Id)

    $trigger = [ordered]@{}

    switch ($SectionCode) {
        'K' { $trigger.minAge = 33; break }
        'O' { $trigger.minDay = 20; break }
        'N' { $trigger.minSkill = 20; break }
        'M' { $trigger.minDay = 5; break }
        'P' { $trigger.minMoney = 10; break }
    }

    if ($Text -match 'AI') {
        $trigger.minAi = 25
    }
    if ($Text -match '远程|WFH|Slack|async') {
        $currentMinDay = if ($trigger.Contains('minDay')) { [int]$trigger.minDay } else { 0 }
        $trigger.minDay = [Math]::Max($currentMinDay, 10)
    }
    if ($Text -match '加班|事故|报警|别睡') {
        $currentMinDay = if ($trigger.Contains('minDay')) { [int]$trigger.minDay } else { 0 }
        $trigger.minDay = [Math]::Max($currentMinDay, 15)
        $trigger.maxMental = 70
    }
    if ($SectionCode -eq 'P') {
        $currentMinMoney = if ($trigger.Contains('minMoney')) { [int]$trigger.minMoney } else { 0 }
        $trigger.minMoney = [Math]::Max($currentMinMoney, 15)
    }

    if ($trigger.Count -eq 0) {
        $trigger.minDay = 1
    }

    return $trigger
}

function Decode-Utf8Base64 {
    param([string]$Value)
    return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Value))
}

function Try-ParseJsonLine {
    param(
        [string]$Line,
        [string]$Path,
        [int]$LineNumber
    )

    $trimmed = $Line.Trim()
    if (-not $trimmed.StartsWith('{')) { return $null }
    try {
        return $trimmed | ConvertFrom-Json
    } catch {
        throw "Invalid JSONL at ${Path}:${LineNumber}: $($_.Exception.Message)"
    }
}

function Get-LifeExtensionItems {
    param([string]$Path)

    $actionLimits = [ordered]@{
        'rest' = 8
        'learn-ai' = 7
        'networking' = 7
        'side-project' = 7
        'overtime' = 6
        'interview' = 5
    }
    $actionCounts = @{}
    foreach ($key in $actionLimits.Keys) { $actionCounts[$key] = 0 }
    $overflowCounts = @{}
    foreach ($key in $actionLimits.Keys) { $overflowCounts[$key] = 0 }

    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        if (-not $action -or -not $text) {
            throw "Life extension JSONL missing action/text at ${Path}:${lineNumber}"
        }
        if (-not $actionLimits.Contains($action)) {
            throw "Unknown life extension action '$action' at ${Path}:${lineNumber}"
        }
        if ($actionCounts[$action] -ge $actionLimits[$action]) {
            $overflowCounts[$action] += 1
            continue
        }

        $actionCounts[$action] += 1
        $id = 435 + $items.Count + 1
        $map = switch ($action) {
            'rest' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '55Sf5rS744CB5YGl5bq35LiO5oGi5aSN'; Kind = 'health'
                Skill = 0; Mental = 7; Money = 0; Ai = 0; MinDay = 2
            } }
            'learn-ai' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 'QUnlrabkuaDkuI7lt6XlhbfnhKbomZE='; Kind = 'learning'
                Skill = 1; Mental = -4; Money = 0; Ai = 7; MinDay = 3
            } }
            'networking' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '56S+5Lqk44CB5a625bqt5LiO6L6555WM'; Kind = 'life'
                Skill = 0; Mental = 5; Money = 0; Ai = 0; MinDay = 5
            } }
            'side-project' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '5Ymv5Lia44CB54us56uL5byA5Y+R5LiO546w6YeR5rWB'; Kind = 'life'
                Skill = 2; Mental = -5; Money = 5; Ai = 0; MinDay = 7
            } }
            'overtime' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '5Yqg54+t44CB6YCa5Yuk5LiO55Sf5rS76L6555WM'; Kind = 'event'
                Skill = 3; Mental = -10; Money = 3; Ai = 0; MinDay = 2
            } }
            'interview' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '6Z2i6K+V44CBR2Fw5LiO5rGC6IGM55ay5Yqz'; Kind = 'learning'
                Skill = 3; Mental = -6; Money = 0; Ai = 0; MinDay = 10
            } }
        }

        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = $map.SectionCode
            section_name = $map.Category
            source_version = '2026-06-18-life-extension'
            source_scope = 'life-learning-extension'
            kind = $map.Kind
            tone = 'resonant'
            rarity = 'common'
            char_count = $text.Length
            skill = $map.Skill
            mental = $map.Mental
            money = $map.Money
            ai = $map.Ai
            source_action = $action
            trigger_min_day = $map.MinDay
        })
    }

    foreach ($action in $actionLimits.Keys) {
        if ($actionCounts[$action] -ne $actionLimits[$action]) {
            throw "Life extension action count mismatch for ${action}: expected $($actionLimits[$action]), got $($actionCounts[$action])"
        }
        if ($overflowCounts[$action] -gt 0) {
            Write-Host "INFO_LIFE_EXTENSION_IGNORED_OVER_LIMIT_${action}=$($overflowCounts[$action])"
        }
    }

    return $items
}

function Get-ResearchExtensionItems {
    param([string]$Path)

    $allowedActions = @('rest', 'overtime', 'networking', 'interview', 'side-project', 'learn-ai')
    $actionCounts = @{}
    $overflowCount = 0
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        if (-not $action -or -not $text) {
            throw "Research extension JSONL missing action/text at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown research extension action '$action' at ${Path}:${lineNumber}"
        }
        if (-not $tone) {
            throw "Missing research extension tone at ${Path}:${lineNumber}"
        }
        if ($items.Count -ge 100) {
            $overflowCount += 1
            continue
        }

        $id = 475 + $items.Count + 1
        $map = switch ($action) {
            'rest' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '55Sf5rS744CB5YGl5bq35LiO5oGi5aSN'; Kind = 'health'
                Skill = 0; Mental = 8; Money = 0; Ai = 0; MinDay = 3
            } }
            'overtime' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '5Yqg54+t44CB6YCa5Yuk5LiO55Sf5rS76L6555WM'; Kind = 'event'
                Skill = 3; Mental = -11; Money = 2; Ai = 0; MinDay = 3
            } }
            'networking' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '56S+5Lqk44CB5a625bqt5LiO6L6555WM'; Kind = 'life'
                Skill = 0; Mental = 6; Money = 0; Ai = 0; MinDay = 5
            } }
            'interview' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '6Z2i6K+V44CBR2Fw5LiO5rGC6IGM55ay5Yqz'; Kind = 'learning'
                Skill = 2; Mental = -7; Money = 0; Ai = 0; MinDay = 10
            } }
            'side-project' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 '5Ymv5Lia44CB54us56uL5byA5Y+R5LiO546w6YeR5rWB'; Kind = 'life'
                Skill = 2; Mental = -4; Money = 4; Ai = 0; MinDay = 7
            } }
            'learn-ai' { @{
                SectionCode = 'L'; Category = Decode-Utf8Base64 'QUnlrabkuaDkuI7lt6XlhbfnhKbomZE='; Kind = 'learning'
                Skill = 2; Mental = -3; Money = 0; Ai = 6; MinDay = 4
            } }
        }
        if (-not $map) {
            throw "Missing research extension mapping for action '$action' at ${Path}:${lineNumber}"
        }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = $map.SectionCode
            section_name = $map.Category
            source_version = '2026-06-18-research-extension'
            source_scope = 'research-extension'
            kind = $map.Kind
            tone = $tone
            rarity = 'common'
            char_count = $text.Length
            skill = $map.Skill
            mental = $map.Mental
            money = $map.Money
            ai = $map.Ai
            source_action = $action
            trigger_min_day = $map.MinDay
        })
        if (-not $actionCounts.Contains($action)) { $actionCounts[$action] = 0 }
        $actionCounts[$action] += 1
    }

    if ($items.Count -ne 100) {
        throw "Research extension count mismatch: expected 100, got $($items.Count)"
    }
    if ($overflowCount -gt 0) {
        Write-Host "INFO_RESEARCH_EXTENSION_IGNORED_OVER_LIMIT=$overflowCount"
    }

    return $items
}

function Get-Round7CommunityItems {
    param([string]$Path)

    $allowedActions = @('rest', 'overtime', 'networking', 'interview', 'side-project', 'learn-ai')
    $allowedTones = @('resonant', 'gentle', 'wry', 'sharp')
    $seenTexts = @{}
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        if (-not $action -or -not $text -or -not $tone) {
            throw "Round7 community JSONL missing action/text/tone at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown round7 community action '$action' at ${Path}:${lineNumber}"
        }
        if ($allowedTones -notcontains $tone) {
            throw "Unknown round7 community tone '$tone' at ${Path}:${lineNumber}"
        }
        if ($seenTexts.ContainsKey($text)) {
            throw "Duplicate round7 community text at ${Path}:${lineNumber}: $text"
        }
        $seenTexts[$text] = $true
        if ($items.Count -ge 120) {
            throw "Round7 community exceeds 120 items at ${Path}:${lineNumber}"
        }

        $id = 575 + $items.Count + 1
        $map = switch ($action) {
            'rest' { @{
                SectionCode = 'R'; Category = Decode-Utf8Base64 '55Sf5rS744CB5YGl5bq35LiO5oGi5aSN'; Kind = 'health'
                Skill = 0; Mental = 7; Money = 0; Ai = 0; MinDay = 2
            } }
            'learn-ai' { @{
                SectionCode = 'R'; Category = Decode-Utf8Base64 'QUnlrabkuaDkuI7lt6XlhbfnhKbomZE='; Kind = 'learning'
                Skill = 2; Mental = -3; Money = 0; Ai = 6; MinDay = 3
            } }
            'networking' { @{
                SectionCode = 'R'; Category = Decode-Utf8Base64 '56S+5Lqk44CB5a625bqt5LiO6L6555WM'; Kind = 'life'
                Skill = 0; Mental = 5; Money = 0; Ai = 0; MinDay = 4
            } }
            'side-project' { @{
                SectionCode = 'R'; Category = Decode-Utf8Base64 '5Ymv5Lia44CB54us56uL5byA5Y+R5LiO546w6YeR5rWB'; Kind = 'life'
                Skill = 2; Mental = -4; Money = 4; Ai = 0; MinDay = 6
            } }
            'overtime' { @{
                SectionCode = 'R'; Category = Decode-Utf8Base64 '5Yqg54+t44CB6YCa5Yuk5LiO55Sf5rS76L6555WM'; Kind = 'event'
                Skill = 3; Mental = -10; Money = 2; Ai = 0; MinDay = 3
            } }
            'interview' { @{
                SectionCode = 'R'; Category = Decode-Utf8Base64 '6Z2i6K+V44CBR2Fw5LiO5rGC6IGM55ay5Yqz'; Kind = 'learning'
                Skill = 3; Mental = -6; Money = 0; Ai = 0; MinDay = 8
            } }
        }
        $rarity = if ($tone -eq 'sharp') { 'uncommon' } else { 'common' }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = $map.SectionCode
            section_name = $map.Category
            source_version = '2026-06-18-round7'
            source_scope = 'round7-community-extension'
            kind = $map.Kind
            tone = $tone
            rarity = $rarity
            char_count = $text.Length
            skill = $map.Skill
            mental = $map.Mental
            money = $map.Money
            ai = $map.Ai
            source_action = $action
            trigger_min_day = $map.MinDay
        })
    }

    if ($items.Count -ne 120) {
        throw "Round7 community count mismatch: expected 120, got $($items.Count)"
    }

    return $items
}

function Get-Round8CommunityItems {
    param([string]$Path)

    $allowedActions = @('rest', 'overtime', 'networking', 'interview', 'side-project', 'learn-ai')
    $allowedTones = @('resonant', 'gentle', 'wry', 'sharp')
    $seenTexts = @{}
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        if (-not $action -or -not $text -or -not $tone) {
            throw "Round8 community JSONL missing action/text/tone at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown round8 community action '$action' at ${Path}:${lineNumber}"
        }
        if ($allowedTones -notcontains $tone) {
            throw "Unknown round8 community tone '$tone' at ${Path}:${lineNumber}"
        }
        if ($seenTexts.ContainsKey($text)) {
            throw "Duplicate round8 community text at ${Path}:${lineNumber}: $text"
        }
        $seenTexts[$text] = $true
        if ($items.Count -ge 120) {
            throw "Round8 community exceeds 120 items at ${Path}:${lineNumber}"
        }

        $id = 695 + $items.Count + 1
        $map = switch ($action) {
            'rest' { @{
                SectionCode = 'S'; Category = Decode-Utf8Base64 '55Sf5rS744CB5YGl5bq35LiO5oGi5aSN'; Kind = 'health'
                Skill = 0; Mental = 7; Money = 0; Ai = 0; MinDay = 2
            } }
            'learn-ai' { @{
                SectionCode = 'S'; Category = Decode-Utf8Base64 'QUnlrabkuaDkuI7lt6XlhbfnhKbomZE='; Kind = 'learning'
                Skill = 2; Mental = -3; Money = 0; Ai = 6; MinDay = 3
            } }
            'networking' { @{
                SectionCode = 'S'; Category = Decode-Utf8Base64 '56S+5Lqk44CB5a625bqt5LiO6L6555WM'; Kind = 'life'
                Skill = 0; Mental = 5; Money = 0; Ai = 0; MinDay = 4
            } }
            'side-project' { @{
                SectionCode = 'S'; Category = Decode-Utf8Base64 '5Ymv5Lia44CB54us56uL5byA5Y+R5LiO546w6YeR5rWB'; Kind = 'life'
                Skill = 2; Mental = -4; Money = 4; Ai = 0; MinDay = 6
            } }
            'overtime' { @{
                SectionCode = 'S'; Category = Decode-Utf8Base64 '5Yqg54+t44CB6YCa5Yuk5LiO55Sf5rS76L6555WM'; Kind = 'event'
                Skill = 3; Mental = -10; Money = 2; Ai = 0; MinDay = 3
            } }
            'interview' { @{
                SectionCode = 'S'; Category = Decode-Utf8Base64 '6Z2i6K+V44CBR2Fw5LiO5rGC6IGM55ay5Yqz'; Kind = 'learning'
                Skill = 3; Mental = -6; Money = 0; Ai = 0; MinDay = 8
            } }
        }
        $rarity = if ($tone -eq 'sharp') { 'uncommon' } else { 'common' }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = $map.SectionCode
            section_name = $map.Category
            source_version = '2026-06-18-round8'
            source_scope = 'round8-community-extension'
            kind = $map.Kind
            tone = $tone
            rarity = $rarity
            char_count = $text.Length
            skill = $map.Skill
            mental = $map.Mental
            money = $map.Money
            ai = $map.Ai
            source_action = $action
            trigger_min_day = $map.MinDay
        })
    }

    if ($items.Count -ne 120) {
        throw "Round8 community count mismatch: expected 120, got $($items.Count)"
    }

    return $items
}

function Get-Round9LifeItems {
    param([string]$Path)

    $allowedActions = @('rest', 'networking')
    $allowedTones = @('resonant', 'gentle', 'wry', 'sharp')
    $allowedKinds = @('health', 'life')
    $seenTexts = @{}
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        $kind = [string]$entry.kind
        $category = [string]$entry.category
        if (-not $action -or -not $text -or -not $tone -or -not $kind -or -not $category) {
            throw "Round9 life JSONL missing action/text/tone/kind/category at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown round9 life action '$action' at ${Path}:${lineNumber}"
        }
        if ($allowedTones -notcontains $tone) {
            throw "Unknown round9 life tone '$tone' at ${Path}:${lineNumber}"
        }
        if ($allowedKinds -notcontains $kind) {
            throw "Unknown round9 life kind '$kind' at ${Path}:${lineNumber}"
        }
        if ($seenTexts.ContainsKey($text)) {
            throw "Duplicate round9 life text at ${Path}:${lineNumber}: $text"
        }
        $seenTexts[$text] = $true
        if ($items.Count -ge 120) {
            throw "Round9 life exceeds 120 items at ${Path}:${lineNumber}"
        }

        $id = 815 + $items.Count + 1
        $effect = switch ($action) {
            'rest' { @{
                Skill = 0; Mental = if ($kind -eq 'health') { 8 } else { 5 }; Money = 0; Ai = 0; MinDay = 2
            } }
            'networking' { @{
                Skill = 0; Mental = 5; Money = 0; Ai = 0; MinDay = 4
            } }
        }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = 'T'
            section_name = $category
            source_version = '2026-06-18-round9-life'
            source_scope = 'round9-life-extension'
            kind = $kind
            tone = $tone
            rarity = if ($tone -eq 'sharp') { 'uncommon' } else { 'common' }
            char_count = $text.Length
            skill = $effect.Skill
            mental = $effect.Mental
            money = $effect.Money
            ai = $effect.Ai
            source_action = $action
            trigger_min_day = $effect.MinDay
        })
    }

    if ($items.Count -ne 120) {
        throw "Round9 life count mismatch: expected 120, got $($items.Count)"
    }

    return $items
}

function Get-Round9LearningItems {
    param([string]$Path)

    $allowedActions = @('rest', 'networking', 'interview', 'side-project', 'learn-ai')
    $allowedTones = @('resonant', 'gentle', 'wry', 'sharp')
    $allowedKinds = @('health', 'life', 'learning')
    $seenTexts = @{}
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        $kind = [string]$entry.kind
        $category = [string]$entry.category
        if (-not $action -or -not $text -or -not $tone -or -not $kind -or -not $category) {
            throw "Round9 learning JSONL missing action/text/tone/kind/category at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown round9 learning action '$action' at ${Path}:${lineNumber}"
        }
        if ($allowedTones -notcontains $tone) {
            throw "Unknown round9 learning tone '$tone' at ${Path}:${lineNumber}"
        }
        if ($allowedKinds -notcontains $kind) {
            throw "Unknown round9 learning kind '$kind' at ${Path}:${lineNumber}"
        }
        if ($seenTexts.ContainsKey($text)) {
            throw "Duplicate round9 learning text at ${Path}:${lineNumber}: $text"
        }
        $seenTexts[$text] = $true
        if ($items.Count -ge 120) {
            throw "Round9 learning exceeds 120 items at ${Path}:${lineNumber}"
        }

        $id = 935 + $items.Count + 1
        $effect = switch ($action) {
            'learn-ai' { @{
                Skill = 2; Mental = -3; Money = 0; Ai = 6; MinDay = 3
            } }
            'interview' { @{
                Skill = 3; Mental = -5; Money = 0; Ai = 0; MinDay = 8
            } }
            'side-project' { @{
                Skill = 2; Mental = -4; Money = 4; Ai = 0; MinDay = 6
            } }
            'networking' { @{
                Skill = 1; Mental = 4; Money = 0; Ai = 0; MinDay = 4
            } }
            'rest' { @{
                Skill = 0; Mental = 6; Money = 0; Ai = 0; MinDay = 2
            } }
        }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = 'U'
            section_name = $category
            source_version = '2026-06-18-round9-learning'
            source_scope = 'round9-learning-extension'
            kind = $kind
            tone = $tone
            rarity = if ($tone -eq 'sharp') { 'uncommon' } else { 'common' }
            char_count = $text.Length
            skill = $effect.Skill
            mental = $effect.Mental
            money = $effect.Money
            ai = $effect.Ai
            source_action = $action
            trigger_min_day = $effect.MinDay
        })
    }

    if ($items.Count -ne 120) {
        throw "Round9 learning count mismatch: expected 120, got $($items.Count)"
    }

    return $items
}

function Get-Round10LearningItems {
    param([string]$Path)

    $allowedActions = @('rest', 'networking', 'interview', 'side-project', 'learn-ai')
    $allowedTones = @('resonant', 'gentle', 'wry', 'sharp')
    $allowedKinds = @('health', 'life', 'learning')
    $seenTexts = @{}
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        $kind = [string]$entry.kind
        $category = [string]$entry.category
        if (-not $action -or -not $text -or -not $tone -or -not $kind -or -not $category) {
            throw "Round10 learning JSONL missing action/text/tone/kind/category at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown round10 learning action '$action' at ${Path}:${lineNumber}"
        }
        if ($allowedTones -notcontains $tone) {
            throw "Unknown round10 learning tone '$tone' at ${Path}:${lineNumber}"
        }
        if ($allowedKinds -notcontains $kind) {
            throw "Unknown round10 learning kind '$kind' at ${Path}:${lineNumber}"
        }
        if ($seenTexts.ContainsKey($text)) {
            throw "Duplicate round10 learning text at ${Path}:${lineNumber}: $text"
        }
        $seenTexts[$text] = $true
        if ($items.Count -ge 120) {
            throw "Round10 learning exceeds 120 items at ${Path}:${lineNumber}"
        }

        $id = 1055 + $items.Count + 1
        $effect = switch ($action) {
            'learn-ai' { @{
                Skill = 2; Mental = -3; Money = 0; Ai = 6; MinDay = 3
            } }
            'interview' { @{
                Skill = 3; Mental = -5; Money = 0; Ai = 0; MinDay = 8
            } }
            'side-project' { @{
                Skill = 2; Mental = -4; Money = 4; Ai = 0; MinDay = 6
            } }
            'networking' { @{
                Skill = 1; Mental = 4; Money = 0; Ai = 0; MinDay = 4
            } }
            'rest' { @{
                Skill = 0; Mental = 6; Money = 0; Ai = 0; MinDay = 2
            } }
        }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = 'V'
            section_name = $category
            source_version = '2026-06-18-round10-learning'
            source_scope = 'round10-learning-extension'
            kind = $kind
            tone = $tone
            rarity = if ($tone -eq 'sharp') { 'uncommon' } else { 'common' }
            char_count = $text.Length
            skill = $effect.Skill
            mental = $effect.Mental
            money = $effect.Money
            ai = $effect.Ai
            source_action = $action
            trigger_min_day = $effect.MinDay
        })
    }

    if ($items.Count -ne 120) {
        throw "Round10 learning count mismatch: expected 120, got $($items.Count)"
    }

    return $items
}

function Get-Round11LifeItems {
    param([string]$Path)

    $allowedActions = @('rest', 'networking')
    $allowedTones = @('resonant', 'gentle', 'wry', 'sharp')
    $allowedKinds = @('health', 'life')
    $seenTexts = @{}
    $items = New-Object System.Collections.Generic.List[object]
    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $lineNumber = 0
    foreach ($line in $lines) {
        $lineNumber += 1
        $entry = Try-ParseJsonLine -Line $line -Path $Path -LineNumber $lineNumber
        if (-not $entry) { continue }
        $action = [string]$entry.action
        $text = [string]$entry.text
        $tone = [string]$entry.tone
        $kind = [string]$entry.kind
        $category = [string]$entry.category
        if (-not $action -or -not $text -or -not $tone -or -not $kind -or -not $category) {
            throw "Round11 life JSONL missing action/text/tone/kind/category at ${Path}:${lineNumber}"
        }
        if ($allowedActions -notcontains $action) {
            throw "Unknown round11 life action '$action' at ${Path}:${lineNumber}"
        }
        if ($allowedTones -notcontains $tone) {
            throw "Unknown round11 life tone '$tone' at ${Path}:${lineNumber}"
        }
        if ($allowedKinds -notcontains $kind) {
            throw "Unknown round11 life kind '$kind' at ${Path}:${lineNumber}"
        }
        if ($seenTexts.ContainsKey($text)) {
            throw "Duplicate round11 life text at ${Path}:${lineNumber}: $text"
        }
        $seenTexts[$text] = $true
        if ($items.Count -ge 150) {
            throw "Round11 life exceeds 150 items at ${Path}:${lineNumber}"
        }

        $id = 1175 + $items.Count + 1
        $effect = switch ($action) {
            'rest' { @{
                Skill = 0; Mental = if ($kind -eq 'health') { 7 } else { 5 }; Money = 0; Ai = 0; MinDay = 2
            } }
            'networking' { @{
                Skill = 0; Mental = 5; Money = 0; Ai = 0; MinDay = 4
            } }
        }
        $items.Add([pscustomobject]@{
            id = $id
            text = $text
            section_code = 'W'
            section_name = $category
            source_version = '2026-06-18-round11-life'
            source_scope = 'round11-life-extension'
            kind = $kind
            tone = $tone
            rarity = if ($tone -eq 'sharp') { 'uncommon' } else { 'common' }
            char_count = $text.Length
            skill = $effect.Skill
            mental = $effect.Mental
            money = $effect.Money
            ai = $effect.Ai
            source_action = $action
            trigger_min_day = $effect.MinDay
        })
    }

    if ($items.Count -ne 150) {
        throw "Round11 life count mismatch: expected 150, got $($items.Count)"
    }

    return $items
}

$structured = foreach ($def in $sourceDefs) {
    Get-StructuredItems -Path $def.Path -Version $def.Version -Scope $def.Scope -MinId $def.MinId -MaxId $def.MaxId
}

$structured += Get-LifeExtensionItems -Path $lifeExtensionSource
$researchExtensionSource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF/osIPnoJTmianlsZVfMjAyNi0wNi0xOC5tZA==')
if (-not (Test-Path -LiteralPath $researchExtensionSource)) {
    throw "Missing research extension source markdown: $researchExtensionSource"
}
$structured += Get-ResearchExtensionItems -Path $researchExtensionSource
$round7CommunitySource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF9yb3VuZDfnpL7ljLrmianlsZVfMjAyNi0wNi0xOC5tZA==')
if (-not (Test-Path -LiteralPath $round7CommunitySource)) {
    throw "Missing round7 community source markdown: $round7CommunitySource"
}
$structured += Get-Round7CommunityItems -Path $round7CommunitySource
$round8CommunitySource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF9yb3VuZDjnpL7ljLrmianlsZVfMjAyNi0wNi0xOC5tZA==')
if (-not (Test-Path -LiteralPath $round8CommunitySource)) {
    throw "Missing round8 community source markdown: $round8CommunitySource"
}
$structured += Get-Round8CommunityItems -Path $round8CommunitySource
$round9LifeSource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF9yb3VuZDnnlJ/mtLvmianlsZVfMjAyNi0wNi0xOC5tZA==')
if (-not (Test-Path -LiteralPath $round9LifeSource)) {
    throw "Missing round9 life source markdown: $round9LifeSource"
}
$structured += Get-Round9LifeItems -Path $round9LifeSource
$round9LearningSource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF9yb3VuZDnlrabkuaDmianlsZVfMjAyNi0wNi0xOC5tZA==')
if (-not (Test-Path -LiteralPath $round9LearningSource)) {
    throw "Missing round9 learning source markdown: $round9LearningSource"
}
$structured += Get-Round9LearningItems -Path $round9LearningSource
$round10LearningSource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF9yb3VuZDEw5a2m5Lmg5omp5bGVXzIwMjYtMDYtMTgubWQ=')
if (-not (Test-Path -LiteralPath $round10LearningSource)) {
    throw "Missing round10 learning source markdown: $round10LearningSource"
}
$structured += Get-Round10LearningItems -Path $round10LearningSource
$round11LifeSource = Resolve-SourceDoc (Decode-SourceName '56iL5bqP5ZGY55Sf5a2Y5qih5ouf5ZmoX+W8ueeql+WAmemAieaxoF9yb3VuZDEx55Sf5rS75omp5bGVXzIwMjYtMDYtMTgubWQ=')
if (-not (Test-Path -LiteralPath $round11LifeSource)) {
    throw "Missing round11 life source markdown: $round11LifeSource"
}
$structured += Get-Round11LifeItems -Path $round11LifeSource
$structured = $structured | Sort-Object id

if (($structured | Measure-Object).Count -ne $expectedCount) {
    throw "Structured item count mismatch: expected $expectedCount, got $(($structured | Measure-Object).Count)"
}

$structured = foreach ($item in $structured) {
    if ($item.id -ge 436) {
        $kind = $item.kind
        $tone = $item.tone
        $rarity = $item.rarity
        $effects = @{
            skill = $item.skill
            mental = $item.mental
            money = $item.money
            ai = $item.ai
        }
    } else {
        $kind = Get-Kind -SectionCode $item.section_code -Id $item.id
        $tone = Get-Tone -Text $item.text -SectionCode $item.section_code -Kind $kind
        $rarity = Get-Rarity -Id $item.id -Kind $kind -Tone $tone
        $effects = Get-BaseEffects -Kind $kind -Tone $tone -Text $item.text -SectionCode $item.section_code
    }

    $obj = [ordered]@{
        id = $item.id
        text = $item.text
        section_code = $item.section_code
        section_name = $item.section_name
        source_version = $item.source_version
        source_scope = $item.source_scope
        kind = $kind
        tone = $tone
        rarity = $rarity
        char_count = $item.text.Length
        skill = $effects.skill
        mental = $effects.mental
        money = $effects.money
        ai = $effects.ai
    }
    if ($item.source_action) { $obj.source_action = $item.source_action }
    if ($item.source_version) { $obj.source_version = $item.source_version }
    if ($item.source_scope) { $obj.source_scope = $item.source_scope }
    if ($item.trigger_min_day) { $obj.trigger_min_day = $item.trigger_min_day }
    [pscustomobject]$obj
}

$gameReady = foreach ($item in $structured) {
    $trigger = if ($item.id -ge 436 -and $item.trigger_min_day) {
        [pscustomobject]@{ minDay = [int]$item.trigger_min_day }
    } else {
        [pscustomobject](Get-Trigger -Kind $item.kind -SectionCode $item.section_code -Text $item.text -Id $item.id)
    }

    $obj = [ordered]@{
        id = $item.id
        text = $item.text
        category = $item.section_name
        kind = $item.kind
        tone = $item.tone
        rarity = $item.rarity
        effect = [pscustomobject]@{
            skill = $item.skill
            mental = $item.mental
            money = $item.money
            ai = $item.ai
        }
        trigger = $trigger
    }
    if ($item.source_action) { $obj.source_action = $item.source_action }
    if ($item.source_version) { $obj.source_version = $item.source_version }
    if ($item.source_scope) { $obj.source_scope = $item.source_scope }
    [pscustomobject]$obj
}

$structuredCsv = Join-Path $outputDir 'popup_pool_structured_2026-06-18.csv'
$structuredJson = Join-Path $outputDir 'popup_pool_structured_2026-06-18.json'
$gameReadyJson = Join-Path $outputDir 'popup_pool_game_ready_2026-06-18.json'

Write-AtomicCsvFile -Path $structuredCsv -Rows $structured -Validate {
    param([string]$TempPath)
    $rows = Import-Csv -LiteralPath $TempPath -Encoding UTF8
    if (($rows | Measure-Object).Count -ne $expectedCount) {
        throw "Output CSV count mismatch for ${TempPath}: expected $expectedCount, got $(($rows | Measure-Object).Count)"
    }
}
Write-AtomicTextFile -Path $structuredJson -Content ($structured | ConvertTo-Json -Depth 4) -Validate {
    param([string]$TempPath)
    Assert-JsonArrayFileCount -Path $TempPath -ExpectedCount $expectedCount
}
Write-AtomicTextFile -Path $gameReadyJson -Content ($gameReady | ConvertTo-Json -Depth 6) -Validate {
    param([string]$TempPath)
    Assert-JsonArrayFileCount -Path $TempPath -ExpectedCount $expectedCount
}
$runtimeContent = "window.PROGRAMMER_POPUP_POOL = " + ($gameReady | ConvertTo-Json -Depth 6) + ";"
Write-AtomicTextFile -Path $runtimeJs -Content $runtimeContent -Validate {
    param([string]$TempPath)
    Assert-RuntimeFileCount -Path $TempPath -ExpectedCount $expectedCount
}

Write-Output "STRUCTURED_CSV=$structuredCsv"
Write-Output "STRUCTURED_JSON=$structuredJson"
Write-Output "GAME_READY_JSON=$gameReadyJson"
Write-Output "RUNTIME_JS=$runtimeJs"
foreach ($def in $sourceDefs) {
    Write-Output "SOURCE_$($def.Version)=$($def.Path)"
}
Write-Output "SOURCE_LIFE_EXTENSION=$lifeExtensionSource"
Write-Output "SOURCE_RESEARCH_EXTENSION=$researchExtensionSource"
Write-Output "SOURCE_ROUND7_COMMUNITY=$round7CommunitySource"
Write-Output "SOURCE_ROUND8_COMMUNITY=$round8CommunitySource"
Write-Output "SOURCE_ROUND9_LIFE=$round9LifeSource"
Write-Output "SOURCE_ROUND9_LEARNING=$round9LearningSource"
Write-Output "SOURCE_ROUND10_LEARNING=$round10LearningSource"
Write-Output "SOURCE_ROUND11_LIFE=$round11LifeSource"
Write-Output "COUNT=$($structured.Count)"
