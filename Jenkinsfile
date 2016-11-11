#!groovy

// tell Jenkins code was pushed into a branch
properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])])

node {

	// checkout that branch from github in this node's local workspace
	stage("Checkout") {

		checkout poll: false, scm: [$class: 'GitSCM', branches: [[name: '${BRANCH_NAME}']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'af1f0aaa-94f7-460a-a119-d5f914065022', url: 'https://github.com/hairpiq/piqtionary.git']]]

	}

	// deploy the checkedout code to it's corresponding server
	
	stage("Deploy") {

		def HOST = "";

		if (BRANCH_NAME == "DEV") {

			HOST = "${DEV_HOST}";

		} else if (BRANCH_NAME == "TEST") {

			HOST = "${TEST_HOST}";

		} else if (BRANCH_NAME == "master") {

			HOST = "${STAGING_HOST}";

		}

		if (HOST != "")
			sh "sh ./bin/deploy.sh ${CI_USER} ${HOST} ${WORKSPACE} ${PIQTIONARY_FOLDER_PATH}"

	}

	// archive this workspace
	stage("Archive") {

		archiveArtifacts artifacts: '**', onlyIfSuccessful: true

	}

}