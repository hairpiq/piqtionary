require('dotenv').config();
var config = process.env;
var Clarifai = require("clarifai");

require('es6-promise').polyfill();
var Q = require("q");
var api = new Clarifai.App(
    config.CLARIFAI_CLIENT_ID,
    config.CLARIFAI_CLIENT_SECRET
);

module.exports = {
   validate: function(photo_url) {
        
        return new Promise(function(resolve, reject) {
            
            Q.all([validateNSFW(photo_url), validatePictureSubject(photo_url)]).then(function(result) {
               
               var result = (result[0] && result[1]);

               resolve(result);

            });

        });

    },
    predict: function(photo_url) {

        console.log('Clarifai - A: predict hairstyle based off of submitted image');

        return new Promise(function(resolve, reject) {

            api.models.predict(config.CLARIFAI_MODEL_ID, photo_url).then(function (result) {
                    
                    console.log('Clarifai - B: predicted...');
                    
                    result =  getTopRatedTagHandler(result);

                    resolve(result);

                },
                function (err) {
                    
                    identifyClarifaiError(err);
                    reject(new Error(err));

                }
            );
        });

    },
    insert: function(base64, stylename) {

        console.log('Clarifai - A: insert hairpiq and stylename concept into clarifai');

        return new Promise(function(resolve, reject) {
            
            api.inputs.create({
                base64: base64,
                concepts: [{id: stylename, value: true }]
            }).then(function(result) {

                console.log('Clarifai - B: inserted. Now train model: ' + config.CLARIFAI_MODEL_ID);
                
                api.models.train(config.CLARIFAI_MODEL_ID).then(function(result) {

                    console.log('Clarifai - C: trained.');

                    resolve(result);

                }).catch(function(error) {
                    console.log(error.status, error.statusText);
                });
            }).catch(function(error) {
                console.log(error.status, error.statusText);
            });

        });

    }
}


function validateNSFW(photo_url){
     return new Promise(function(resolve, reject) {
            api.models.predict(Clarifai.NSFW_MODEL, photo_url).then(function (response) {
                    var results =  determineWhatNSFW(response);
                    resolve(results);
                },
                function (err) {
                    identifyClarifaiError(err);
                    reject(new Error(err));
                }
            );
        });
}

function validatePictureSubject(photo_url){
     return new Promise(function(resolve, reject) {
            api.models.predict(Clarifai.GENERAL_MODEL, photo_url).then(function (response) {
                    var results =  determineIfPictureSubjectQualifies(response);
                    resolve(results);
                },
                function (err) {
                    identifyClarifaiError(err);
                    reject(new Error(err));
                }
            );
        });
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


function determineIfPictureSubjectQualifies(response) {
    var status = false;
    response.data.outputs.forEach(function (output) {
        output.data.concepts.forEach(function (tag) {
            if (tag.name === 'man' || tag.name === 'woman' || tag.name === 'adult' || tag.name === 'portrait' || tag.name === 'headshot') {
                status = true;
                return status;
            }
        });
    });
    return status;
}

function determineWhatNSFW(response) {
    var status = false;
    response.data.outputs.forEach(function (output) {
        output.data.concepts.forEach(function (tag) {
            if (tag.name === 'sfw' &&  Math.ceil(tag.value * 100) > 95) {
                status = true;
                return status;
            }
        });
    });
    return status;
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