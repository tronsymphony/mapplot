import React, { useRef, useEffect, useState } from "react";

import "./App.css";

import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
// import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
// import 'mapbox-gl/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken =
  "pk.eyJ1Ijoibml0eWFob3lvcyIsImEiOiJjbGZ0N203ODQwNXBiM3FvbXhvd3UwcDcxIn0.auRwB9upsB10y6hEnczwAA";

function App() {
  const [count, setCount] = useState(0);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.4594);
  const [lat, setLat] = useState(37.7861);
  const [zoom, setZoom] = useState(11);

  const markerHeight = 50;
  const markerRadius = 10;
  const linearOffset = 25;
  const popupOffsets = {
    top: [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    bottom: [0, -markerHeight],
    "bottom-left": [
      linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    "bottom-right": [
      -linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  };

  let marker = new mapboxgl.Marker();

  function add_marker(event:any) {
    let coordinates = event.lngLat;
    console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);
    marker.setLngLat(coordinates).addTo(map.current);
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once

    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
    });
    // const directions = new MapboxDirections({
    //       accessToken: mapboxgl.accessToken
    //   });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
        })

    map.current = new mapboxgl.Map({
      attributionControl: false,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    })
      .addControl(
        new mapboxgl.AttributionControl({
          customAttribution: "Map design by me",
        })
      )
      .addControl(nav)
      // .addControl(directions)
      .addControl(geocoder);
      
      

    const popup = new mapboxgl.Popup({
      offset: popupOffsets,
      className: "my-class",
    })
      .setLngLat([-122.4194, 37.7749])
      .setHTML("<h1>Hello World!</h1>")
      .setMaxWidth("300px")
      .addTo(map.current);
  });

  useEffect(() => {
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("click", (event) => {
      add_marker(event);
    });

    map.current.on("load", () => {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.483696, 37.833818],
              [-122.483482, 37.833174],
              [-122.483396, 37.8327],
              [-122.483568, 37.832056],
              [-122.48404, 37.831141],
              [-122.48404, 37.830497],
              [-122.483482, 37.82992],
              [-122.483568, 37.829548],
              [-122.48507, 37.829446],
              [-122.4861, 37.828802],
              [-122.486958, 37.82931],
              [-122.487001, 37.830802],
              [-122.487516, 37.831683],
              [-122.488031, 37.832158],
              [-122.488889, 37.832971],
              [-122.489876, 37.832632],
              [-122.490434, 37.832937],
              [-122.49125, 37.832429],
              [-122.491636, 37.832564],
              [-122.492237, 37.833378],
              [-122.493782, 37.833683],
            ],
          },
        },
      });
      map.current.addLayer({
        id: "routepoint",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "orange",
          "line-width": 8,
        },
      });
    });
  });

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
