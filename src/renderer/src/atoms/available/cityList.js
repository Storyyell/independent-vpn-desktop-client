import { atom } from "recoil";


const cityListState = atom({
  key: 'cityList',
  default: JSON.parse(localStorage.getItem("city_list_")) || {},
});

export { cityListState }