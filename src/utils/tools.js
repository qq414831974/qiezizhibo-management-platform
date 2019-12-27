import moment from "moment/moment";
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export const flashChecker = () => {
    var hasFlash = 0;　　　　 //是否安装了flash
    var flashVersion = 0;　　 //flash版本

    if (document.all) {
        return null;
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                hasFlash = 1;
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
            }
        }
    }
    return {f: hasFlash, v: flashVersion};
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