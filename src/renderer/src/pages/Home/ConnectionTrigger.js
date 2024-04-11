import { refreshCountryList, refreshServerList } from "../../scripts/utils";
import { refreshCityList } from "../../scripts/utils";

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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


async function handleVpnConnTrigger(deviceToken, selectedItems, serverList, setVpnStatus, vpnStatusMain, setServerList, setVpnStatusMain, setSelectedItems) {

  switch (true) {

    case (selectedItems.cityId === null && selectedItems.countryId === null):

      await (async () => {

        const connect = async () => {
          try {
            console.log('selectedItems.cityId === null && selectedItems.countryId === null');
            setVpnStatusMain('connecting')
            let countryList = serverList?.countries?.data;

            if (!countryList) {
              console.log('Fetching country list...');
              let cl = await refreshCountryList(deviceToken, serverList, setServerList);
              countryList = cl?.countries?.data;
            }

            let clshuffled = shuffleArray(countryList);

            let totalServerCount = 0;

            countryList?.forEach(async (country) => { totalServerCount += country.servers_available; });

            let NoOfServer = Math.min(retryServerNo, totalServerCount);

            let NoOfServerOriginal = NoOfServer;

            let countriesSelected = [];

            clshuffled.forEach(country => {
              if (NoOfServer > 0) {
                countriesSelected.push(country);
                NoOfServer -= country.servers_available;
              }
            });

            let sl = [];

            NoOfServer = NoOfServerOriginal;

            await Promise.all(countriesSelected.map(async (country) => {
              if (NoOfServer > 0) {
                let cl = await refreshCityList(country?.id, deviceToken, serverList, setServerList);
                cl = cl?.cities?.[country?.id]?.data || [];
                for (let i = 0; i < cl.length && NoOfServer > 0; i++) {
                  const slc = await refreshServerList(country?.id, cl[i]?.id, setServerList, serverList, deviceToken);
                  sl = sl.concat(slc.servers?.[`${country?.id}-${cl[i]?.id}`]?.data);
                  NoOfServer -= cl[i]?.servers_available;
                }
              }
            }));

            try {
              sl.slice(0, NoOfServerOriginal);
            } catch (error) { }
            return sl;

          } catch (error) {
            return [];
          }
        }

        switch (vpnStatusMain) {
          case 'connected':
            console.log('Already connected. Disconnecting...');
            await disconnectServer(setVpnStatusMain);
            break

          case 'connecting':
            console.log('Currently connecting...');
            setSelectedItems((d) => { return { countryId: null, cityId: null } })
            break

          case 'disconnected':
            console.log('Disconnected. Connecting to new location...');
            let sl = await connect();
            await retryLogic(sl, deviceToken, setVpnStatus, setVpnStatusMain, connectServer, disconnectServer);
            break
          case 'disconnecting':
            console.log('Currently disconnecting...');
            break;
          default:
            await disconnectServer(setVpnStatusMain)
            break
        }

      })()
      break

    case (selectedItems.cityId === null && selectedItems.countryId !== null):

      await (async () => {

        const connect = async () => {
          try {
            setVpnStatusMain('connecting');

            const countryId = selectedItems.countryId;
            console.log('selectedItems.cityId === null && selectedItems.countryId !== null');
            // handle the case of during city list fetching
            let cityList = serverList?.cities?.[countryId]?.data;
            if (!cityList) {
              console.log('Fetching city list...');
              await refreshCityList(selectedItems?.countryId, deviceToken, serverList, setServerList);
              cityList = serverList?.cities?.[countryId]?.data;
            }

            let citiesServerCount = 0;

            cityList?.forEach(async (city) => {
              citiesServerCount += city.servers_available;
            });

            let NoOfServer = Math.min(retryServerNo, citiesServerCount);
            const NoOfServerOriginal = NoOfServer;

            cityList = shuffleArray(cityList);

            let selectedCity = [];

            cityList.forEach(city => {
              if (NoOfServer > 0) {
                selectedCity.push(city);
                NoOfServer -= city.servers_available;
              }
            });

            let sl = [];

            await Promise.all(cityList.map(async (city) => {
              const slc = await refreshServerList(city?.country_id, city?.id, setServerList, serverList, deviceToken);
              sl = sl.concat(slc.servers?.[`${city?.country_id}-${city?.id}`]?.data);
            }));

            try { sl = sl.slice(0, NoOfServerOriginal); } catch (error) { }

            return sl;

          } catch (error) {
            return [];
          }
        }


        switch (vpnStatusMain) {
          case 'connected':
            console.log('Already connected. Disconnecting...');
            await disconnectServer(setVpnStatusMain);

            if (selectedItems?.countryId == window?.currentLocation?.country_id) {
              console.log('Same location. Disconnecting...');

            } else {
              console.log('Different location. Disconnecting...');
              console.log('Connecting to new location...');
              let sl = await connect();
              await retryLogic(sl, deviceToken, setVpnStatus, setVpnStatusMain, connectServer, disconnectServer);
            }

            break

          case 'connecting':
            console.log('Currently connecting...');
            setSelectedItems((d) => { return { countryId: window?.currentLocation?.country_id, cityId: null } })
            break

          case 'disconnected':
            console.log('Disconnected. Connecting to new location...');
            let sl = await connect();
            await retryLogic(sl, deviceToken, setVpnStatus, setVpnStatusMain, connectServer, disconnectServer);
            break;

          case 'disconnecting':
            console.log('Currently disconnecting...');
            break;
          default:
            await disconnectServer(setVpnStatusMain)
            break
        }
      })();

      break


    case (selectedItems.cityId !== null && selectedItems.countryId !== null):
      await (async () => {

        // todo ip leak prevention
        console.log('selectedItems.cityId !== null && selectedItems.countryId !== null');

        const connnet = async () => {
          try {
            setVpnStatusMain('connecting');
            const slc = await refreshServerList(selectedItems?.countryId, selectedItems?.cityId, setServerList, serverList, deviceToken);
            const slObj = slc.servers?.[`${selectedItems.countryId}-${selectedItems.cityId}`];
            const sl = selectRandomItems(slObj.data, retryServerNo);
            await retryLogic(sl, deviceToken, setVpnStatus, setVpnStatusMain, connectServer, disconnectServer);
          } catch (error) {
            console.log(error);
            await disconnectServer(setVpnStatusMain)
          }
        }

        switch (vpnStatusMain) {

          case 'connected':
            console.log('Already connected. Disconnecting...');
            await disconnectServer(setVpnStatusMain);

            if (selectedItems?.countryId == window?.currentLocation?.country_id && selectedItems?.cityId == window?.currentLocation?.city_id) {
              console.log('Same location. Disconnecting...');
            } else {
              console.log('Connecting to new location...');
              await connnet();
            }

            break;

          case 'connecting':
            console.log('Currently connecting...');
            setSelectedItems((d) => { return { countryId: window?.currentLocation?.country_id, cityId: window?.currentLocation?.city_id } });
            break;

          case 'disconnected':
            console.log('Disconnected. Connecting to new location...');
            await connnet();
            break;
          case 'disconnecting':
            console.log('Currently disconnecting...');
            break;

          default:
            await disconnectServer(setVpnStatusMain);
            break;
        }

      })();

      break;

    default:
      await disconnectServer(setVpnStatusMain)
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
    console.log(`connecting to country: ${server.country_id}, city: ${server.city_id}, server: ${server.id}`);
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
    await disconnectServer(setVpnStatusMain)
    return false;
  }

}

const retryLogic = async (sl, deviceToken, setVpnStatus, setVpnStatusMain, connectServer, disconnectServer) => {
  try {
    if (sl.length > 0) {
      for (let i = 0; i < sl.length; i++) {
        i > 0 && setVpnStatus(`retrying  ${i}...`);
        console.log(`Connecting to server ${i + 1}`);
        if (await connectServer(deviceToken, sl[i], setVpnStatusMain)) {
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
    await disconnectServer(setVpnStatusMain)
  }
}

async function disconnectServer(setVpnStatusMain) {
  try {
    setVpnStatusMain('disconnecting');
    await window.api.triggerDisconnection();
  } catch (error) {
    console.log(error);
  }
  setVpnStatusMain('disconnected');

}

export { handleVpnConnTrigger }