import { atom } from "recoil";


const cityListState = atom({
  key: 'cityList',
  default: localStorage.getItem("city_list_") || {},
});

export { cityListState }