import { atom } from "recoil";

const deviceTokenState = atom({
  key: 'deviceTokenID',
  default: JSON.parse(localStorage.getItem("device_token_")) || "",
});

export { deviceTokenState }