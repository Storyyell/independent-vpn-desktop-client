import React from 'react';
import Box from '@mui/material/Box';
import loaderLogo from '../../assets/loaderLogo.svg'; // Adjust the path as needed
import { Typography } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoadingState } from '../../atoms/app/loadingScreeen';
import { deviceTokenState } from '../../atoms/app/token';
import { countryListState } from '../../atoms/available/countryList';
import { geoCoordinateState } from '../../atoms/app/geoCordinate';
import { refreshCountryList } from '../../scripts/utils';

const LoadingScreen = () => {
  const setLoading = useSetRecoilState(isLoadingState);
  const deviceToken = useRecoilValue(deviceTokenState);
  const [countryList, setCountryList] = useRecoilState(countryListState);
  const setCoordinate = useSetRecoilState(geoCoordinateState);
  const [loaderTxt, setLoaderTxt] = React.useState("Loading...");

  React.useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.getElementById("demo").innerHTML =
        "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
      // document.getElementById("demo").innerHTML =
      //   "Latitude: " + position.coords.latitude +
      //   "Longitude: " + position.coords.longitude;
      console.log(position.coords.latitude, position.coords.longitude);
    }

    if (deviceToken == "") {
      setLoaderTxt("registering device...");
      return;
    }

    if (countryList.data.length === 0) {
      setLoaderTxt("Loading countries...");
      refreshCountryList(deviceToken, countryList, setCountryList);
      return;
    } else {
      // setLoading(false);
    }

  }, [deviceToken, countryList]);

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        component="img"
        src={loaderLogo}
        alt="Loading..."
        sx={{
          width: 174,
          height: 210,
          boxShadow: 0
        }}
        style={{
          marginBottom: 150
        }}
      />
      <p id="demo"></p>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100vw',
          textAlign: 'center',
          py: 3
        }}
      >
        <Typography>
          {loaderTxt}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
