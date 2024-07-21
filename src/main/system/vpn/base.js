import os from 'os';



class VPNCore {
  constructor (){
    if (VPNCore.instance instanceof VPNCore){
      return VPNCore.instance
    }

    this.isConnected = false
    this.V2RAYProcess = null
    this.TUN2SOCKSProcess = null
    this.isAdapterIpAssigned = false
    this.isAdapterDNSServerAssigned = false
    this.isAdapterSubsetAssigned = false
    this.isGlobalTrafficRouteRuleMapped = false
    this.GatewayIp = null
    this.GatewayAdapterName = null
    this.GatewayIps = null

    this.isDisconnectionProgress = false
    this.isConnectionProgress = false

    this.protocol = 'V2RAY' // V2RAY, WIREGUARD
    this.platform = process.platform
    this.serverIp = null
    this.serverDomain = null
    this.serverPort = null
    this.serverUUID = null // 4 V2RAY
    this.selectedDNSObjIndex
    
  }

  async triggerConnection(){
    if(this.protocol == 'V2RAY'){ return await this.connectV2RAY()}
    if (this.protocol == 'WIREGUARD'){return await this.connectWireGuard()}
  }

  async triggerDisconnection(){
    if (this.protocol == 'V2RAY'){return await this.disconnectV2RAY()}
    if (this.protocol == 'WIREGUARD'){return await this.disconnectWireGuard()}
  }

  async connectV2RAY(){
    if (this.isConnected){return}
    if (this.isConnectionProgress){return}
    if (this.isDisconnectionProgress){return}

    this.isConnectionProgress = true
    try {
      this.GatewayIp = await this.getGatewayAdapterIp()
      this.GatewayAdapterName = await this.getGatewayAdapterName()
      this.GatewayIps = await this.getGatewayIps()

    } catch (error) {
      await this.disconnectV2RAY()
      throw error
    }
  }


  async getGatewayAdapterIp(){
    try {
      const { gateway4sync } = await import("default-gateway");
      const { gateway: gatewayIp } = gateway4sync();
      return gatewayIp;
  } catch (error) {
    throw error
  }
  }

  async getGatewayAdapterName(){
    if(!this.GatewayIp){throw new Error('Gateway IP is not set')}

    // Get the list of network interfaces
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName];

        for (const alias of networkInterface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                // Check if the gateway IP is in the same subnet as the current alias
                const subnet = ip.subnet(alias.address, alias.netmask);
                if (subnet.contains(this.GatewayIp)) {
                    return interfaceName;
                }
            }
        }
    }

    throw new Error(`No interface found containing the gateway IP ${gatewayIP}`);
}

  async getGatewayIps(){
    if(!this.GatewayAdapterName){
      throw new Error('')
    }
  }


}