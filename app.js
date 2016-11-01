/**
 * Created by jackman79 on 10/31/16.
 */
var Clarifai = require("./clarifai_node.js"),
    express = require("express"),
    app = express(),
    server = require("http").Server(app),
    bodyParser = require("body-parser"),
    port = process.env.PORT || 5000;

app.use(bodyParser.json());


// This is the API call using the credentials for piqtionary Clarifi application.

Clarifai.initAPI("wONTOYtXMLE9KUXNK5KanWepLay8Etw7tSuuuNt2", "2RENXai2iC2VYPYEuGaZBJ-oodCmrmzD0tfos98D");

function identifyClarifaiError(err) {
  // Default error function from Clarifai we won't go into but you can find it in the GitHub download of this code!
}

app.post("/analyzeImage", function(req, resp) {
  var imageURL = req.body.imageRequested;
  console.log("Response was ", imageURL);

  Clarifai.tagURL(imageURL, "Image from browser", commonResultHandler);

  function commonResultHandler(err, res) {
    if (err != null) {
      identifyClarifaiError(err);
    }
    else {
      if (typeof res["status_code"] === "string" &&
        (res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR")) {

        if (res["results"][0]["status_code"] === "OK") {
          var tags = res["results"];
          console.log("Tags found were: ", tags);
          // Here is where I would send back to JSON response of the tags results.
          //resp.send(tags);
        }
        else {
          console.log("We had an error... Details: " +
            " docid=" + res.results[0].docid +
            " local_id=" + res.results[0].local_id +
            " status_code="+res.results[0].status_code +
            " error = " + res.results[0]["result"]["error"]);

          resp.send("Error: " + res.results[0]["result"]["error"]);
        }
      }
    }
  }
});

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get(/^(.+)$/, function(req, res) {
  res.sendFile(__dirname + "/public/" + req.params[0]);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(port, function() {
  console.log("Listening on " + port);
});