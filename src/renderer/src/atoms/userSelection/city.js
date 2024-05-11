import { atom } from "recoil";

const citySelectedState = atom({
  key: 'citySelected',
  default: {},
});

export { citySelectedState }