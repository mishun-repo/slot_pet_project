param(
  [Parameter(Mandatory = $true)]
  [string]$Ticket,

  [Parameter(Mandatory = $true)]
  [ValidateSet(
    "task-context",
    "requirements-grooming",
    "qa-checklist",
    "test-cases",
    "api-test-generation",
    "playwright-generation",
    "code-verification",
    "coverage-critic",
    "pr-summary"
  )]
  [string]$Skill,

  [string]$Brief = "",
  [string]$InputArtifact = "",
  [string]$Model = "qwen2.5-coder:14b",
  [string]$OllamaUrl = "http://localhost:11434"
)

$ErrorActionPreference = "Stop"

$PipelineRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$SkillsDir = Join-Path $PipelineRoot "skills"
$ContextFile = Join-Path $PipelineRoot "PROJECT_CONTEXT.md"
$ArtifactsDir = Join-Path (Join-Path $PipelineRoot "artifacts") $Ticket

$SkillMap = @{
  "task-context"          = "01-task-context.md"
  "requirements-grooming" = "02-requirements.md"
  "qa-checklist"          = "03-qa-checklist.md"
  "test-cases"            = "04-test-cases.md"
  "api-test-generation"   = "05-api-tests.md"
  "playwright-generation" = "06-e2e-tests.md"
  "code-verification"     = "07-code-verification.md"
  "coverage-critic"       = "08-coverage-report.md"
  "pr-summary"            = "05-pr-summary.md"
}

$SkillFile = Join-Path (Join-Path $SkillsDir $Skill) "SKILL.md"

if (-not (Test-Path $SkillFile)) {
  throw "Skill not found: $SkillFile"
}
if (-not (Test-Path $ContextFile)) {
  throw "PROJECT_CONTEXT.md not found: $ContextFile"
}

New-Item -ItemType Directory -Force -Path $ArtifactsDir | Out-Null

$skillText = Get-Content -Raw -Path $SkillFile -Encoding UTF8
$contextText = Get-Content -Raw -Path $ContextFile -Encoding UTF8

$inputParts = New-Object System.Collections.Generic.List[string]
[void]$inputParts.Add("### Project context`n$contextText")

if ($Brief -ne "") {
  if (-not (Test-Path $Brief)) {
    throw "Brief file not found: $Brief"
  }
  $briefText = Get-Content -Raw -Path $Brief -Encoding UTF8
  [void]$inputParts.Add("### Ticket / brief`n$briefText")
}

if ($InputArtifact -ne "") {
  if (-not (Test-Path $InputArtifact)) {
    throw "Input artifact not found: $InputArtifact"
  }
  $prevText = Get-Content -Raw -Path $InputArtifact -Encoding UTF8
  [void]$inputParts.Add("### Previous artifact`n$prevText")
}

if ($Brief -eq "" -and $InputArtifact -eq "") {
  Write-Warning "No -Brief and no -InputArtifact. Skill will run with PROJECT_CONTEXT only."
}

$joinedInput = [string]::Join("`n`n", $inputParts.ToArray())

$userContent = @"
## INPUT

$joinedInput

---
Produce the full output in the exact markdown format required by the skill.
Do not invent data-testid values or API fields not present in PROJECT_CONTEXT.
Ticket id: $Ticket
"@

Write-Host ("Skill:  " + $Skill)
Write-Host ("Model:  " + $Model)
Write-Host ("Ticket: " + $Ticket)
Write-Host "Calling Ollama (first run may take 5-15 minutes while model loads)..."

$payload = @{
  model = $Model
  stream = $false
  options = @{
    temperature = 0
  }
  messages = @(
    @{ role = "system"; content = $skillText }
    @{ role = "user"; content = $userContent }
  )
}

$json = $payload | ConvertTo-Json -Depth 20

try {
  $response = Invoke-RestMethod `
    -Method POST `
    -Uri ($OllamaUrl + "/api/chat") `
    -ContentType "application/json" `
    -Body $json `
    -TimeoutSec 1200
}
catch {
  throw ("Ollama request failed: " + $_.Exception.Message)
}

$content = $response.message.content
if (-not $content) {
  throw "Empty response from model"
}

$outFile = Join-Path $ArtifactsDir $SkillMap[$Skill]
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outFile, $content, $utf8)

Write-Host ("Saved: " + $outFile)
Write-Host ("Length: " + $content.Length + " chars")