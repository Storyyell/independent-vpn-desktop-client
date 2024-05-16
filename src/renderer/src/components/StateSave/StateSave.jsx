import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { deviceTokenState } from '../../atoms/app/token';
import { countryListState } from '../../atoms/available/countryList';
import { cityListState } from '../../atoms/available/cityList';
import { serverListState } from '../../atoms/available/serverList';



const StateSave = () => {

  const deviceToken =  useRecoilValue(deviceTokenState);
  const countryList = useRecoilValue(countryListState);
  const cityList = useRecoilValue(cityListState);
  const serverList = useRecoilValue(serverListState);

  React.useEffect(() => {
  // code to load state 
  },[]);

  window.onbeforeunload = () => {
    localStorage.setItem("device_token_", JSON.stringify(deviceToken));
    localStorage.setItem("country_list_", JSON.stringify(countryList));
    localStorage.setItem("city_list_", JSON.stringify(cityList));
    localStorage.setItem("server_list_", JSON.stringify(serverList));
  };

  return (
    <></>
  )
}

export default StateSave