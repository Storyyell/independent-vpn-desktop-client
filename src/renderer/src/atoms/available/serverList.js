import { atom } from "recoil";


const serverListState = atom({
  key: 'serverList',
  default: JSON.parse(localStorage.getItem("server_list_")) || {},
});

export { serverListState }