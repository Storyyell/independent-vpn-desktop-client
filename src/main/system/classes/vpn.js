import { FastForward } from '@mui/icons-material';
import SENTINEL_API from './sentinel';
import V2RAY from './v2ray'


class VPN{

  constructor () {
    if (VPN.instance instanceof VPN) {
      return VPN.instance;
    }

    this.protocol = 'V2RAY'; // V2RAY, WIREGUARD
    this.platfrom = process.platform;
    this.v2ray = new V2RAY();
    this.apiInstance = new SENTINEL_API();

    this.isConnected = false
    this.isDisconnectionProgress = false
    this.isConnectionProgress = false

    VPN.instance = this;

  }

  //for protocol: V2RAY
  //parms needed: countryCode, cityCode, serverId
  async start({protocol, countryCode, cityCode, serverId }){  // 4 v2ray {protocol, countryCode, cityCode, serverId}
    if (this.isConnected){throw new Error ('vpn already connected')}
    if (this.isConnectionProgress) { throw new Error("vpn connection state is connecting")}
    if (this.isDisconnectionProgress) { throw new Error('vpn connection state is currently disconnecting ')}
    
    this.protocol = protocol
    this.isConnectionProgress = true

    try {

      if(this.protocol === 'V2RAY'){
        res = this.apiInstance.pullServerConf(countryCode, cityCode, serverId)
        v2rayConf = this.apiInstance.extractVpnConf(res)

        await this.v2ray.connect(v2rayConf);
      }
      
      this.isConnected = true
      return true
    } catch (error) {
      this.stop()
      console.error(error)
      return false
    }
  }

  async stop(){
    if(this.isDisconnectionProgress) {console.log('vpn already disconnecting'); return}

    this.isDisconnectionProgress = true
    this.isConnectionProgress = false

    try {
      if(this.protocol === 'V2RAY'){
        await this.v2ray.disconnect();

      }}
      catch (error) {
        console.error(error)
      }
    finally {
      this.isConnected = false
      this.isDisconnectionProgress = false
    }
  }

}

export default VPN;