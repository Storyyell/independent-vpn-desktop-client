// import { exec as execCb } from 'child_process';
// import { promisify } from 'util';
// const exec = promisify(execCb);
import os from 'os';
import ip from 'ip'
import { Console } from 'console';
import dns from "dns";
import net from "net";
import https from 'https';
import { SocksClient } from 'socks';

class Network{
  constructor (){
    if (Network.instance){
      return VPNCore.instance
    }


    this.GatewayIp = null
    this.GatewayAdapterName = null
    this.GatewayIps = null

    this.platform = process.platform

    Network.instance = this
  }

  async getGatewayAdapterIp(){
    try {
      const { gateway4sync } = await import("default-gateway");
      const { gateway: gatewayIp } = gateway4sync();
      this.GatewayIp = gatewayIp
      return gatewayIp;
    } catch (error) {
      console.error("error getting gateway adapter ip");
      throw error
    }
  }

  async getGatewayInterfaceName(){
    if(!this.GatewayIp){await this.getGatewayAdapterIp()}
    try {
      const networkInterfaces = os.networkInterfaces();
      for (const interfaceName in networkInterfaces) {
          const networkInterface = networkInterfaces[interfaceName];
          for (const alias of networkInterface) {
              if (alias.family === 'IPv4' && !alias.internal) {
                  // Check if the gateway IP is in the same subnet as the current alias
                  const subnet = ip.subnet(alias.address, alias.netmask);
                  if (subnet.contains(this.GatewayIp)) {
                      this.GatewayAdapterName = interfaceName
                      return interfaceName;
                  }
              }
          }
      }
  
    } catch (error) {
      console.error(`No interface found containing the gateway IP ${this.GatewayIp}`);
      throw error
    }

  }

  async getGatewayAdapterIps() {
    if (!this.GatewayAdapterName) { await this.getGatewayInterfaceName() }
    const adapter = this.GatewayAdapterName
    try {
      const interfaces = os.networkInterfaces();
      const ips = { ipv4: [], ipv6: [] };

      if (interfaces[adapter]) {
        for (const iface of interfaces[adapter]) {
          if ('IPv4' === iface.family) {
            ips.ipv4.push(iface.address);
          } else if ('IPv6' === iface.family) {
            ips.ipv6.push(iface.address);
          }
        }
      }

      this.GatewayIps = {
        ...ips, //{ipv4, ipv6}
        ipv4Support: ips.ipv4.length > 0, // bool
        ipv6Support: ips.ipv6.length > 0  //bool
      }
      return this.GatewayIps;

    } catch (error) {
      Console.error('error getting gateway adapter ips')
      throw error
    }
  }


async getIPv4FromDomain(domain) {
  try {
    if (net.isIPv4(domain)) {
      return domain;
    } else {
      return new Promise((resolve, reject) => {
        dns.resolve4(domain, (err, addresses) => {
          if (err) {
            reject('Failed to resolve domain to ipv4');
          } else {
            resolve(addresses[0]);
          }
        });
      });
    }
  } catch (error) {
    throw new Error(error);
  }
}


  async checkSocksInternetConnectivity(proxyIp, proxyPort) {
    try {
      const options = {
        hostname: 'www.google.com',
        port: 443,
        path: '/',
        method: 'GET',
        timeout: 3000 // 3 seconds timeout
      };

      // Create a socks agent
      const agent = await SocksClient.createConnection({
        proxy: {
          ipaddress: proxyIp,
          port: proxyPort,
          type: 5 // For SOCKS5
        },
        command: 'connect',
        destination: {
          host: options.hostname,
          port: options.port
        }
      });

      options.agent = new https.Agent({ socket: agent.socket });

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(true);
          });
        });

        req.on('error', (e) => {
          console.error(`Request error: ${e.message}`);
          reject(new Error('Internet connectivity check failed due to request error.'));
        });

        req.on('timeout', () => {
          req.end();
          console.error('Request timeout after 3 seconds.');
          reject(new Error('Internet connectivity check failed due to timeout.'));
        });

        req.end();
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw new Error(`Internet connectivity check failed: ${error.message}`);
    }
  }


  
}

export default Network