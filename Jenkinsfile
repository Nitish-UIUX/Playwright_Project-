
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

        stage('Checkout') {
            steps {
                echo 'Checking out Playwright project from GitHub'

                git branch: 'main',
                    url: 'https://github.com/Nitish-UIUX/Playwright_Project-.git'
            }
        }

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
            echo 'Playwright pipeline failed. Check the console output and artifacts.'
        }
    }
}
