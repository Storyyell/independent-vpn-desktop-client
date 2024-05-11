import React, { useRef, useEffect, useState } from 'react';
// eslint-disable-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl';
import { Box } from '@mui/material';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

export default function MapBoxUI() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(7);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(0.5));
    });
  });

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