
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Environment Setup') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npm run test:regression'
            }
        }
    }

    post {
        always {
            echo 'Publishing Playwright test results and artifacts'

            junit(
                testResults: 'reports/results.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'reports/**, test-results/**',
                allowEmptyArchive: true
            )

            script {
                env.BUILD_RESULT = currentBuild.currentResult
                env.BUILD_DURATION = currentBuild.durationString
            }

            echo 'Sending Slack notification...'

            withCredentials([
                string(
                    credentialsId: 'slack-webhook',
                    variable: 'SLACK_WEBHOOK_URL'
                )
            ]) {
                powershell '''
                    $reportPath = "reports/results.json"
                    $failedTests = @()

                    $passed = 0
                    $failed = 0
                    $skipped = 0
                    $flaky = 0

                    if (Test-Path $reportPath) {
                        $report = Get-Content $reportPath -Raw |
                            ConvertFrom-Json

                        $passed = $report.stats.expected
                        $failed = $report.stats.unexpected
                        $skipped = $report.stats.skipped
                        $flaky = $report.stats.flaky

                        function Get-FailedTests($suite) {
                            foreach ($spec in $suite.specs) {
                                foreach ($test in $spec.tests) {
                                    if ($test.status -eq "unexpected") {
                                        $errorMessage = "No error details available."

                                        if ($test.results.Count -gt 0) {
                                            $lastResult = $test.results[-1]

                                            if ($lastResult.errors.Count -gt 0) {
                                                $errorMessage = $lastResult.errors[0].message
                                            }
                                        }

                                        $script:failedTests += [PSCustomObject]@{
                                            Name = $spec.title
                                            Error = $errorMessage
                                        }
                                    }
                                }
                            }

                            foreach ($childSuite in $suite.suites) {
                                Get-FailedTests $childSuite
                            }
                        }

                        foreach ($suite in $report.suites) {
                            Get-FailedTests $suite
                        }
                    }
                    else {
                        Write-Warning "Playwright JSON report not found."
                    }

                    $total = $passed + $failed + $skipped + $flaky

                    $status = $env:BUILD_RESULT
                    $emoji = if ($status -eq "SUCCESS") {
                        ":white_check_mark:"
                    } else {
                        ":rotating_light:"
                    }

                    $message = "$emoji *Playwright CI - $status*`n"
                    $message += "*Job:* $env:JOB_NAME`n"
                    $message += "*Build:* #$env:BUILD_NUMBER`n"
                    $message += "*Total tests:* $total`n"
                    $message += "*Passed:* $passed | *Failed:* $failed | *Skipped:* $skipped | *Flaky:* $flaky`n"
                    $message += "*Duration:* $env:BUILD_DURATION`n"
                    $message += "*Build URL:* $env:BUILD_URL"

                    if ($failedTests.Count -gt 0) {
                        $message += "`n`n*Failed test details:*"

                        foreach ($item in ($failedTests | Select-Object -First 5)) {
                            $errorText = $item.Error

                            if ($errorText.Length -gt 400) {
                                $errorText = $errorText.Substring(0, 400) + "..."
                            }

                            $message += "`n• *$($item.Name)*`n  $errorText"
                        }

                        if ($failedTests.Count -gt 5) {
                            $message += "`n...and $($failedTests.Count - 5) more failures."
                        }
                    }

                    $payload = @{
                        text = $message
                    } | ConvertTo-Json -Depth 10 -Compress

                    try {
                        Invoke-RestMethod `
                            -Uri $env:SLACK_WEBHOOK_URL `
                            -Method Post `
                            -ContentType "application/json; charset=utf-8" `
                            -Body ([System.Text.Encoding]::UTF8.GetBytes($payload))

                        Write-Host "Slack notification sent successfully."
                    }
                    catch {
                        Write-Warning "Slack notification failed: $($_.Exception.Message)"
                    }
                '''
            }
        }

        success {
            echo 'Playwright pipeline completed successfully!'
        }

        failure {
            echo 'Playwright pipeline failed. Check test results and Slack notification.'
        }
    }
}
