$headers = @{
    "Origin"                         = "https://careerplans.pro"
    "Access-Control-Request-Method"  = "POST"
    "Access-Control-Request-Headers" = "Content-Type"
}

Write-Host "Testing OPTIONS (preflight) request..."
$optionsResponse = Invoke-WebRequest -Uri "https://careerplans-worker.garyphadale.workers.dev/submit-lead" -Method Options -Headers $headers
Write-Host "Status: $($optionsResponse.StatusCode)"
Write-Host "CORS Headers:"
$optionsResponse.Headers['Access-Control-Allow-Origin']
$optionsResponse.Headers['Access-Control-Allow-Methods']
$optionsResponse.Headers['Access-Control-Allow-Headers']

Write-Host "`nTesting POST request..."
$body = @"
{
  "name": "CORS Test User",
  "email": "corstest@example.com",
  "message": "Testing after CORS fix",
  "source": "cors_verify"
}
"@

$postResponse = Invoke-RestMethod -Uri "https://careerplans-worker.garyphadale.workers.dev/submit-lead" -Method Post -ContentType "application/json" -Body $body
Write-Host "Response:"
$postResponse | ConvertTo-Json
