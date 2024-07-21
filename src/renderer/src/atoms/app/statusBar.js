import { atom } from "recoil";

const statusBarState = atom({
  key: 'statusBarText',
  default: 0,
});

export { statusBarState }