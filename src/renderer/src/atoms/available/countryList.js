import { atom } from "recoil";


const countryListState = atom({
  key: 'countryList',
  default: {
    timeStamp: new Date - 15 * 60 * 1000, // last 15 minute
    data:  localStorage.getItem("country_list_") || []
  },
});

export { countryListState }