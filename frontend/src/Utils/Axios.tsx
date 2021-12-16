import axios from 'axios';

axios.defaults.withCredentials = true

const instance = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
})
instance.defaults.withCredentials = true
instance.interceptors.response.use(
    (response) => {return response}, 
    async (error) => {
        const originalConfig = error.config;
        if (originalConfig.url !== "/token/auth" && error.response) {
          // Access Token was expired
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
                await axios.post("/token/refresh") //Use axios instead of instance to prevent infinite loop
                return instance(originalConfig)
            } catch (_error) {
              return Promise.reject(_error);
            }
          }
        }
        return Promise.reject(error);
    }
)

export default instance;