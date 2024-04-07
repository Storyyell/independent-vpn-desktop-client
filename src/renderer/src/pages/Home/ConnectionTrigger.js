import { refreshServerList } from "../../scripts/utils";

const retryServerNo = 3;

function selectRandomItems(array, count) {
  const randomItems = [];
  const arrayLength = array.length;
  const maxCount = Math.min(count, arrayLength);
  const selectedIndexes = new Set();

  while (randomItems.length < maxCount) {
    const randomIndex = Math.floor(Math.random() * arrayLength);
    if (!selectedIndexes.has(randomIndex)) {
      selectedIndexes.add(randomIndex);
      randomItems.push(array[randomIndex]);
    }
  }

  return randomItems;
}


async function handleVpnConnTrigger(deviceToken, selectedItems, serverList, setVpnStatus, vpnStatusMain, setServerList, setVpnStatusMain) {

  console.log('handleVpnConnTrigger');

  switch (true) {

    case (selectedItems.cityId === null && selectedItems.countryId === null):

      console.log('selectedItems.cityId === null && selectedItems.countryId === null');
      break

    case (selectedItems.cityId === null && selectedItems.countryId !== null):

      console.log('selectedItems.cityId === null && selectedItems.countryId !== null');
      break

    case (selectedItems.cityId !== null && selectedItems.countryId !== null):

      console.log('selectedItems.cityId !== null && selectedItems.countryId !== null');

      const connnet = async () => {
        try {
          setVpnStatusMain('connecting');
          const slc = await refreshServerList(selectedItems?.countryId, selectedItems?.cityId, setServerList, serverList, deviceToken);
          const slObj = slc.servers?.[`${selectedItems.countryId}-${selectedItems.cityId}`];
          const sl = selectRandomItems(slObj.data, retryServerNo);
          console.log(sl);
          if (sl.length > 0) {

            for (let i = 0; i < sl.length; i++) {
              // todo add a abort mechanism
              i > 0 && setVpnStatus(`retrying  ${i}...`);
              console.log(`Connecting to server ${i + 1}`);
              if (await connectServer(deviceToken, sl[i], setVpnStatusMain)) {
                break;
              }
            }

          }
        } catch (error) {
          console.log(error);
          await disconnectServer()
        }

      }

      switch (vpnStatusMain) {
        case 'connected':
          console.log('Already connected. Disconnecting...');
          await disconnectServer();
          break
        case 'connecting':
          console.log('Currently connecting...');
          if (!(selectedItems?.countryId == window?.currentLocation?.country_id && selectedItems?.cityId == window?.currentLocation?.city_id)) {
            console.log('Different location. Disconnecting...');
            await disconnectServer()
            console.log('Connecting to new location...');
            await connnet();
          }
          break

        case 'disconnected':
          console.log('Disconnected. Connecting to new location...');
          await connnet();
          break

        default:
          await disconnectServer()
          break
      }

      break

    default:

      await disconnectServer()
      break
  }
}


async function connectServer(deviceToken, server, setVpnStatusMain) {

  try {

    window.currentLocation = {
      country_id: server.country_id,
      city_id: server.city_id,
      server_id: server.id
    };

    setVpnStatusMain('connecting');
    let serverParms = {
      device_token: deviceToken,
      countryCode: server.country_id,
      cityCode: server.city_id,
      serverId: server.id
    };
    const res = await window.api.triggerConnection(serverParms);
    if (res) {
      setVpnStatusMain('connected');
      return true;
    } else {
      setVpnStatusMain('disconnected');
      return false;
    }
  } catch (error) {
    await disconnectServer()
    return false;
  }

}

async function disconnectServer() {
  try {
    await window.api.triggerDisconnection();
    setVpnStatusMain('disconnected');
  } catch (error) {
    console.log(error);
  }
  setVpnStatusMain('disconnected');

}

export { handleVpnConnTrigger }