import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import { geoCoordinateState } from '../../atoms/app/geoCordinate';

// Set your mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

export default function MapBoxUI() {
  const [{ lat, lng }, setCoordinate] = useRecoilState(geoCoordinateState);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(10);

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
      ref={mapContainer}
      sx={{
        width: "100%",
        backgroundColor: "#171A20",
        borderRadius: "8px",
        display: "flex",
        flexGrow: 1,
        overflow: "hidden",
      }}>
    </Box>
  );
}
