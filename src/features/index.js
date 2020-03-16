import React, { useState, useEffect, useCallback } from "react";
import MyNavBar from "./Navbar";
import Map from "./Map";
import Geocoder from "react-mapbox-gl-geocoder";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import "./styles.css";

const settings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0
};

const mapAccess = {
  mapboxApiAccessToken:
    "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA"
};
const App = ({}) => {
  const [inputData, setInputData] = useState("");
  const watch = false;
  const [antipodeCalculated, setAntipodeCalculated] = useState(false);
  const [position, setPosition] = useState({});
  const [antipode, setAntipode] = useState({});
  const [error, setError] = useState(null);

  const onChange = ({ coords, timestamp }) => {
    setAntipodeCalculated(false);
    console.log("NOT CALCULATED");
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp
    });
    // setAntipode({
    //   latitude: coords.latitude * -1,
    //   longitude:
    //     coords.longitude > 0 ? coords.longitude - 180 : coords.longitude + 180
    // });
  };

  const onError = error => {
    setError(error.message);
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }

    let watcher = null;
    if (watch) {
      watcher = geo.watchPosition(onChange, onError, settings);
    } else {
      geo.getCurrentPosition(onChange, onError, settings);
    }

    return () => watcher && geo.clearWatch(watcher);
  }, [settings]);

  useEffect(() => {
    if (position.latitude && position.longitude && !antipodeCalculated) {
      calcuateAntipode();
      setAntipodeCalculated(true);
      console.log("CALCULATED");
    }
  }, [position]);

  const calcuateAntipode = async () => {
    const response = await fetch(
      "http://localhost:8080/calculateAntipode?latitude=" +
        position.latitude +
        "&longitude=" +
        position.longitude
    ).then(response => {
      console.log(response);
      console.log(response.body);
      let jsonD = response.json().then(data => {
        setAntipode({ ...data.antipode });
        setPosition({ ...data.origin });
      });
    });
  };

  const handleChange = event => {
    setInputData(event.target.value);
  };

  const onSelected = customGeoCode => {
    setPosition(customGeoCode);
    setAntipodeCalculated(false);
  };

  return (
    <div>
      <MyNavBar />
      <div className="my-content">
        <Row>
          <Col
            sm={{ span: 10, offset: 1 }}
            md={{ span: 4, offset: 4 }}
            lg={{ span: 4, offset: 4 }}
          >
            <p className="input-label">
              Please enter an address, city, state or country
            </p>
            <Geocoder
              className="search-input"
              {...mapAccess}
              onSelected={onSelected}
              viewport={{}}
              hideOnSelect={true}
              updateInputOnSelect={true}
            />
          </Col>
        </Row>
        <br />
        <Row className="justify-content-center align-self-center">
          <Col sm={{ span: 10 }} md={{ span: 5 }} lg={{ span: 5 }}>
            <Map
              position={position}
              usePosition={true}
              useWaterCaption={false}
              headerText={"Your location"}
            />
          </Col>
          <Col
            sm={{ span: 10, offset: 1 }}
            md={{ span: 5, offset: 1 }}
            lg={{ span: 5, offset: 1 }}
          >
            <Map
              position={antipode}
              usePosition={false}
              useWaterCaption={true}
              headerText={"Antipode"}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default App;
