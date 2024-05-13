import { atom } from "recoil";


const serverListState = atom({
  key: 'serverList',
  default: localStorage.getItem("server_list_") || {},
});

export { serverListState }