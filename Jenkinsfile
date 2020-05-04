#!groovy

import groovy.json.JsonSlurper

pipeline {
	agent any
	stages {
		stage('preparation') {
			steps {
				git branch: 'seedling', credentialsId: '${JENKINS_CREDENTIAL_ID}', url: 'git@seedling.refugesystems.net:game-dev/CoreInterface.git'
			}
		}
		stage('build') {
			steps {
				sh 'npm install'
				sh 'grunt -v build'
			}
		}
		stage('deploy') {
			steps {
				sshPublisher(publishers: [sshPublisherDesc(configName: 'Web Server', transfers: [sshTransfer(excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'projects/rsswx/app/', remoteDirectorySDF: false, removePrefix: 'app/', sourceFiles: 'app/*, app/webfonts/**/*, app/fonts/**/*'), sshTransfer(excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'projects/rsswx/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'README.md, LICENSE, package.json'), sshTransfer(excludes: '', execCommand: '', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'images/', remoteDirectorySDF: false, removePrefix: 'app/images/', sourceFiles: 'app/images/**/*')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
			}
		}
	}
	post {
		success {
			sh '''#!/bin/bash -xe
				export LATEST_GIT_SHA=$(curl -H "X-TrackerToken: ${PIVOTAL_TOKEN}" "https://www.pivotaltracker.com/services/v5/projects/${PIVOTAL_PROJECT_ID}/cicd/${PIVOTAL_CICD}" | grep -oE '([^"latest_git_sha\":][a-zA-Z0-9]+)')
				git config --global core.pager cat
				if git log $LATEST_GIT_SHA~..$LATEST_GIT_SHA; then
					true # all is well
				else
					echo "$LATEST_GIT_SHA missing, assuming the worst"
					export LATEST_GIT_SHA=null
				fi
				export NEW_LATEST_GIT_SHA=$(git rev-parse HEAD)
				if [ "$LATEST_GIT_SHA" == "null" ]; then
					export STORY_IDS=($(git log -10 | grep -E "\\[.*\\]" | grep -oE "\\[.*\\]" | grep -oE "([0-9]+)"))
				else
					export STORY_IDS=($(git log $LATEST_GIT_SHA..HEAD | grep -E "\\[.*\\]" | grep -oE "\\[.*\\]" | grep -oE "([0-9]+)"))
				fi
				curl -X POST -H "X-TrackerToken: ${PIVOTAL_TOKEN}" -H "Content-Type: application/json" -d '{"status":"passed", "current_state":"delivered", "url":"'$BUILD_URL'", "uuid":"${PIVOTAL_CICD}", "story_ids":['$(IFS=,; echo "${STORY_IDS[*]}")'], "latest_git_sha":"'$NEW_LATEST_GIT_SHA'", "version":1}' "https://www.pivotaltracker.com/services/v5/projects/${PIVOTAL_PROJECT_ID}/cicd"
			'''
		}
		failure {
			sh '''#!/bin/bash -xe
				export LATEST_GIT_SHA=$(curl -H "X-TrackerToken: ${PIVOTAL_TOKEN}" "https://www.pivotaltracker.com/services/v5/projects/${PIVOTAL_PROJECT_ID}/cicd/${PIVOTAL_CICD}" | grep -oE '([^"latest_git_sha\":][a-zA-Z0-9]+)')
				git config --global core.pager cat
				if git log $LATEST_GIT_SHA~..$LATEST_GIT_SHA; then
					true # all is well
				else
					echo "$LATEST_GIT_SHA missing, assuming the worst"
					export LATEST_GIT_SHA=null
				fi
				if [ "$LATEST_GIT_SHA" == "null" ]; then
					export STORY_IDS=($(git log -10 | grep -E "\\[.*\\]" | grep -oE "\\[.*\\]" | grep -oE "([0-9]+)"))
				else
					export STORY_IDS=($(git log $LATEST_GIT_SHA..HEAD | grep -E "\\[.*\\]" | grep -oE "\\[.*\\]" | grep -oE "([0-9]+)"))
				fi
				curl -X POST -H "X-TrackerToken: ${PIVOTAL_TOKEN}" -H "Content-Type: application/json" -d '{"status":"failed", "url":"'$BUILD_URL'", "uuid":"${PIVOTAL_CICD}", "story_ids":['$(IFS=,; echo "${STORY_IDS[*]}")'], "version":1}' "https://www.pivotaltracker.com/services/v5/projects/${PIVOTAL_PROJECT_ID}/cicd"
			'''
		}
	}
}
