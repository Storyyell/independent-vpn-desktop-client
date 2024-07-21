import { selector } from "recoil";
import { countryListState } from "../atoms/available/countryList";
import { countrySelectedState } from "../atoms/userSelection/country";

const countryNameSelected = selector({
  key: 'countryNameSelectionSelector',
  get: ({ get }) => {
    const countryList = get(countryListState);
    const countryIdSelected = get(countrySelectedState);

    if (countryIdSelected == null) {
      return { name: "", code: "" };
    }

    const countryObj = countryList.data.find((countryObj) => {
      return countryObj.id === countryIdSelected;
    });

    return {
      name: countryObj?.name || "",
      code: countryObj?.code || ""
    };
  },
});

export { countryNameSelected };