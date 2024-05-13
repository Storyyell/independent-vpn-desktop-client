import { atom } from "recoil";

const onlineState = atom({
  key: 'onlineState',
  default: true,
});

export { onlineState }