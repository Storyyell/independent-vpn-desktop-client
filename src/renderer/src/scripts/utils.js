const dataValidityPeroid = 10 * 60 * 1000 // 10minutes

async function refreshCountryList(deviceToken, serverList, setServerList) {
  const now = Date.now();

  const lastRefreshTimestamp = serverList?.countries?.timestamp; // new Date()

  const refresh = () => {

    window.api.getCountries(deviceToken)
      .then((res) => {
        setServerList((d) => {
          return { ...d, countries: { data: res.data, timestamp: new Date() } }
        })
      })
      .catch((e) => {
        console.log(e)
      })

  }

  if (deviceToken && (!lastRefreshTimestamp || (now - lastRefreshTimestamp) >= dataValidityPeroid)) {
    refresh();
  }
}

function refreshCityList(countryId, deviceToken, serverList, setServerList) {

  const now = Date.now();

  const lastRefreshTimestamp = serverList?.cities?.countryId?.timestamp; // new Date()

  if ((!lastRefreshTimestamp || now - lastRefreshTimestamp > dataValidityPeroid) && countryId && deviceToken) {
    window.api.getCities(deviceToken, countryId)
      .then((res) => {
        setServerList((d) => {
          return {
            ...d, cities: {
              ...d.cities,
              [countryId]: { data: res.data, timestamp: new Date() }
            }
          }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

}

function refreshServerList(countryId, cityId, setServerList, deviceToken) {

  if (deviceToken && countryId && cityId) {
    window.api.getServers(deviceToken, countryId, cityId)
      .then((res) => {
        setServerList((d) => {
          return {
            ...d, servers: {
              ...d.servers,
              [`${countryId}-${cityId}`]: { data: res.data, timestamp: new Date() }
            }
          }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

export {
  refreshCountryList,
  refreshCityList,
  refreshServerList

};

