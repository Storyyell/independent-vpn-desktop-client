import { atom } from "recoil";

const countrySelectedState = atom({
  key: 'countrySelected',
  default: null,
});

export { countrySelectedState }