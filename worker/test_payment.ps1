$headers = @{ "Content-Type" = "application/json" }
$body = @{
    planId   = "discovery_plus"
    currency = "INR"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://careerplans-worker.garyphadale.workers.dev/create-order" -Method Post -Headers $headers -Body $body
