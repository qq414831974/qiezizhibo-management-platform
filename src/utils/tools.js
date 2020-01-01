import moment from "moment/moment";
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export const getUser = () => {
    const user = localStorage.getItem('user')
    if (user == null) {
        return null;
    }
    return JSON.parse(user);
}

export const setUser = (user) => {
    if (user == null) {
        return;
    }
    localStorage.setItem('user', JSON.stringify(user));
}
export const removeUser = () => {
    localStorage.removeItem('user');
}
export const getToken = () => {
    const tokenStr = localStorage.getItem('token')
    if (tokenStr == null) {
        return null;
    }
    const tokenAndTime = JSON.parse(tokenStr);
    const token = tokenAndTime.token;
    const time = tokenAndTime.time;
    if (moment().subtract(1, "days").isAfter(moment(time))) {
        return -1;
    }
    return token;
}
export const setToken = (token) => {
    if (token == null) {
        return
    }
    localStorage.setItem('token', JSON.stringify({token: token, time: moment()}));
}
export const removeToken = () => {
    localStorage.removeItem('token');
}
export const parseTimeString = (timeStr) => {
    const format = (str) => {
        return str > 9 ? str : '0' + str;
    }
    const datetime = new Date(timeStr);
    const year = datetime.getFullYear();
    const mon = format(datetime.getMonth() + 1);
    const day = format(datetime.getDate());
    const hour = format(datetime.getHours());
    const min = format(datetime.getMinutes());
    const dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min;
    return dateStr;
}
export const parseTimeStringWithOutYear = (timeStr) => {
    const format = (str) => {
        return str > 9 ? str : '0' + str;
    }
    const datetime = new Date(timeStr);
    const mon = format(datetime.getMonth() + 1);
    const day = format(datetime.getDate());
    const hour = format(datetime.getHours());
    const min = format(datetime.getMinutes());
    const dateStr = mon + '-' + day + ' ' + hour + ':' + min;
    return dateStr;
}
export const mergeJSON = (minor, main) => {
    for (var key in minor) {
        main[key] = minor[key];
    }
    return main;
};