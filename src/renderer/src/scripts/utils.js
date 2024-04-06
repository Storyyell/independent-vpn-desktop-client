const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

async function refreshCountryList(deviceToken, serverList, setServerList) {
  const now = Date.now();

  const lastRefreshTimestamp = serverList?.countries?.timestamp; // new Date()

  if (deviceToken && (!lastRefreshTimestamp || (now - lastRefreshTimestamp) >= dataValidityPeroid)) {
    try {
      const res = await window.api.getCountries(deviceToken);
      const updatedServerList = {
        ...serverList,
        countries: { data: res.data, timestamp: new Date() }
      };
      setServerList(updatedServerList);
      return updatedServerList;
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
      const updatedServerList = {
        ...serverList,
        cities: {
          ...serverList.cities,
          [countryId]: { data: res.data, timestamp: new Date() }
        }
      };
      setServerList(updatedServerList);
      return updatedServerList;
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
      const updatedServerList = {
        ...serverList,
        servers: {
          ...serverList.servers,
          [`${countryId}-${cityId}`]: { data: res.data, timestamp: new Date() }
        }
      };
      setServerList(updatedServerList);
      return updatedServerList;
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

