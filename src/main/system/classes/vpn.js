
class VPN{

  constructor () {
    if (VPN.instance instanceof VPN) {
      return VPN.instance;
    }

    this.protocol = 'V2RAY'; // V2RAY, WIREGUARD
    this.platfrom = process.platform;
    this.v2ray = new V2RAY();

    this.isConnected = false
    this.isDisconnectionProgress = false
    this.isConnectionProgress = false

    VPN.instance = this;

  }

  async start(){
    if(this.protocol === 'V2RAY'){
      if (this.isConnected){throw new Error ('vpn already connected')}
      if (this.isConnectionProgress) { throw new Error("vpn connection state is connecting")}
      if (this.isDisconnectionProgress) { throw new Error('vpn connection state is currently disconnecting ')}

      this.isConnectionProgress 
      await this.v2ray.connect();
    }
  }



}