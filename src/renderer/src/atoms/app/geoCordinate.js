import { atom } from "recoil";

// Function to generate a random latitude between -90 and 90 degrees
const randomLatitude = () => Math.random() * 180 - 90;

// Function to generate a random longitude between -180 and 180 degrees
const randomLongitude = () => Math.random() * 360 - 180;

const geoCoordinateState = atom({
  key: 'geoCoordinate',
  default: {
    lat: randomLatitude(),
    lng: randomLongitude(),
    ip: ""
  },
});

export { geoCoordinateState };