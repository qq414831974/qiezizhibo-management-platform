/**
 * Created by wufan on 2018/10/22.
 * http通用工具函数
 */
import axios from 'axios';
import {message} from 'antd';
import {getToken, setToken, removeToken} from "../utils/tools";
import * as config from "./config";

axios.defaults.withCredentials = true
/**
 * 公用get请求
 * @param url       接口地址
 * @param headers   接口所需header配置
 */
export const get = ({url, headers}, retry = 0) => {
    if (retry > config.maxRetry) {
        message.error("请求失败，重试超过上限");
        return;
    }
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.get(url, {headers: header}).then(res => {
        return res;
    }).catch(error => {
        if (error.response) {
            console.log(error.response.data);
            message.error(error.response.data.message);
            if (error.response.status == 401 && refreshToken) {
                refreshTokenFuc(refreshToken).then(res => {
                    return get({url, headers}, retry + 1);
                });
            }
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
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
        // toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.post(url, data, {headers: header}).then(res => {
        return res;
    }).catch(error => {
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
/**
 * 公用put请求
 * @param url       接口地址
 * @param data      接口参数
 * @param headers   接口所需header配置
 */
export const put = ({url, data, headers}) => {
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        // toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.put(url, data, {headers: header}).then(res => {
        return res;
    }).catch(error => {
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
/**
 * 公用delete请求
 * @param url       接口地址
 * @param headers   接口所需header配置
 */
export const del = ({url, headers}) => {
    const {accessToken, refreshToken} = getToken();
    if (accessToken == null && needToken(url)) {
        // toLogin();
        return;
    }
    const header = needToken(url) && accessToken ? {Authorization: `Bearer ${accessToken}`, ...headers} : null;
    return axios.delete(url, {headers: header}).then(res => {
        return res;
    }).catch(error => {
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
    if (url === `${config.auth_service}/auth`) {
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