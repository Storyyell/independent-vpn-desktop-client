
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

function refreshCityList(selectedItems, deviceToken, setServerList) {

  if (selectedItems?.countryId && deviceToken) {
    window.api.getCities(deviceToken, selectedItems?.countryId)
      .then((res) => {
        setServerList((d) => {
          return {
            ...d, cities: {
              ...d.cities,
              [selectedItems?.countryId]: res.data
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

