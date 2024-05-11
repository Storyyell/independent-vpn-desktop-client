import { atom } from "recoil";

const geoCoordinateState = atom({
  key: 'geoCoordinate',
  default: {
    lat: -28.6174,
    lng: -14.5599
  },
});

export { geoCoordinateState }