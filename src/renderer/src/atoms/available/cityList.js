import { atom } from "recoil";

const getCityListFromLocalStorage = () => {
  try {
    const item = localStorage.getItem("city_list_");
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    // Log error to console for debugging purposes.
    console.error("Error parsing city list from localStorage:", e);
  }
  // Return an empty object if there's an error or if no item is found.
  return {};
};

const cityListState = atom({
  key: 'cityList',
  default: getCityListFromLocalStorage(),
});

export { cityListState };
