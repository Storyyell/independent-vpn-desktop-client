import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { geoCoordinateState } from '../../atoms/app/geoCordinate';
import LocationTxt from './LocationTxt';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

export default function MapBoxUI() {
  const { lat, lng } = useRecoilValue(geoCoordinateState);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // If already initialized, do nothing
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }, []);


  useEffect(() => {
    if (!map.current) return;
    map.current.setCenter([lng, lat]);
    map.current.setZoom(zoom);
  }, [lat, lng, zoom]);



  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#171A20",
        borderRadius: "8px",
        display: "flex",
        flexGrow: 1,
        position: 'relative',
        overflow: "hidden",
        border: "2px solid #20242B",
      }}
    >
      <Box
        ref={mapContainer}
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Map container content goes here */}
      </Box>
      <Box sx={{
        zIndex: 1,
        position: 'absolute',
        width: "100%",
        display: "flex",
        alignItems: "center",
        p: 1,
        flexDirection: "column"
      }}>
        <LocationTxt />
      </Box>
    </Box>


  )
}
