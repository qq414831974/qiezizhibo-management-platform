/**
 * Created by wufan on 2018/12/26.
 */
import axios from 'axios';
import {get, post, put, del, unpack} from './tools';
import * as config from './config';
import {getNowDate, getPastMonthDate} from '../utils';

export const getPlayersByTeamId = (id, params) => get({
    url: `${config.football_service}/football/player?${unpack({teamId: id, ...params})}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllMatchs = (params) => get({url: `${config.football_service}/football/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getMatchById = (id) => get({url: `${config.football_service}/football/match/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchScoreStatusById = (params) => put({url: `${config.football_service}/football/match/score`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getMatchPlayersByTeamId = (matchid, teamid) => get({
    url: `${config.football_service}/football/player?${unpack({
        teamId: teamid,
        matchId: matchid,
        pageSize: 100,
        pageNum: 1,
    })}`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTimelineByMatchId = (params) => get({
    url: `${config.football_service}/football/timeline?${unpack(params)}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTimeline = (params) => put({url: `${config.football_service}/football/timeline`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTimeline = (params) => post({url: `${config.football_service}/football/timeline`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineByIds = (params) => del({
    url: `${config.football_service}/football/timeline?${unpack(params)}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePassAndPossession = (params) => post({
    url: `${config.football_service}/football/timeline/passAndPossession`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPassAndPossession = (matchid, teamid) => get({
    url: `${config.football_service}/football/timeline/passAndPossession?${unpack({
        matchId: matchid,
        teamId: teamid
    })}`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchTime = (matchid) => get({url: `${config.football_service}/football/timeline/status?${unpack({matchId: matchid})}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//47.92.82. 5
//129.204.161. 196
//www.qiezizhibo. com