const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

async function refreshCountryList(deviceToken, serverList, setServerList) {
  const now = Date.now();

  const lastRefreshTimestamp = serverList?.countries?.timestamp; // new Date()

  if (deviceToken && (!lastRefreshTimestamp || (now - lastRefreshTimestamp) >= dataValidityPeroid)) {
    try {
      const res = await window.api.getCountries(deviceToken);
      setServerList((d) => {
        return { ...d, countries: { data: res.data, timestamp: new Date() } }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

async function refreshCityList(countryId, deviceToken, serverList, setServerList) {

  const now = Date.now();

  const lastRefreshTimestamp = serverList?.cities?.countryId?.timestamp; // new Date()

  if ((!lastRefreshTimestamp || now - lastRefreshTimestamp > dataValidityPeroid) && countryId && deviceToken) {
    try {
      const res = await window.api.getCities(deviceToken, countryId);
      setServerList((d) => {
        return {
          ...d, cities: {
            ...d.cities,
            [countryId]: { data: res.data, timestamp: new Date() }
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

}

async function refreshServerList(countryId, cityId, setServerList, serverList, deviceToken) {

  const now = Date.now();

  const lastRefreshTimestamp = serverList?.servers?.[`${countryId}-${cityId}`]?.timestamp; // new Date()


  if ((!lastRefreshTimestamp || now - lastRefreshTimestamp > dataValidityPeroid) && deviceToken && countryId && cityId) {
    try {
      const res = await window.api.getServers(deviceToken, countryId, cityId);
      setServerList((d) => {
        return {
          ...d, servers: {
            ...d.servers,
            [`${countryId}-${cityId}`]: { data: res.data, timestamp: new Date() }
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

}

export {
  refreshCountryList,
  refreshCityList,
  refreshServerList

};

