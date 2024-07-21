const dataValidityPeroid = 10 * 60 * 1000 // 10 minutes

async function getServerList(deviceToken, serverList, setServerList, protocol, countryId, cityId) {
  const sl = readServerList(serverList, protocol, countryId, cityId);
  if (sl.length === 0) {
    const data = await fetchServerList(deviceToken, countryId, cityId);
    putServerList(data, countryId, cityId, setServerList);
    return filterServerList(data, protocol);
  }
  return filterServerList(sl, protocol);
}

function readServerList(serverList, protocol, countryId, cityId) {
  const sl = serverList[`${countryId}_${cityId}`];
  if (sl) {
    const now = new Date();
    if ((now - sl.timeStamp) > dataValidityPeroid) {
      return [];
    } else {
      return filterServerList(sl.data, protocol);
    }
  }
  return [];
}

function putServerList(serverList, countryId, cityId, setServerList) {
  setServerList((sl) => {
    return {
      ...sl,
      [`${countryId}_${cityId}`]: {
        timeStamp: new Date(),
        data: serverList
      }
    }
  });
}

async function fetchServerList(device_token, countryCode, cityCode) {
  try {
    const { data } = await window.api.getServers(device_token, countryCode, cityCode);
    return data || [];
  } catch (error) {
    return [];
  }
}

function filterServerList(serverList, protocol) {
  if (protocol === null) {
    return serverList;
  }
  return serverList.filter((server) => server.protocol === protocol);
}


export {
  getServerList,
  readServerList,
  putServerList,
  fetchServerList,
  filterServerList
}