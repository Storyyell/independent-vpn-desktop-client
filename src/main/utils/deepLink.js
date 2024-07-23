import Config from "../Config/Config";
import { app} from 'electron'
const path = require('node:path')

const appConfig = new Config();

function registerDeepLink() {

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(appConfig.appProtocolTag, process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient(appConfig.appProtocolTag)
  }
}

const handleDeepLink = (url) => {
  if (!url.startsWith(`${appConfig.appProtocolTag}://`)) return
  if (url.endsWith('/')) url = url.slice(0, -1)

}

export { registerDeepLink, handleDeepLink }