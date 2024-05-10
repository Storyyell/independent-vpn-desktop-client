import { atom } from "recoil";

const statusBarState = atom({
  key: 'statusBarText',
  default: 1,
});

export { statusBarState }