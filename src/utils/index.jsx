import moment from 'moment'
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

export const mergeJSON = (minor, main) => {
    for (var key in minor) {
        main[key] = minor[key];
    }
    return main;
};

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
export const parseTimeStringYMD = (timeStr) => {
    const format = (str) => {
        return str > 9 ? str : '0' + str;
    }
    const datetime = new Date(timeStr);
    const year = datetime.getFullYear();
    const mon = format(datetime.getMonth() + 1);
    const day = format(datetime.getDate());
    const dateStr = year + '-' + mon + '-' + day;
    return dateStr;
}
export const getYearOld = (timeStr) => {
    const format = (str) => {
        return str > 9 ? str : '0' + str;
    }
    const datetime = new Date(timeStr);
    const year = datetime.getFullYear();
    const Y = new Date().getFullYear();
    const yearOld = Y - year;
    return yearOld;
}
export const parseTimeStringWithOutYear = (timeStr) => {
    const format = (str) => {
        return str > 9 ? str : '0' + str;
    }
    const datetime = new Date(timeStr);
    const year = datetime.getFullYear();
    const mon = format(datetime.getMonth() + 1);
    const day = format(datetime.getDate());
    const hour = format(datetime.getHours());
    const min = format(datetime.getMinutes());
    const dateStr = mon + '-' + day + ' ' + hour + ':' + min;
    return dateStr;
}

export const trim = (str) => {
    return str.replace(/\s|\xA0/g, "");
}

export const mergerJson = (json, otherJson) => {
    const result = {};
    for (var ele in json) {
        if (otherJson[ele]) {
            if (json[ele] != otherJson[ele]) {
                //moment类型 [_i] 是时间stirng
                if (json[ele]["_i"]) {
                    if (json[ele]["_i"] != otherJson[ele]) {
                        result[ele] = json[ele];
                    }
                } else {
                    result[ele] = json[ele];
                }
            }
        }
    }
    return result;
}
export const getQueryString = (string, name) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = string.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
export const isTheSameDay = (time1, time2) => {
    return moment(time1).isSame(time2, 'day');
}

export const toChinesNum = (number) => {
    const units = '个十百千万@#%亿^&~';
    const chars = '零一二三四五六七八九';
    var a = (number + '').split(''), s = [];
    if (a.length > 12) {
        throw new Error('too big');
    } else {
        for (var i = 0, j = a.length - 1; i <= j; i++) {
            if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*
                if (i == 0) {
                    if (a[i] != '1') s.push(chars.charAt(a[i]));
                } else {
                    s.push(chars.charAt(a[i]));
                }
            } else {
                s.push(chars.charAt(a[i]));
            }
            if (i != j) {
                s.push(units.charAt(j - i));
            }
        }
    }
    //return s;
    return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等
        b = units.indexOf(d);
        if (b != -1) {
            if (d == '亿') return d;
            if (d == '万') return d;
            if (a[j - b] == '0') return '零'
        }
        return '';
    }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
        return b;
    }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
        return {'@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千'}[m];
    }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
        c = units.indexOf(d);
        if (c != -1) {
            if (a[j - c] == '0') return d + '零' + b
        }
        return m;
    });
}


/**
 * 产生随机整数，包含下限值，但不包括上限值
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */
export const randomNum = (lower, upper) => {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

export const getRound = (num,prefix)=>{
    let rank = []
    for (let i = 1; i <= num; i++) {
        rank.push(prefix + "第" + toChinesNum(i) + "轮");
    }
    return rank;
}
export const getJueSaiRankRound = (num) =>{
    let rank = []
    for (let i = 1; i <= num; i++) {
        if (i == 1) {
            rank.push("决赛");
        } else {
            rank.push(toChinesNum(i * 2 - 1) + "、" + toChinesNum(i * 2) + "名决赛");
        }
    }
    return rank.reverse();
}