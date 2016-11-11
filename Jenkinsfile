#!groovy

properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])])

node {

	checkout poll: false, scm: [$class: 'GitSCM', branches: [[name: '${BRANCH_NAME}']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'af1f0aaa-94f7-460a-a119-d5f914065022', url: 'https://github.com/hairpiq/piqtionary.git']]]

	def FOLDER_PATH = '';

	if (BRANCH_NAME == "jenkinsfile") {

		echo "A"

		FOLDER_PATH = PIQTIONARY_FOLDER_PATH;

		echo "WORKSPACE: ${WORKSPACE}";

		echo "BUILD_URL: ${BUILD_URL}"

		sh "sh ./bin/deploy.sh ${DEV_USER} ${DEV_HOST} ${WORKSPACE} ${FOLDER_PATH}"

		echo "B"

	} else if (BRANCH_NAME == "DEV") {

		stage("Stage 1") {

			echo "A";

		}

	} else if (BRANCH_NAME == "TEST") {

		stage("Stage 1") {

			echo "B";
		
		}

	} else if (BRANCH_NAME == "master") {

		stage("Stage 1") {

			echo "C";
		
		}

	}

	archiveArtifacts '**'

}