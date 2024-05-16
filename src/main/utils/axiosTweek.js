import axios from 'axios';


if(process.env.NODE_ENV === 'production'){

  axios.interceptors.response.use(undefined, function (error) {
    // Modify the error before it's thrown, omitting the headers and other verbose data
    const customError = {
      message: error.message,
      status: error.response ? error.response.status : null,
      data: error.response ? error.response.data : null,
    };
  
    // Return a Promise rejecting with the simplified error object
    return Promise.reject(customError);
  });

  
}

axios.defaults.timeout = 30000; // 30 seconds
