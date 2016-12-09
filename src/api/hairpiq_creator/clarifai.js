var config = require('../../../config/clarifai');
var Clarifai = require("clarifai");

var api = new Clarifai.App(
    config.client_id,
    config.client_secret
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

        console.log('Clarifai - A: predict hairstyle based off of submitted image');

        return new Promise(function(resolve, reject) {

            api.models.predict(config.model_id, photo_url).then(function (result) {
                    
                    console.log('Clarifai - B: predicted...');
                    
                    result =  getTopRatedTagHandler(result);
                    console.log(result);

                    resolve(result);

                },
                function (err) {
                    
                    identifyClarifaiError(err);
                    reject(new Error(err));

                }
            );
        });

    },
    insert: function(photo_url, stylename, ig_username) {

        console.log('Clarifai - A: insert hairpiq and stylename concept into clarifai');
        
        return new Promise(function(resolve, reject) {

            var concept = stylename.replace(/ /g,'').toLowerCase();

            api.inputs.create({
                url: photo_url,
                concepts: [{id: concept, value: true }]
            }).then(function(result) {

                console.log('Clarifai - B: inserted. Now train model: ' + config.model_id);
                
                console.log(result);

                api.models.train(config.model_id).then(function(result) {

                    console.log('Clarifai - C: trained.');
                    
                    resolve(response);

                },function(err) {
                    
                    console.error(err);
                    reject(new Error(err));

                });

            },
            function(err) {
                
                console.error(err);
                reject(new Error(err));

            });

        });
    },
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
