
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '10'
        ))
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
            echo 'Publishing test results and artifacts'

            junit(
                testResults: 'reports/results.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'reports/**, test-results/**',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'Playwright pipeline completed successfully!'
        }

        failure {
            echo 'Playwright pipeline failed. Sending Slack notification...'

            withCredentials([
                string(
                    credentialsId: 'slack-webhook',
                    variable: 'SLACK_WEBHOOK_URL'
                )
            ]) {
                powershell '''
                    $payload = @{
                        text = "🚨 Playwright Tests Failed!`nJob: $env:JOB_NAME`nBuild: #$env:BUILD_NUMBER`nDetails: $env:BUILD_URL"
                    } | ConvertTo-Json -Compress

                    try {
                        Invoke-RestMethod `
                            -Uri $env:SLACK_WEBHOOK_URL `
                            -Method Post `
                            -ContentType "application/json" `
                            -Body $payload

                        Write-Host "Slack notification sent successfully."
                    }
                    catch {
                        Write-Error "Slack notification failed: $($_.Exception.Message)"
                        exit 1
                    }
                '''
            }
        }
    }


}
