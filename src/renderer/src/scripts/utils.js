
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

export {
  refreshCountryList,
  refreshCityList

};

