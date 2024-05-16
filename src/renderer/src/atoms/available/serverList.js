import { atom } from "recoil";

const getServerListFromLocalStorage = () => {
  try {
    const item = localStorage.getItem("server_list_");
    // Parse the item if it exists, otherwise return an empty object
    return item ? JSON.parse(item) : {};
  } catch (e) {
    // Log error to console for debugging purposes.
    console.error("Error parsing server list from localStorage:", e);
    return {}; // Return an empty object in case of an error
  }
};

const serverListState = atom({
  key: 'serverList',
  default: getServerListFromLocalStorage(),
});

export { serverListState };
