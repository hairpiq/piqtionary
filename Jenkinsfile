node {
	stage 'Stage 1'

	echo "BRANCH_NAME = ${BRANCH_NAME}"
	echo "env.BRANCH_NAME = ${env.BRANCH_NAME}"

	if (${BRANCH_NAME} == "DEV") {

		console.log("A");

	} else if (${BRANCH_NAME} == "TEST") {

		console.log("B");

	} else if (${BRANCH_NAME} == "master") {

		console.log("C");

	} 

}
