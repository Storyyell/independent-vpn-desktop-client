import { atom } from "recoil";


const countryListState = atom({
  key: 'countryList',
  default: {
    timeStamp: new Date - 15 * 60 * 1000, // last 15 minute
    data:  JSON.parse(localStorage.getItem("country_list_"))?.data || []
  },
});

export { countryListState }