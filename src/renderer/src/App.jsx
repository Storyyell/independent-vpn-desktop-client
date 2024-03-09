import { Stack } from '@mui/material';
import electronLogo from './assets/electron.svg'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function App() {

  function triggerVpnConnection() {
    console.log("vpn connection triggered fron renderer");
    window.ipc();
  }
let statusText = "not connected"

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">sentinal - dvpn</div>
      <div className="text">
        Your Decentralized VPN Solution
      </div>
      {/* <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p> */}
      <Stack direction="row" spacing={1}  style={{paddingTop:"8px",alignItems:'center' }} >
      <Typography variant="overline" display="block" gutterBottom>
        {`status :`}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom >
        {`${statusText} `}
      </Typography>
      </Stack>

      <div className="actions">
        <div className="action">
          {/* <a target="_blank" rel="noreferrer" onClick={triggerVpnConnection}>
            vpn connect
          </a> */}
          <Button  size="medium" variant="outlined" style={{width:"150px",height:"40px",borderRadius:"20px"}}
          onClick={triggerVpnConnection}
          >
          vpn connect
        </Button>
        </div>
      </div>
      {/* <Versions></Versions> */}
    </>
  )
}

export default App

