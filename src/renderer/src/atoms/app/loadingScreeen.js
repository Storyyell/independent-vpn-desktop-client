import { atom } from "recoil";

const isLoadingState = atom({
  key: 'loadingScreenState',
  default: true,
});

export { isLoadingState }