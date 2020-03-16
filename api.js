const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const querystring = require("querystring");
const request = require("request");
const got = require("got");

const app = express();

const endpoint = "https://api.onwater.io/api/v1/results/";
const isLocationOnWater = async (req, res, next) => {
  try {
    let isWater = await got(
      endpoint + req.origin.latitude + "," + req.origin.longitude
    );
    req.origin.isWater = JSON.parse(isWater.body).water;

    isWater = await got(
      endpoint + req.antipode.latitude + "," + req.antipode.longitude
    );
    req.antipode.isWater = JSON.parse(isWater.body).water;
    next();
  } catch (err) {
    next();
  }
};

const determineAntipode = async (req, res, next) => {
  try {
    req.origin = {
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude)
    };
    req.antipode = {
      latitude: parseFloat(req.query.latitude) * -1,
      longitude:
        parseFloat(req.query.latitude) >= 0
          ? parseFloat(req.query.latitude) - 180
          : parseFloat(req.query.latitude) + 180
    };
    next();
  } catch (err) {
    res.send("Error calculating antipode.");
  }
};

app.get("/calculateAntipode", [determineAntipode, isLocationOnWater], function(
  req,
  res
) {
  res.send(
    JSON.stringify({
      origin: req.origin,
      antipode: req.antipode
    })
  );
});

app.listen(process.env.PORT || 8080);
