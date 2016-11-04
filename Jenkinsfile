properties([pipelineTriggers([[$class: 'GitHubPushTrigger']])]) 

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
