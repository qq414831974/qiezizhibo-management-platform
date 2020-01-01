/**
 * Created by wufan on 2018/12/26.
 */
import {get, post, put, del, unpack} from './tools';

export const loginout = () => get({url: 'https://www.qiezizhibo-api.com/api/logout'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllPlayers = (params) => post({url: 'https://www.qiezizhibo-api.com/api/getAllPlayers', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getPlayerById = (id) => get({url: 'https://www.qiezizhibo-api.com/api/player/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getPlayersByTeamId = (id, params) => post({
    url: 'https://www.qiezizhibo-api.com/api/getPlayersByTeamId/' + id,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllMatchs = (params) => post({url: 'https://www.qiezizhibo-api.com/api/getAllMatchs', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getMatchById = (id) => get({url: 'https://www.qiezizhibo-api.com/api/match/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getMatchPlayersByTeamId = (matchid, teamid) => get({url: 'https://www.qiezizhibo-api.com/api/getMatchPlayersByTeamId?matchid=' + matchid + '&teamid=' + teamid})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getTimelineByMatchId = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/getTimelineByMatchId',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTimeline = (params) => put({url: 'https://www.qiezizhibo-api.com/api/timeline', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTimeline = (params) => post({url: 'https://www.qiezizhibo-api.com/api/timeline', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineById = (id) => del({url: 'https://www.qiezizhibo-api.com/api/timeline/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineByIds = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/deleteTimeline',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineByMatchId = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/deleteTimelineByMatchId',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePassAndPossession = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/passAndPossession',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPassAndPossession = (matchid, teamid) => get({url: 'https://www.qiezizhibo-api.com/api/passAndPossession?matchid=' + matchid + (teamid ? ('&teamid=' + teamid) : '')})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchTime = (matchid) => get({url: 'https://www.qiezizhibo-api.com/api/getMatchTime/' + matchid})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchs = (params) => get({url: `https://www.qiezizhibo-api.com/api/matchs?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchStatus = (params) => get({url: `https://www.qiezizhibo-api.com/api/matchStatus?matchid=${params}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchScoreStatusById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/match/score', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const search = (params) => get({url: `https://www.qiezizhibo-api.com/api/search?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });