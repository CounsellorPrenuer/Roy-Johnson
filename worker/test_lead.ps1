$body = @"
{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Test message from PowerShell",
  "source": "verify"
}
"@

$response = Invoke-RestMethod -Uri "https://careerplans-worker.garyphadale.workers.dev/submit-lead" -Method Post -ContentType "application/json" -Body $body
$response | ConvertTo-Json
