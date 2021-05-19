import axios from 'axios'
// create an axios instance
const service = axios.create({
  baseURL: `/api`, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    /* if (res.status !== 0) {
      Toast.failed(res.msg, 3000)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    } */
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
