import { atom } from "recoil";

const appVersionState = atom({
  key: 'appVersionId',
  default: "0.0.0",
});

export { appVersionState }