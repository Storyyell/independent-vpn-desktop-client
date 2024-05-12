import { atom } from "recoil";

const serverSelectedState = atom({
  key: 'serverSelected',
  default: null,
});

export { serverSelectedState }