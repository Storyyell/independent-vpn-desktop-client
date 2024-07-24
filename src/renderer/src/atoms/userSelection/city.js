import { atom } from "recoil";

const citySelectedState = atom({
  key: 'citySelected',
  default: null,
});

export { citySelectedState }