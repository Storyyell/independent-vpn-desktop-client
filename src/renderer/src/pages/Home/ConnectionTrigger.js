import { getServerList } from "../../scripts/serverListFx";
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


async function handleVpnConnTrigger(
  deviceToken,
  countryCodeSelected,
  cityCodeSelected,
  vpnConnectionStatus,
  setVpnConnectionStatus,
  countryList,
  setCountryList,
  cityList,
  setCityList,
  setCountrySelected,
  setCitySelected,
  setServerSelected,
  serverListObj,
  setServerListObj
) {

  switch (true) {

    case (cityCodeSelected === null && countryCodeSelected === null):

      await (async () => {

        const connect = async () => {
          try {
            console.log('countryCodeSelected === null && cityCodeSelected === null');
            setVpnConnectionStatus(2);

            console.log('Fetching country list...');
            let cl = await refreshCountryList(deviceToken, countryList, setCountryList);

            let clshuffled = shuffleArray([...cl]);

            let totalServerCount = 0;

            clshuffled?.forEach(async (country) => { totalServerCount += country.servers_available; });

            let NoOfServer = Math.min(retryServerNo, totalServerCount);

            const NoOfServerOriginal = NoOfServer;

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
                let cl = await refreshCityList(deviceToken, country?.id, cityList, setCityList);

                for (let i = 0; i < cl.length && NoOfServer > 0; i++) {
                  const slc = await getServerList(deviceToken, serverListObj, setServerListObj, "V2RAY", country?.id, cl[i]?.id);
                  sl = sl.concat(slc);
                  NoOfServer -= cl[i]?.servers_available;
                }
              }
            }));

            try {
              sl = sl.slice(0, NoOfServerOriginal);
            } catch (error) {
              disconnectServer(setVpnConnectionStatus);
            }
            return sl;

          } catch (error) {
            disconnectServer(setVpnConnectionStatus);
            return [];
          }
        }

        switch (vpnConnectionStatus) {
          case 1:
            console.log('Already connected. Disconnecting...');
            await disconnectServer(setVpnConnectionStatus);
            break

          case 2:
            console.log('Currently connecting...');
            break

          case 0:
            console.log('Disconnected. Connecting to new location...');
            let sl = await connect();
            await retryLogic(sl, deviceToken, setVpnConnectionStatus, connectServer, setCountrySelected, setCitySelected, setServerSelected, disconnectServer);
            break
          case 3:
            console.log('Currently disconnecting...');
            break;

          default:
            await disconnectServer(setVpnConnectionStatus);
            break
        }

      })()
      break

    case (cityCodeSelected === null && countryCodeSelected !== null):

      await (async () => {

        const connect = async () => {
          try {
            setVpnConnectionStatus(2);
            console.log(`selectedCountry = ${countryCodeSelected} && selectedCity === null`);
            // handle the case of during city list fetching
            let slc_ = await refreshCityList(deviceToken, countryCodeSelected, cityList, setCityList);

            let citiesServerCount = 0;

            slc_?.forEach(async (city) => {
              citiesServerCount += city.servers_available;
            });

            let NoOfServer = Math.min(retryServerNo, citiesServerCount);
            const NoOfServerOriginal = NoOfServer;

            slc_ = shuffleArray([...slc_]);

            let selectedCity = [];

            slc_.forEach(city => {
              if (NoOfServer > 0) {
                selectedCity.push(city);
                NoOfServer -= city.servers_available;
              }
            });

            let sl = [];

            NoOfServer = NoOfServerOriginal;
            await Promise.all(slc_.map(async (city) => {

              if (NoOfServer > 0) {
                const slc = await getServerList(deviceToken, serverListObj, setServerListObj, "V2RAY", countryCodeSelected, city.id);
                sl = sl.concat(slc);
                NoOfServer -= city.servers_available;
              }
            }));

            try { sl = sl.slice(0, NoOfServerOriginal); }
            catch (error) {
              disconnectServer(setVpnConnectionStatus);
            }
            return sl;

          } catch (error) {
            disconnectServer(setVpnConnectionStatus);
            return [];
          }
        }


        switch (vpnConnectionStatus) {
          case 1:
            console.log('Already connected. Disconnecting...');
            await disconnectServer(vpnConnectionStatus);

            // commented auto reconnect on diff location feature
            // if (selectedItems?.countryId == window?.currentLocation?.country_id) {
            //   console.log('Same location. Disconnecting...');

            // } else {
            //   console.log('Different location. Disconnecting...');
            //   console.log('Connecting to new location...');
            //   let sl = await connect();
            //   await retryLogic(sl, deviceToken, setVpnStatus, setVpnStatusMain, connectServer, disconnectServer);
            // }

            break

          case 2:
            console.log('Currently connecting...');
            break

          case 0:
            console.log('Disconnected. Connecting to specified country...');
            let sl = await connect();
            await retryLogic(sl, deviceToken, setVpnConnectionStatus, connectServer, setCountrySelected, setCitySelected, setServerSelected, disconnectServer);
            break;

          case 3:
            console.log('Currently disconnecting...');
            break;

          default:
            await disconnectServer(vpnConnectionStatus);
            break
        }
      })();

      break


    case (cityCodeSelected !== null && countryCodeSelected !== null):
      await (async () => {

        console.log(`selectedCountry !== ${countryCodeSelected} && selectedCity = ${cityCodeSelected}`);
        const connnet = async () => {
          try {
            setVpnConnectionStatus(2);
            const slc = await getServerList(deviceToken, serverListObj, setServerListObj, "V2RAY", countryCodeSelected, cityCodeSelected);
            const sl = selectRandomItems(slc, retryServerNo);
            await retryLogic(sl, deviceToken, setVpnConnectionStatus, connectServer, setCountrySelected, setCitySelected, setServerSelected, disconnectServer);
          } catch (error) {
            console.error(error);
            await disconnectServer(setVpnStatusMain)
          }
        }

        switch (vpnConnectionStatus) {

          case 1:
            console.log('Already connected. Disconnecting...');
            await disconnectServer(setVpnConnectionStatus);

            // commented auto reconnect on diff location feature
            // if (selectedItems?.countryId == window?.currentLocation?.country_id && selectedItems?.cityId == window?.currentLocation?.city_id) {
            //   console.log('Same location. Disconnecting...');
            // } else {
            //   console.log('Connecting to new location...');
            //   await connnet();
            // }

            break;

          case 2:
            console.log('Currently connecting...');
            break;

          case 0:
            console.log('Disconnected. Connecting to specified location...');
            await connnet();
            break;

          case 3:
            console.log('Currently disconnecting...');
            break;

          default:
            await disconnectServer(setVpnConnectionStatus);
            break;
        }

      })();

      break;

    default:
      await disconnectServer(setVpnConnectionStatus)
      break
  }
}



async function connectServer(deviceToken, server, setVpnConnectionStatus, setCountrySelected, setCitySelected, setServerSelected, disconnectServer) {
  try {
    setCountrySelected(server.country_id);
    setCitySelected(server.city_id);
    setServerSelected(server.id);
    console.log(`connecting to country: ${server.country_id}, city: ${server.city_id}, server: ${server.id}`);
    setVpnConnectionStatus(2);
    let serverParms = {
      device_token: deviceToken,
      countryCode: server.country_id,
      cityCode: server.city_id,
      serverId: server.id
    };
    const res = await window.api.triggerConnection(serverParms);
    if (res) {
      setVpnConnectionStatus(1);
      return true;
    } else {
      setVpnConnectionStatus(0);
      return false;
    }
  } catch (error) {
    await disconnectServer(setVpnConnectionStatus)
    return false;
  }

}

const retryLogic = async (sl, deviceToken, setVpnConnectionStatus, connectServer, setCountrySelected, setCitySelected, setServerSelected, disconnectServer,) => {
  try {
    if (sl.length > 0) {
      for (let i = 0; i < sl.length; i++) {
        i > 0 &&
          console.log(`Connecting to server ${i + 1}`);
        if (await connectServer(deviceToken, sl[i], setVpnConnectionStatus, setCountrySelected, setCitySelected, setServerSelected, disconnectServer)) {
          break;
        }
      }
    }
  } catch (error) {
    console.error(error);
    await disconnectServer(setVpnConnectionStatus)
  }
}

async function disconnectServer(setVpnConnectionStatus) {
  try {
    // disconnecting...
    setVpnConnectionStatus(3);
    await window.api.triggerDisconnection();
  } catch (error) {
    console.error(error);
  }
  // disconnected
  setVpnConnectionStatus(0);

}

export { handleVpnConnTrigger }