import React from 'react'

const Servers = (props) => {

    const [serverList, setServerList] = React.useState([])
    console.log(serverList);
    React.useEffect(() => {
        if (props.selectedCountryId != '' && props.selectedCityId != '' && localStorage.getItem("device_token")) {
            window.api.getServers(localStorage.getItem("device_token"), props.selectedCountryId, props.selectedCityId)
                .then((res) => {
                    // console.log(res.data);
                    setServerList(res.data)
                    sessionStorage.setItem("server_list", res.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [props.selectedCityId])


  return (
    <></>
  )
}

export default Servers