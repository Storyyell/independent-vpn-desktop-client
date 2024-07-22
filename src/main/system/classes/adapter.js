import { stat } from "fs";
import Config from "../../Config/Config";
import DNS from "./dns";
const exec = util.promisify(require('child_process').exec);

class AdapterUils {
  constructor(){
    this.appConfig = new Config()
    this.dns = new DNS()

  }

  async assignStaticIp(){
    const adapterName = this.appConfig.adapterName
    const staticIPv4 = "192.168.123.1"
    const staticIPv6 = "fd12:3456:789a:1::1/64"
    const staticIPv4Mask = "255.255.255.0"

    await exec(`netsh interface ipv4 set address name="${adapterName}" source=static addr=${staticIPv4} mask=${staticIPv4Mask}`);
    await exec(`netsh interface ipv6 set address interface="${adapterName}" address=${staticIPv6} store=persistent`)

  }

  async removeStaticIp(){
    const adapterName = this.appConfig.adapterName
    await exec(`netsh interface ipv4 set address name="${adapterName}" source=dhcp`);
    await exec(`netsh interface ipv6 set address name="${adapterName}" source=dhcp`)
  }

  async assignDns(defaultInterface = null){
    const adapterName = this.appConfig.adapterName
    const dns = this.dns.getCurrentDNS()


    await exec(`netsh interface ipv4 set dnsservers name="${adapterName}" static address=${dns.ipv4[0]} register=none validate=no`);
    await exec(`netsh interface ipv4 add dnsservers name="${adapterName}" address=${dns.ipv4[1]} index=2 validate=no`);

    await exec(`netsh interface ipv6 set dnsservers name="${adapterName}" static address=${dns.ipv6[0]} register=none validate=no`);
    await exec(`netsh interface ipv6 add dnsservers name="${adapterName}" address=${dns.ipv6[1]} index=2 validate=no`);

    if (defaultInterface) {
      await exec(`netsh interface ipv4 set dnsservers name="${defaultInterface}" static address=${dns.ipv4[0]} register=none validate=no`);
      await exec(`netsh interface ipv4 add dnsservers name="${defaultInterface}" address=${dns.ipv4[1]} index=2 validate=no`);
      await exec(`netsh interface ipv6 set dnsservers name="${defaultInterface}" static address=${dns.ipv6[0]} register=none validate=no`);
      await exec(`netsh interface ipv6 add dnsservers name="${defaultInterface}" address=${dns.ipv6[1]} index=2 validate=no`);
    }

    await exec('ipconfig /flushdns');
  }

  async removeDns(defaultInterface = null){
    if (defaultInterface) {
      await exec(`netsh interface ipv4 set dnsservers name="${defaultInterface}" source=dhcp`);
      await exec(`netsh interface ipv6 set dnsservers name="${defaultInterface}" source=dhcp`);
    }
    
    const adapterName = this.appConfig.adapterName
    await exec(`netsh interface ipv4 set dnsservers name="${adapterName}" source=dhcp`);
    await exec(`netsh interface ipv6 set dnsservers name="${adapterName}" source=dhcp`);
    

    await exec('ipconfig /flushdns');
  }

  async assignGlobalTrafficRouteRule(){
    const adapterName = this.appConfig.adapterName
    const staticIPv4 = "192.168.123.1"
    const staticIPv6 = "fd12:3456:789a:1::1/64"

    await exec(`netsh interface ipv4 add route 0.0.0.0/0 "${adapterName}" ${staticIPv4} metric=1`);
    await exec(`netsh interface ipv6 add route ::/0 "${adapterName}" ${staticIPv6} metric=1`);
  }

  async removeGlobalTrafficRouteRule(){
    const adapterName = this.appConfig.adapterName
    const staticIPv4 = "192.168.123.1"
    const staticIPv6 = "fd12:3456:789a:1::1/64"

    await exec(`netsh interface ipv4 delete route 0.0.0.0/0 "${adapterName}" ${staticIPv4}`);
    await exec(`netsh interface ipv6 delete route ::/0 "${adapterName}" ${staticIPv6}`);
  }

  async vpnTrafficRouteRule(serverIp, gatewayIp){
    if (!serverIp || !gatewayIp) { throw new Error('serverIp and gatewayIp are required'); }  
    await exec(`route add ${serverIp} mask 255.255.255.255 ${gatewayIp}`);
    }

  async removeVpnTrafficRouteRule(serverIp){
    if (!serverIp) { throw new Error('serverIp is required'); }
    await exec(`route delete ${serverIp}`);
  }

}