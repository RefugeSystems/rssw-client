#!groovy

import groovy.json.JsonSlurper

pipeline {
	agent any
	stages {
		stage('preparation') {
			steps {
				git branch: 'seedling', credentialsId: '307792f6-7923-4ae6-80f8-d650c90cc8a5', url: 'git@seedling.refugesystems.net:game-dev/CoreInterface.git'
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
				export LATEST_GIT_SHA=$(curl -H "X-TrackerToken: d30a134677560a1d50665f9c385485eb" "https://www.pivotaltracker.com/services/v5/projects/2439516/cicd/842da11c9304380e5d6911287c0d8614" | grep -oE '([^"latest_git_sha\":][a-zA-Z0-9]+)')
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
				curl -X POST -H "X-TrackerToken: d30a134677560a1d50665f9c385485eb" -H "Content-Type: application/json" -d '{"status":"passed", "url":"'$BUILD_URL'", "uuid":"842da11c9304380e5d6911287c0d8614", "story_ids":['$(IFS=,; echo "${STORY_IDS[*]}")'], "latest_git_sha":"'$NEW_LATEST_GIT_SHA'", "version":1}' "https://www.pivotaltracker.com/services/v5/projects/2439516/cicd"
			'''
		}
		failure {
			sh '''#!/bin/bash -xe
				export LATEST_GIT_SHA=$(curl -H "X-TrackerToken: d30a134677560a1d50665f9c385485eb" "https://www.pivotaltracker.com/services/v5/projects/2439516/cicd/842da11c9304380e5d6911287c0d8614" | grep -oE '([^"latest_git_sha\":][a-zA-Z0-9]+)')
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
				curl -X POST -H "X-TrackerToken: d30a134677560a1d50665f9c385485eb" -H "Content-Type: application/json" -d '{"status":"failed", "url":"'$BUILD_URL'", "uuid":"842da11c9304380e5d6911287c0d8614", "story_ids":['$(IFS=,; echo "${STORY_IDS[*]}")'], "version":1}' "https://www.pivotaltracker.com/services/v5/projects/2439516/cicd"
			'''
		}
	}
}
