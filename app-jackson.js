/* Clarifai code needs to be refactored into another script */

    var Clarifai = require("clarifai");

// identify static folder
var fs = require('fs');
var dir = __dirname + '/hairpiq/s3-queue';
if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
app.use(express.static(dir));


    var config = require('./config/hairpiq');

    var api = new Clarifai.App(
        config.clarifai.client_id,
        config.clarifai.client_secret
    );

    var vm = this;


    var imagePath = "http://www.outfittrends.com/wp-content/uploads/2014/10/cute-black-girls-hairstyles.jpg";
    var results;

    api.models.predict(config.clarifai.model_id, imagePath).then(
        function (response) {
            results =  getTopRatedTagHandler(response);
            //console.log(response);
            onResults();
             if (vm.text)
                console.log(vm.text);
        },
        function (err) {
            identifyClarifaiError(err);
        }
    );

    if (vm.text)
        console.log(vm.text);


    function onResults() {
        vm.text=results;
        //console.log(vm.text);
    }


    function getTopRatedTagHandler(response) {
        var maxValue = 0;
        var maxRecord = {};
        response.data.outputs.forEach(function (output) {
            //console.log(output.data.concepts);
            output.data.concepts.forEach(function (tag) {
                tag.value = Math.ceil(tag.value * 100);
                if (tag.value > maxValue) {
                    maxValue = tag.value;
                    maxRecord = tag;
                }

            });

        });
        return maxRecord;
    }

    function identifyClarifaiError(err) {
        if (typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
            console.log("TAG request timed out");
        }
        else if (typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
            console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");
        }
        else if (typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
            console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");
        }
        else if (typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
            console.log("Clarifai host is throttling this application.");
        }
        else {
            console.log("TAG request encountered an unexpected error: ");
            console.log(err);
        }
    }
