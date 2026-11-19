
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
                    $reportPath = "reports/results.xml"
                    $failedTests = @()

                    $total = 0
                    $passed = 0
                    $failed = 0
                    $skipped = 0
                    $duration = "Not available"

                    if (Test-Path $reportPath) {
                        try {
                            [xml]$report = Get-Content $reportPath -Raw
                            $root = $report.DocumentElement

                            $total = [int]$root.tests
                            $failed = [int]$root.failures + [int]$root.errors
                            $skipped = [int]$root.skipped
                            $passed = $total - $failed - $skipped

                            $seconds = [double]$root.time
                            $duration = [TimeSpan]::FromSeconds($seconds).ToString("hh\\:mm\\:ss")

                            $testCases = $report.SelectNodes("//testcase")

                            foreach ($testCase in $testCases) {
                                $failureNode = $testCase.SelectSingleNode("failure")
                                $errorNode = $testCase.SelectSingleNode("error")

                                if ($failureNode -or $errorNode) {
                                    $failureDetail = if ($failureNode) {
                                        $failureNode
                                    } else {
                                        $errorNode
                                    }

                                    $errorMessage = $failureDetail.message

                                    if ([string]::IsNullOrWhiteSpace($errorMessage)) {
                                        $errorMessage = $failureDetail.InnerText
                                    }

                                    $failedTests += [PSCustomObject]@{
                                        Name = $testCase.name
                                        Error = $errorMessage
                                    }
                                }
                            }
                        }
                        catch {
                            Write-Warning "Could not parse Playwright XML report: $($_.Exception.Message)"
                        }
                    }
                    else {
                        Write-Warning "Playwright XML report not found."
                    }

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
                    $message += "*Passed:* $passed | *Failed:* $failed | *Skipped:* $skipped`n"
                    $message += "*Test duration:* $duration`n"
                    $message += "*Build duration:* $env:BUILD_DURATION`n"
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

        aborted {
            echo 'Playwright pipeline was aborted.'
        }
    }
}
