import React from 'react';
import Box from '@mui/material/Box';
import loaderLogo from '../../assets/loaderLogo.svg'; // Adjust the path as needed
import { Typography } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoadingState } from '../../atoms/app/loadingScreeen';
import { deviceTokenState } from '../../atoms/app/token';
import { countryListState } from '../../atoms/available/countryList';
import { geoCoordinateState } from '../../atoms/app/geoCordinate';
import { locationReload, refreshCityList, refreshCountryList } from '../../scripts/utils';
import { cityListState } from '../../atoms/available/cityList';
import { SysSettingsContext } from '../../context/SysSettingsContext';

const LoadingScreen = () => {
  const setLoading = useSetRecoilState(isLoadingState);
  const deviceToken = useRecoilValue(deviceTokenState);
  const [countryList, setCountryList] = useRecoilState(countryListState);
  const setCoordinate = useSetRecoilState(geoCoordinateState);
  const [loaderTxt, setLoaderTxt] = React.useState("Loading...");
  const [cityList, setCityList] = useRecoilState(cityListState);
  const [location, setLocation] = useRecoilState(geoCoordinateState);
  const { SysSettings } = React.useContext(SysSettingsContext);


  function Loader() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const intervalId = setInterval(() => {
        setProgress((currentProgress) => (currentProgress + 1) % 4);
      }, 500);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }, []); // Empty array ensures effect runs only once on mount

    // applay tray icon
    React.useEffect(() => {
      if (SysSettings?.trayIcon) {
        window.api.toggleTray(true);
      }
    }, [SysSettings]);

    return (
      <>
        {progress === 0 && "."}
        {progress === 1 && ".."}
        {progress === 2 && "..."}
        {progress === 3 && "...."}
      </>
    );
  }



  React.useEffect(() => {
    if (deviceToken == "") {
      setLoaderTxt("registering device ");
      return;
    }
    if (location.ip === "") {
      setLoaderTxt("Setting-up the system ");
      locationReload(deviceToken, setLocation, 0)
      return;
    }

    if (countryList.data.length === 0) {
      setLoaderTxt("Loading countries ");
      refreshCountryList(deviceToken, countryList, setCountryList);
      return;
    } else {
      setLoaderTxt("Loading cities ");
      countryList.data.forEach((d) => {
        refreshCityList(deviceToken, d.id, cityList, setCityList)
      })
      setLoading(false);
      return;
    }

  }, [deviceToken, countryList, location]);

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
          py: 3,
          display: "flex",
          direction: "row",
          justifyContent: "center"
        }}
      >
        <Typography>
          {loaderTxt}
        </Typography><Box sx={{ width: "20px", px: 0.5 }}><Loader /></Box>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
