import { atom } from "recoil";

const deviceTokenState = atom({
  key: 'deviceTokenID',
  default: localStorage.getItem("device_token_") || "",
});

export { deviceTokenState }