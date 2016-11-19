var config = require('../config/hairpiq');
var Clarifai = require("clarifai");

var api = new Clarifai.App(
    config.clarifai.client_id,
    config.clarifai.client_secret
);

module.exports = {
    validate: function(photo_url) {
        // check if safe for work
        // if not
            // return false
        // if so
        // check if man or woman
        // if not
            // return false
        // if so
            // return true
    },
    predict: function(photo_url) {

        return new Promise(function(resolve, reject) {

            api.models.predict(config.clarifai.model_id, photo_url).then(function (response) {
                    var results =  getTopRatedTagHandler(response);
                    resolve(results);
                },
                function (err) {
                    identifyClarifaiError(err);
                    reject(new Error(err));
                }
            );
        });

    },
    insert: function(photo_url, stylename) {
        // insert photo_url and stylename in clarifai database
        // return id to be associated submitter ig_username stored in some
        // sort of nosql db of some kind
    }
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
