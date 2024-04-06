
function refreshCountryList(deviceToken, setServerList) {
  if (deviceToken) {
    window.api.getCountries(deviceToken)
      .then((res) => {
        setServerList((d) => {
          return { ...d, countries: res.data }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

function refreshCityList(countryId, deviceToken, setServerList) {

  if (countryId && deviceToken) {
    window.api.getCities(deviceToken, countryId)
      .then((res) => {
        setServerList((d) => {
          return {
            ...d, cities: {
              ...d.cities,
              [countryId]: res.data
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
              [`${countryId}-${cityId}`]: res.data
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

