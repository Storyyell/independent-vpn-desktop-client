const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

async function refreshCountryList(deviceToken, countryList, setCountryList) {
  const now = Date.now();

  const lastRefreshTimestamp = countryList?.timeStamp; // new Date()

  if (deviceToken && ((now - lastRefreshTimestamp) >= dataValidityPeroid)) {
    try {
      const { data } = await window.api.getCountries(deviceToken);
      setCountryList({ data: data || [], timestamp: new Date() });
      return data || [];
    } catch (e) {
      log.error(e);
      return countryList?.data || [];
    }
  }
  return countryList?.data || [];
}

async function refreshCityList(deviceToken, countryId, cityList, setCityList) {

  const now = Date.now();

  const cityObj = cityList?.[countryId]

  if (cityObj) {
    const lastRefreshTimestamp = cityObj?.timestamp; // new Date()

    if (((now - lastRefreshTimestamp) < dataValidityPeroid) && deviceToken && countryId) {

      return cityObj.data || [];
    }
  }
  try {

    if (!deviceToken || !countryId) {
      return [];
    }

    const { data } = await window.api.getCities(deviceToken, countryId);

    setCityList((cityListObj) => {
      return {
        ...cityListObj,
        [countryId]: { data: data || [], timestamp: new Date() }
      }
    });

    return data || [];


  } catch (e) {
    // log.error(e);
    console.log(e);
    return cityObj?.data || [];
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
      log.error(e);
    }
  }
  return serverList;

}

export {
  refreshCountryList,
  refreshCityList,
  refreshServerList

};

