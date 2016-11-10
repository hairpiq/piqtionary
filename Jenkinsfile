#!groovy

properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])])

node {

	git url: 'https://github.com/hairpiq/piqtionary.git', git credentialsId: 'af1f0aaa-94f7-460a-a119-d5f914065022', poll: false, branch: BRANCH_NAME
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