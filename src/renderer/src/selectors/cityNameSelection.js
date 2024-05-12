import { selector } from "recoil";
import { countrySelectedState } from "../atoms/userSelection/country";
import { citySelectedState } from "../atoms/userSelection/city";
import { cityListState } from "../atoms/available/cityList";

const cityNameSelected = selector({
  key: 'cityNameSelectionSelector',
  get: ({ get }) => {
    const cityListObj = get(cityListState);
    const countryIdSelected = get(countrySelectedState);
    const cityIdSelected = get(citySelectedState);

    debugger;
    if (countryIdSelected == null) {
      return { name: "", code: "" };
    }

    if (cityIdSelected == null) {
      return { name: "", code: "" };
    }

    const targetCityObj = cityListObj[countryIdSelected]?.data?.find((cityObj) => {
      return cityObj.id === cityIdSelected;
    });

    return {
      name: targetCityObj?.name || "",
      code: targetCityObj?.code || ""
    };
  },
});

export { cityNameSelected };