import { selector } from "recoil";
import { countryListState } from "../atoms/available/countryList";
import { deviceTokenState } from "../atoms/app/token";


const countryListMain = selector({
  key: 'countryListSelector',
  get: ({ get }) => {
    const countryList = get(countryListState);
    const deviceToken = get(deviceTokenState);

    const now = new Date();

    if (deviceToken && (now - countryList.timeStamp > dataValidityPeroid)) {
      console.log("county list fetch trigerred")

    }

    return countryList.data

  }
});

export { countryListMain }