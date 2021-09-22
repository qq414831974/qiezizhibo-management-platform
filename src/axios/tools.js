/**
 * Created by wufan on 2018/10/22.
 * http通用工具函数
 */
import axios from 'axios';
import {message} from 'antd';
import {getToken, setToken, removeToken} from "../utils/tools";
import * as config from "./config";

axios.defaults.withCredentials = true
axios.defaults.retry = 0;
axios.interceptors.response.use(undefined, (err) => {
    if (err && err.response == null) {
        console.log(err.code);
        message.error("未能连接到服务器，请重新登陆");
        return Promise.reject(err);
    }
    const {refreshToken} = getToken();
    const {data, status} = err.response;
    var config = err.config;
    // 设置重置次数，默认为0
    config.params = config.params || {};
    if (config.params.retry == null) {
        config.params.retry = 0;
    }
    // 判断是否超过了重试次数
    if (config.params.retry >= 1) {
        return Promise.reject(err);
    }

    //重试次数自增
    config.params.retry += 1;
    // //延时处理
    // var backoff = new Promise(function (resolve) {
    //     setTimeout(function () {
    //         resolve();
    //     }, 1);
    // });

    if (status != 200 || data.code != 200) {
        if ((status == 401 || data.code == 401) && refreshToken) {
            return refreshTokenFuc(refreshToken).then(res => {
                //重新发起axios请求
                // return backoff.then(() => {
                // return requestFunc({
                //                 //     url: config.url,
                //                 //     data: {retry: config.data.retry, ...config.data} || null,
                //                 // });
                return axios(config);
                // });
            });
        } else if(status == 401 || data.code == 401){
            message.error("登录失效，请重新登录");
            toLogin();
        }else if(status == 403 || data.code == 403){
            message.error("没有相关权限");
        }else{
            message.error(data.message);
        }
    }

}, function (error) {
    // 对响应错误做处理
    return Promise.reject(error);
});
/**
 * 公用get请求
 * @param url       接口地址
 * @param headers   接口所需header配置
 */
export const get = ({url, headers}) => {
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.get(url, {headers: header}).then(res => {
        return res;
    });
}
/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param headers   接口所需header配置
 */
export const post = ({url, data, headers}) => {
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.post(url, data, {headers: header}).then(res => {
        return res;
    });
}
/**
 * 公用put请求
 * @param url       接口地址
 * @param data      接口参数
 * @param headers   接口所需header配置
 */
export const put = ({url, data, headers}) => {
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.put(url, data, {headers: header}).then(res => {
        return res;
    });
}
/**
 * 公用delete请求
 * @param url       接口地址
 * @param headers   接口所需header配置
 */
export const del = ({url, headers}) => {
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.delete(url, {headers: header}).then(res => {
        return res;
    });
}

export const unpack = (params) => {
    if (params == null) return '';
    let paramStr = '';
    for (let param in params) {
        if (params[param] != null) {
            paramStr += `${param}=${params[param]}&`;
        }
    }
    paramStr = paramStr.substring(0, paramStr.length - 1);
    return paramStr;
}
const needToken = (url) => {
    if (url === `${config.auth_service}/auth` || url.includes(`${config.auth_service}/auth/refresh_token`)) {
        return false;
    } else {
        return true;
    }
}
const toLogin = () => {
    message.warn("登陆状态过期，请重新登陆");
    window.location.href = '/manage/login';
    removeToken();
}
const refreshTokenFuc = (refreshToken) => {
    return post({url: `${config.auth_service}/auth/refresh_token?refresh_token=${refreshToken}`, data: null})
        .then(res => {
            if (res.data && res.data.code == 200) {
                setToken(res.data.data);
            } else {
                toLogin();
            }
            return res
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                message.error(error.response.data.msg);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}