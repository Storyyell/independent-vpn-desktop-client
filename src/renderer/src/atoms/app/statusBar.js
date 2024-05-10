import { atom } from "recoil";

const statusBarState = atom({
  key: 'statusBarText',
  default: 2,
});

export { statusBarState }