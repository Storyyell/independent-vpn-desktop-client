import { atom } from "recoil";


const serverListState = atom({
  key: 'serverList',
  default: {},
});

export { serverListState }