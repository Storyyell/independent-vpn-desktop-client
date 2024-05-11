import { atom } from "recoil";


const cityListState = atom({
  key: 'cityList',
  default: {},
});

export { cityListState }