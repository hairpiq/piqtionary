/**
 * Created by jackman79 on 10/31/16.
 */


// module.exports = {
//   getTopRatedTag: function(imagePath) {
    var Clarifai = require("clarifai");

    var http = require('http'),
        express = require('express'),
        path = require('path');

    var api = new Clarifai.App(
        'wONTOYtXMLE9KUXNK5KanWepLay8Etw7tSuuuNt2',
        '2RENXai2iC2VYPYEuGaZBJ-oodCmrmzD0tfos98D'
    );



   var imagePath = "http://www.outfittrends.com/wp-content/uploads/2014/10/cute-black-girls-hairstyles.jpg";
   var results;
   api.models.predict(Clarifai.GENERAL_MODEL, imagePath).then(
     function(response){
            if(response)
                results=resultHandler(response);
                //console.log(response);

         },
         function (err) {
          identifyClarifaiError(err);
        }
    );

    //console.log(results);
      // if(results)
      // console.log(results);


// app.inputs.create({
//   url: "http://www.outfittrends.com/wp-content/uploads/2014/10/cute-black-girls-hairstyles.jpg"
// }).then(
//   function(response) {
//     console.log(response);
//   },
//   function(err) {
//     //console.log(err);
//   }
// );
//
// app.inputs.get('f35c4cfca8a44dcaaa7bd75427272cf9').then(
//   function(response) {
//     console.log(response._rawData);
//   },
//   function(err) {
//     // there was an error
//   }
// );

    var resultHandler = function(response) {
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
    };


    var identifyClarifaiError = function(err) {
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
    };

//   }
// }