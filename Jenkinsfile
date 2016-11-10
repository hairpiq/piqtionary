#!groovy

properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])])

node {

	git url: 'https://github.com/hairpiq/piqtionary.git', branch: BRANCH_NAME
	def _pwd = pwd();

	echo "_pwd: ${_pwd}"

	echo "WORKSPACE: ${WORKSPACE}"

	if (BRANCH_NAME == "DEV") {

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

}