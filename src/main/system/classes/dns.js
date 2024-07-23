class DNS{
  constructor (){
    if (DNS.instance instanceof DNS) return DNS.instance;
    
    this.list = defaultDNSList;

    this.currentDNSIndex = 0;
  
    DNS.instance = this;
  }

  getDNSList(){
    return this.list;
  }

  getCurrentDNS(){
    return this.list[this.currentDNSIndex];
  }

  getCurrentDNSIndex(){
    return this.currentDNSIndex;
  }

  setCurrentDNSIndex(index){
    if (!index) return this.getCurrentDNS();
    if (index >= this.list.length) {this.currentDNSIndex = this.list.length - 1 ; return this.getCurrentDNS();}
    if (index < 0) {this.currentDNSIndex = 0; return this.getCurrentDNS();}
    this.currentDNSIndex = index;
    return this.getCurrentDNS();
  }

  getDNSByIndex(index){
    return this.list[index];
  }
  
  addDNS(dns){
    this.list.push(dns);
    return {
      index: this.list.length - 1,
      dns: dns
    }
  }

}


let defaultDNSList = [
  {
    id: 0,
    name: 'cloudflare.com',
    ipv4: ['1.1.1.1', '0.0.0.0'],
    ipv6: ['2606:4700:4700::1111', '2606:4700:4700::1001'],
  },
  {
    id: 1,
    name: 'google.com',
    ipv4: ['8.8.8.8', '8.8.4.4'],
    ipv6: ['2001:4860:4860:0:0:0:0:8888', '2001:4860:4860:0:0:0:0:8844']
  },
  {
    id: 2,
    name: 'quad9.net',
    ipv4: ['9.9.9.9', '149.112.112.112'],
    ipv6: ['2620:fe::fe', '2620:fe::9']
  },
  {
    id: 3,
    name: 'control-D',
    ipv4: ['76.76.2.0', '76.76.10.0'],
    ipv6: ['2606:1a40::', '2606:1a40:1::']
  },
  {
    id: 4,
    name: 'adguard-dns',
    ipv4: ['94.140.14.140', '94.140.14.141'],
    ipv6: ['2a10:50c0::1:ff', '2a10:50c0::2:ff']
  },
  {
    id: 5,
    name: 'clean-browsing',
    ipv4: ['185.228.168.168', '185.228.169.168'],
    ipv6: ['2a0d:2a00:1::', '2a0d:2a00:2::']
  },
  {
    id: 6,
    name: 'alternate-dns',
    ipv4: ['76.76.19.19', '76.223.122.150'],
    ipv6: ['2602:fcbc::ad', '2602:fcbc:2::ad']
  },
];

export default DNS;