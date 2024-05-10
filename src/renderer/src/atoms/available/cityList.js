import { atom } from "recoil";


const cityListState = atom({
  key: 'cityList',
  default: {
    timeStamp: new Date - 15 * 60 * 1000, // last 15 minute
    data: {}
  },
});

export { cityListState }