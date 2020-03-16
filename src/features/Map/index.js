import "./styles.css";
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import MapGL, {
  Marker,
  GeolocateControl,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl
} from "react-map-gl";
import Pin from "./pin";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

type Props = {
  position: Object,
  usePosition: boolean,
  headerText: string,
  useWaterCaption: boolean
};

type state = {};

const navStyle = {
  position: "absolute",
  top: 36,
  left: 0,
  padding: "10px"
};

const scaleControlStyle = {
  position: "absolute",
  bottom: 36,
  left: 0,
  padding: "10px"
};

const fullscreenControlStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px"
};

const initialState = {
  zoom: 5,
  settings: {
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
    doubleClickZoom: true,
    minZoom: 0,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 85
  }
};

const Map = ({ position, usePosition, useWaterCaption, headerText }: Props) => {
  const [viewport, setViewport] = useState({ ...initialState });
  const [positionCond, setPositionCond] = useState(usePosition);

  useEffect(() => {
    if (position.latitude != viewport.latitude) {
      setViewport({
        ...viewport,
        latitude: position.latitude,
        longitude: position.longitude,
        zoom: 5
      });
      setPositionCond(usePosition);
    }
  });

  const handle = nViewport => {
    const { width, height, latitude, longitude, zoom } = nViewport;
    if (latitude != 0 && longitude != 0) setPositionCond(false);
    setViewport({
      ...viewport,
      latitude: latitude,
      longitude: longitude,
      zoom: zoom
    });
  };

  const viewportData = positionCond
    ? {
        ...viewport,
        latitude: position.latitude ? position.latitude : 0.0,
        longitude: position.longitude ? position.longitude : 0.0
      }
    : {
        ...viewport,
        latitude: viewport.latitude ? viewport.latitude : 0.0,
        longitude: viewport.longitude ? viewport.longitude : 0.0
      };
  console.log(viewportData);
  return viewportData.latitude && viewportData.longitude ? (
    <div>
      <h4 className="map-header">{headerText}</h4>
      <MapGL
        {...viewportData}
        width="100%"
        height="50vh"
        maxWidth="100%"
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handle}
      >
        <div style={navStyle}>
          <NavigationControl />
        </div>
        <Marker
          longitude={viewportData.longitude}
          latitude={viewportData.latitude}
          offsetTop={-20}
          offsetLeft={-10}
        >
          <Pin size={20} />
        </Marker>
      </MapGL>
      <div className="textbox">
        <p>
          {useWaterCaption
            ? position.isWater
              ? '"Water, water everywhere, nor any drop to drink": '
              : '"Buy land, they\'re not making it anymore": '
            : null}
        </p>
        <p>
          <b>
            {useWaterCaption
              ? position.isWater
                ? " Samuel Taylor Coleridge"
                : " Mark Twain"
              : null}
          </b>
        </p>
        <p className="caption">
          <b>Coordinates: </b>
          <i>
            {viewportData.latitude}, {viewport.longitude}
          </i>
        </p>
      </div>
    </div>
  ) : null;
};

export default Map;
