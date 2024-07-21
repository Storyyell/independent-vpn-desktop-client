import { atom } from "recoil";

const onlineState = atom({
  key: 'onlineState',
  default: navigator.onLine,
});

export { onlineState }