import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ?
        //'':'http://192.168.0.100:4000',
        '':'http://119.30.150.230:4000',
    // timeout: 3000
})

axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    return config;
}, function(error) {
    return Promise.reject(error);
})

// //토큰 만료시간이 지나면 리로드 
// axiosInstance.interceptors.response.use(function (response) {
//     return response;

// }, function(error) {
//     if(error.response.data === 'jwt expired') {
//         window.location.reload();
//     }
//     return Promise.reject(error);
// })

export default axiosInstance;