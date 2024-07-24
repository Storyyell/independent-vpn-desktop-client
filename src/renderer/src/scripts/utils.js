const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

async function refreshCountryList(deviceToken, countryList, setCountryList) {
  const now = Date.now();
  const lastRefreshTimestamp = countryList?.timestamp;

  const shouldRefresh = deviceToken &&
    (!lastRefreshTimestamp || (now - lastRefreshTimestamp) >= dataValidityPeroid);

  if (shouldRefresh) {
    window.api.getCountries(deviceToken).then(({ data }) => {
      setCountryList({ data: data || [], timestamp: new Date() });
    }).catch((e) => {
      // console.error(e);
      console.error('Failed to get country list');
    });
  }

  return countryList?.data || [];
}

async function refreshCityList(deviceToken, countryId, cityList, setCityList) {
  const now = Date.now();
  const cityObj = cityList?.[countryId];

  if (cityObj) {
    const lastRefreshTimestamp = cityObj.timestamp;

    if (((now - lastRefreshTimestamp) < dataValidityPeroid) && deviceToken && countryId) {
      return cityObj.data || [];
    }
  }

  if (deviceToken && countryId) {
    window.api.getCities(deviceToken, countryId).then(({ data }) => {
      setCityList((cityListObj) => ({
        ...cityListObj,
        [countryId]: { data: data || [], timestamp: new Date() }
      }));
    }).catch((e) => {console.error("Failed to get city list")});
  }

  return cityObj?.data || [];
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
      // console.error(e);
      console.error('Failed to get server list');
    }
  }
  return serverList;

}


function locationReload(deviceToken, setLocation, timeout = 1000) {
  setTimeout(() => {
    if (deviceToken != "") {
      window.api.getIp(deviceToken)
        .then((data) => {
          if (data) {
            setLocation({
              lat: data?.lat,
              lng: data?.lon,
              ip: data?.query
            })
          }
        })
        .catch((e) => { });
    }
  }, timeout);
}


export {
  refreshCountryList,
  refreshCityList,
  refreshServerList,
  locationReload,
};

