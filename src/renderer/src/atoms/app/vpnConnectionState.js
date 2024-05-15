import { atom } from "recoil";

// 0 : not connected
// 1 : connected
// 2 : connecting
// 3 : disconnecting

const vpnConnectionState = atom({
  key: 'vpnConnectionStatus',
  default: 2,
});

export { vpnConnectionState }