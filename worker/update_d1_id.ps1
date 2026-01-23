$json = npx wrangler d1 info careerplans-prod --json | Out-String | ConvertFrom-Json
$uuid = $json.uuid
Write-Host "Found UUID: $uuid"
$content = Get-Content wrangler.toml
$content = $content -replace 'database_id = ".*"', "database_id = `"$uuid`""
$content | Set-Content wrangler.toml
