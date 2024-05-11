import { atom } from "recoil";

const geoCoordinateState = atom({
  key: 'geoCoordinate',
  default: {
    lat: 50.8101,
    lng: 4.3247,
    ip: ""
  },
});

export { geoCoordinateState }