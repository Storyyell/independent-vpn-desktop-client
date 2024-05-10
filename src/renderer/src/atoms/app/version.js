import { atom } from "recoil";

const appVersionState = atom({
  key: 'appVersionId',
  default: "",
});

export { appVersionState }