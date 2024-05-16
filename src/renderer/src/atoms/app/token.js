import { atom } from "recoil";

const getDeviceTokenFromLocalStorage = () => {
  try {
    const item = localStorage.getItem("device_token_");
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error("Error parsing device token from localStorage:", e);
  }
  return ""; // Return default empty string if there's an error or if no item is found.
};

const deviceTokenState = atom({
  key: 'deviceTokenID',
  default: getDeviceTokenFromLocalStorage(),
});

export { deviceTokenState };
