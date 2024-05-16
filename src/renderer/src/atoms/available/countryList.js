import { atom } from "recoil";

const getCountryListFromLocalStorage = () => {
  try {
    const item = localStorage.getItem("country_list_");
    // Check if item exists before trying to parse it
    return item ? JSON.parse(item).data : [];
  } catch (e) {
    // Log error to console for debugging purposes.
    console.error("Error parsing country list from localStorage:", e);
    return []; // Return an empty array in case of an error
  }
};

const countryListState = atom({
  key: 'countryList',
  default: {
    timeStamp: new Date() - 15 * 60 * 1000, // last 15 minutes
    data: getCountryListFromLocalStorage()
  },
});

export { countryListState };
