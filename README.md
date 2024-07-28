[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# independent_vpn_app

## Project Setup
### Install

```bash
$ yarn install
```

### Development

```bash
$ yarn run dev
```

### Build

```bash
# For windows
$ yarn run build:win

# for macOS and Linux vpn routing rule want to be upated

# For macOS
$ yarn run build:mac

# For Linux
$ yarn run build:linux
```


## .env file 
```
VITE_SERVER_APP_KEY=<sentinel app key>
VITE_SERVER_API_URL=<sentinel api url>
VITE_MAPBOX_KEY=<mappbox api key>
VITE_IP_API_KEY=<pro-ipapi key>
```

Xray core version : v1.8.21
tun2Socks version : v2.5.2