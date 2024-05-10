import { atom } from "recoil";


const serverListState = atom({
  key: 'serverList',
  default: {
    timeStamp: new Date - 15 * 60 * 1000, // last 15 minute
    data: {}
  },
});

export { serverListState }