import axios from 'axios'
// create an axios instance
const service = axios.create({
  baseURL: `/api`, // url = base url + request url
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.status !== 200) {
      return Promise.reject(new Error(res.msg))
    }
    return res.data
  },
  (error) => Promise.reject(error)
)

export default service
