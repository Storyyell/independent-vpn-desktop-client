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
];

export default DNS;