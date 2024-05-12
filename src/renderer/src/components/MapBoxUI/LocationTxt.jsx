import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { geoCoordinateState } from '../../atoms/app/geoCordinate';
import { Typography } from '@mui/material';
import { vpnConnectionState } from '../../atoms/app/vpnConnectionState';
import { countryNameSelected } from '../../selectors/countryNameSelection';
import { cityNameSelected } from '../../selectors/cityNameSelection';
import { locationReload } from '../../scripts/utils';
import { deviceTokenState } from '../../atoms/app/token';

const LocationTxt = () => {

  const vpnConnectionState_ = useRecoilValue(vpnConnectionState);
  const countryNameObj = useRecoilValue(countryNameSelected);
  const cityNameObj = useRecoilValue(cityNameSelected);
  const deviceToken = useRecoilValue(deviceTokenState);
  const [{ ip }, setLocation] = useRecoilState(geoCoordinateState);

  switch (vpnConnectionState_) {
    case 0:
      //todo handle multiple location reload
      locationReload(deviceToken, setLocation);
      return (
        <>
          <Typography sx={{ fontWeight: 700, }}>Current location</Typography>
          <Typography sx={{ fontWeight: 400, color: "#ACB3BD" }}>{ip}</Typography>
        </>
      )
    case 1:
      locationReload(deviceToken, setLocation);
      return (
        <>
          {ip && <Typography sx={{ fontWeight: 700, }}>{`${countryNameObj.name || ""}, ${cityNameObj.name || ""}`}</Typography>}
          {ip && <Typography sx={{ fontWeight: 400, color: "#ACB3BD" }}>{ip}</Typography>}
        </>
      )

    default:
      return (
        <>
          {ip && <Typography sx={{ fontWeight: 700, }}>Current location</Typography>}
          {ip && <Typography sx={{ fontWeight: 400, color: "#ACB3BD" }}>{ip}</Typography>}
        </>
      )
  }

}

export default LocationTxt