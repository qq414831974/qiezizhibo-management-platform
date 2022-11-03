/**
 * Created by wufan on 2018/12/26.
 */
import axios from 'axios';
import {get, post, put, del, unpack} from './tools';
import * as config from './config';
import {getNowDate, getPastMonthDate} from '../utils';

export const npmDependencies = () => get('./npm.json').then(res => res.data).catch(err => console.log(err));

export const uploadimg = `${config.system_service}/sys/file/upload/image?avatar=true`;

export const uploadposter = `${config.system_service}/sys/file/upload/image?poster=true`;

export const uploadmedia = `${config.system_service}/sys/file/upload/media`;

export const upload = `${config.system_service}/sys/file/upload/image`;

export const uploaddocx_team = `${config.system_service}/sys/file/import/team?wechatType=0`;

export const uploaddocx_match = `${config.system_service}/sys/file/import/match`;

export const login = (params) => post({url: `${config.auth_service}/auth`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCurrentAdminUserInfo = () => get({url: `${config.user_service}/admin/user/info`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllAdminUser = (params) => get({url: `${config.user_service}/admin/user?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createAdminUser = (params) => post({url: `${config.user_service}/admin/user`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delAdminUserByIds = (params) => del({url: `${config.user_service}/admin/user?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateAdminUserById = (params) => put({url: `${config.user_service}/admin/user`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateAdminUserPassword = (params) => post({
    url: `${config.user_service}/admin/user/password/update`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const resetAdminUserPassword = (params) => post({
    url: `${config.user_service}/admin/user/password/reset`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllRoles = (params) => get({url: `${config.user_service}/admin/role?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPermissionList = (params) => get({url: `${config.user_service}/admin/permission?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createPermission = (params) => post({url: `${config.user_service}/admin/permission`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePermissionById = (params) => put({url: `${config.user_service}/admin/permission`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delPermissionByIds = (params) => del({url: `${config.user_service}/admin/permission?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createRole = (params) => post({url: `${config.user_service}/admin/role`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const updateRoleById = (params) => put({url: `${config.user_service}/admin/role`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delRoleByIds = (params) => del({url: `${config.user_service}/admin/role?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllUser = (params) => get({url: `${config.user_service}/user?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getUserByUserNo = (params) => get({url: `${config.user_service}/user/${params.userNo}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delUserByIds = (params) => del({url: `${config.user_service}/user?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateUserById = (params) => put({url: `${config.user_service}/user`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllDefaultUser = () => get({url: `${config.user_service}/user/default`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createDefaultUser = (params) => post({url: `${config.user_service}/user/default`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getUserAddress = (params) => get({url: `${config.user_service}/user/address?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createUserAddress = (params) => post({url: `${config.user_service}/user/address`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateUserAddress = (params) => put({url: `${config.user_service}/user/address`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delUserAddress = (params) => del({url: `${config.user_service}/user/address?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getUserAbility = (params) => get({url: `${config.user_service}/user/ability?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createUserAbility = (params) => post({url: `${config.user_service}/user/ability`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateUserAbility = (params) => put({url: `${config.user_service}/user/ability`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delUserAbility = (params) => del({url: `${config.user_service}/user/ability?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getUserExp = (params) => get({url: `${config.user_service}/user/exp?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const addUserExp = (params) => post({url: `${config.user_service}/user/exp`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getVisit = () => get({url: `${config.user_service}/user/visit`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllSysLog = (params) => get({url: `${config.system_service}/sys/log?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllSysFeedback = (params) => get({url: `${config.system_service}/sys/feedback/query?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getFeedbackById = (params) => get({url: `${config.system_service}/sys/feedback?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAreasList = () => get({url: `${config.system_service}/sys/area`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createArea = (params) => post({url: `${config.system_service}/sys/area`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delAreaById = (params) => del({url: `${config.system_service}/sys/area?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBanner = (params) => get({url: `${config.system_service}/sys/banner`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addBanner = (params) => post({url: `${config.system_service}/sys/banner`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateBanner = (params) => put({url: `${config.system_service}/sys/banner`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delBannerById = (params) => del({url: `${config.system_service}/sys/banner?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBulletin = () => get({url: `${config.system_service}/sys/bulletin`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setBulletin = (params) => post({url: `${config.system_service}/sys/bulletin`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateBulletin = (params) => put({url: `${config.system_service}/sys/bulletin`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delBulletinById = (params) => del({url: `${config.system_service}/sys/bulletin?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getScoreboard = () => get({url: `${config.system_service}/sys/scoreboard`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setScoreboard = (params) => post({url: `${config.system_service}/sys/scoreboard`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateScoreboard = (params) => put({url: `${config.system_service}/sys/scoreboard`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delScoreboardById = (params) => del({url: `${config.system_service}/sys/scoreboard?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getShareSentenceList = () => get({url: `${config.system_service}/sys/share/sentence`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createShareSentence = (params) => post({
    url: `${config.system_service}/sys/share/sentence`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateShareSentence = (params) => put({
    url: `${config.system_service}/sys/share/sentence`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delShareSentenceById = (params) => del({url: `${config.system_service}/sys/share/sentence?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getExp = () => get({url: `${config.system_service}/sys/exp`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addExp = (param) => post({url: `${config.system_service}/sys/exp`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateExp = (param) => put({url: `${config.system_service}/sys/exp`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteExp = (param) => del({url: `${config.system_service}/sys/exp?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//player
export const getAllPlayers = (params) => get({url: `${config.football_service}/football/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllPlayersNotInTeam = (params, teamId) => get({
    url: `${config.football_service}/football/player?${unpack({
        teamId: teamId,
        notInTeam: true, ...params,
        wechatType: 0,
    })}`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createPlayer = (params) => post({url: `${config.football_service}/football/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerById = (id) => get({url: `${config.football_service}/football/player/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updatePlayerById = (params) => put({url: `${config.football_service}/football/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delPlayerByIds = (params) => del({url: `${config.football_service}/football/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getPlayersByTeamId = (id, params) => get({url: `${config.football_service}/football/player?${unpack({teamId: id, ...params})}`,})
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
}).then(function (response) {
    return response.data;
}).catch(function (error) {
    console.log(error)
});
export const createActivity = (params) => post({url: `${config.live_service}/activity`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityInfo = (id) => get({url: `${config.live_service}/activity/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delLiveByIds = (params) => del({url: `${config.live_service}/activity?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getActivityInfoList = (params) => get({url: `${config.live_service}/activity?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityInfo = (params) => put({url: `${config.live_service}/activity`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityStautsInfo = (id) => get({url: `${config.live_service}/activity/${id}/status`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityIngest = (id) => get({url: `${config.live_service}/activity/${id}/ingest`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const postActivityIngest = (id, params) => post({
    url: `${config.live_service}/activity/${id}/ingest`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const putActivityIngest = (id, params) => put({
    url: `${config.live_service}/activity/${id}/ingest`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteActivityIngest = (id) => del({
    url: `${config.live_service}/activity/${id}/ingest`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityMediaFileId = (params) => get({url: `${config.live_service}/activity/${params.id}/getFileId?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllTeams = (params) => get({url: `${config.football_service}/football/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getTeamInLeague = (id) => get({url: `${config.football_service}/football/team?leagueId=${id}&pageSize=100&pageNum=1`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createTeam = (params) => post({url: `${config.football_service}/football/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamById = (id) => get({url: `${config.football_service}/football/team/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateTeamById = (params) => put({url: `${config.football_service}/football/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delTeamByIds = (params) => del({url: `${config.football_service}/football/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const addPlayerToTeam = (params) => post({url: `${config.football_service}/football/team/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addPlayerToMatchTeam = (params) => post({
    url: `${config.football_service}/football/team/match/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInTeam = (params) => put({
    url: `${config.football_service}/football/team/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInMatchTeam = (params) => put({
    url: `${config.football_service}/football/team/match/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deletePlayerInTeam = (params) => del({
    url: `${config.football_service}/football/team/player?${unpack(params)}`,
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deletePlayerInMatchTeam = (params) => del({
    url: `${config.football_service}/football/team/match/player?${unpack(params)}`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllLeagueMatchSeries = (params) => get({
    url: `${config.football_service}/football/league?${unpack({leagueType: 3, ...params})}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllLeagueMatchs = (params) => get({
    url: `${config.football_service}/football/league?${unpack({leagueType: 4, ...params})}`,
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createLeagueMatch = (params) => post({
    url: `${config.football_service}/football/league`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueMatchById = (id) => get({url: `${config.football_service}/football/league/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateLeagueMatchById = (params) => put({
    url: `${config.football_service}/football/league`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delLeagueMatchByIds = (params) => del({
    url: `${config.football_service}/football/league?${unpack(params)}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getLeagueInfoBySeriesId = (params) => get({url: `${config.football_service}/football/league?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueIntoSeries = (params) => post({
    url: `${config.football_service}/football/league/series`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const removeLeagueIntoSeries = (params) => del({url: `${config.football_service}/football/league/series?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getNoSeriesLeague = (params) => get({url: `${config.football_service}/football/league?${unpack({leagueType: 2, ...params})}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueChargeRule = (param) => get({url: `${config.football_service}/football/charge/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueChargeRule = (param) => post({
    url: `${config.football_service}/football/charge/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueChargeRule = (param) => put({
    url: `${config.football_service}/football/charge/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueChargeAllMatch = (param) => get({url: `${config.football_service}/football/charge/league/chargeAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchChargeRule = (param) => get({url: `${config.football_service}/football/charge/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchChargeRule = (param) => post({
    url: `${config.football_service}/football/charge/match`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchChargeRule = (param) => put({
    url: `${config.football_service}/football/charge/match`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueTeamRank = (params) => post({url: `${config.football_service}/football/league/rank/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeaguePlayerRank = (params) => post({url: `${config.football_service}/football/league/rank/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueTeam = (params) => get({url: `${config.football_service}/football/league/rank/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTeamToLeague = (params) => post({url: `${config.football_service}/football/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTeamInLeague = (params) => put({
    url: `${config.football_service}/football/league/team`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTeamInLeague = (params) => del({url: `${config.football_service}/football/league/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayer = (params) => get({url: `${config.football_service}/football/league/rank/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerByLeagueTeam = (params) => get({url: `${config.football_service}/football/league/rank/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueRankSetting = (params) => get({url: `${config.football_service}/football/league/rank/setting?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueRankSetting = (params) => post({
    url: `${config.football_service}/football/league/rank/setting`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeaguePlayer = (params) => post({
    url: `${config.football_service}/football/league/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePlayerInLeague = (params) => put({
    url: `${config.football_service}/football/league/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delPlayerInLeague = (params) => del({url: `${config.football_service}/football/league/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueReport = (params) => get({url: `${config.football_service}/football/league/report?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueReport = (params) => post({url: `${config.football_service}/football/league/report?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchHeatRule = (param) => get({url: `${config.football_service}/football/heat/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchHeatRule = (param) => post({url: `${config.football_service}/football/heat/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchHeatRule = (param) => put({url: `${config.football_service}/football/heat/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMatchHeatRule = (param) => del({url: `${config.football_service}/football/heat/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchTeamHeat = (param) => get({url: `${config.football_service}/football/heat/match/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchPlayerHeat = (param) => get({url: `${config.football_service}/football/heat/match/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerHeat = (param) => get({url: `${config.football_service}/football/heat/league/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueTeamHeat = (param) => get({url: `${config.football_service}/football/heat/league/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchTeamHeat = (param) => post({
    url: `${config.football_service}/football/heat/match/team`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchPlayerHeat = (param) => post({
    url: `${config.football_service}/football/heat/match/player`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeaguePlayerHeat = (param) => post({
    url: `${config.football_service}/football/heat/league/player`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueTeamHeat = (param) => post({
    url: `${config.football_service}/football/heat/league/team`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueHeatRule = (param) => get({url: `${config.football_service}/football/heat/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueHeatRule = (param) => post({url: `${config.football_service}/football/heat/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueHeatRule = (param) => put({
    url: `${config.football_service}/football/heat/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueHeatRule = (param) => del({url: `${config.football_service}/football/heat/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueHeatAllMatch = (param) => get({url: `${config.football_service}/football/heat/league/heatAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueBetRule = (param) => get({url: `${config.football_service}/football/bet/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueBetRule = (param) => post({url: `${config.football_service}/football/bet/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueBetRule = (param) => put({url: `${config.football_service}/football/bet/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueBetRule = (param) => del({url: `${config.football_service}/football/bet/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueBetAllMatch = (param) => get({url: `${config.football_service}/football/bet/league/betAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchBetRule = (param) => get({url: `${config.football_service}/football/bet/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchBetRule = (param) => post({url: `${config.football_service}/football/bet/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchBetRule = (param) => put({url: `${config.football_service}/football/bet/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMatchBetRule = (param) => del({url: `${config.football_service}/football/bet/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getUserBets = (param) => get({url: `${config.football_service}/football/bet/user?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateUserBet = (param) => put({url: `${config.football_service}/football/bet/user`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueClipRule = (param) => get({url: `${config.football_service}/football/clip/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueClipRule = (param) => post({
    url: `${config.football_service}/football/clip/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueClipRule = (param) => put({
    url: `${config.football_service}/football/clip/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueClipAllMatch = (param) => get({url: `${config.football_service}/football/clip/league/clipAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchClipRule = (param) => get({url: `${config.football_service}/football/clip/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchClipRule = (param) => post({
    url: `${config.football_service}/football/clip/match`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchClipRule = (param) => put({
    url: `${config.football_service}/football/clip/match`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getLeagueEncryptionRule = (param) => get({url: `${config.football_service}/football/encryption/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueEncryptionRule = (param) => post({
    url: `${config.football_service}/football/encryption/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueEncryptionRule = (param) => put({
    url: `${config.football_service}/football/encryption/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueEncryptionAllMatch = (param) => get({url: `${config.football_service}/football/encryption/league/encryptionAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchEncryptionRule = (param) => get({url: `${config.football_service}/football/encryption/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchEncryptionRule = (param) => post({
    url: `${config.football_service}/football/encryption/match`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchEncryptionRule = (param) => put({
    url: `${config.football_service}/football/encryption/match`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchs = (params) => get({url: `${config.football_service}/football/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createMatch = (params) => post({url: `${config.football_service}/football/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchById = (id) => get({url: `${config.football_service}/football/match/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchById = (params) => put({url: `${config.football_service}/football/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchScoreStatusById = (params) => put({
    url: `${config.football_service}/football/match/score`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delMatchByIds = (params) => del({url: `${config.football_service}/football/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getRecentMatches = () => get({
    url: `${config.football_service}/match?${unpack({
        pageSize: 20,
        pageNum: 1,
        dateBegin: getPastMonthDate(),
        dateEnd: getNowDate(),
    })}`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchMonopolys = (param) => get({url: `${config.football_service}/football/charge/monopoly?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFormationByMatchTeam = (params) => get({url: `${config.football_service}/football/match/formation?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateFormation = (params) => post({
    url: `${config.football_service}/football/match/formation`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchSchedule = (params) => get({url: `${config.system_service}/sys/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchSchedule = (params) => post({url: `${config.system_service}/sys/schedule/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delMatchSchedule = (params) => del({url: `${config.system_service}/sys/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createMedia = (params) => post({
    url: `${config.media_service}/media`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createActivityMedia = (params) => post({
    url: `${config.media_service}/media/activity`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getActivityMediaList = (param) => get({url: `${config.media_service}/media/activity?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityMedia = (id, param) => get({url: `${config.media_service}/media/activity/${id}?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteActivityMedia = (param) => del({url: `${config.media_service}/media/activity?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateActivityMedia = (params) => put({
    url: `${config.media_service}/media/activity`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityMediaM3U8List = (param) => get({url: `${config.media_service}/media/activity/m3u8?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPing = (id) => get({url: `${config.live_service}/activity/${id}/ping`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLiveQuality = (id) => get({url: `${config.live_service}/activity/${id}/quality/info`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerMedia = (params) => get({url: `${config.media_service}/media/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMediaToPlayer = (params) => post({url: `${config.media_service}/media/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyMedia = (params) => put({url: `${config.media_service}/media`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMediaToPlayer = (params) => del({url: `${config.media_service}/media/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMediaInPlayer = (params) => put({
    url: `${config.media_service}/media/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMediaInPlayer = (params) => get({url: `${config.media_service}/media/player/${params.mediaId}?playerId=${params.playerId}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchMedia = (params) => get({url: `${config.media_service}/media/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getClipsByMatchId = (param) => get({url: `${config.media_service}/media/clip?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateClipsByMatchId = (param) => put({url: `${config.media_service}/media/clip`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteClips = (param) => del({url: `${config.media_service}/media/clip?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const mergeClips = (param) => post({url: `${config.media_service}/media/clip/merge`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getClipCollectionsByMatchId = (param) => get({url: `${config.media_service}/media/clipCollection?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateClipCollectionsByMatchId = (param) => put({
    url: `${config.media_service}/media/clipCollection`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteClipCollections = (param) => del({url: `${config.media_service}/media/clipCollection?${unpack(param)}`})
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
export const getMatchStatus = (matchid) => get({url: `${config.football_service}/football/timeline/status?${unpack({matchId: matchid})}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCommentByMatchId = (param) => get({url: `${config.chat_service}/comment?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addCommentByMatchId = (param) => post({
    url: `${config.chat_service}/comment`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateComment = (param) => put({url: `${config.chat_service}/comment`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const pendCommentById = (id) => put({
    url: `${config.chat_service}/comment/status?${unpack({id: [id]})}&status=0`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passCommentById = (id) => put({
    url: `${config.chat_service}/comment/status?${unpack({id: [id]})}&status=1`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const banCommentById = (id) => put({
    url: `${config.chat_service}/comment/status?${unpack({id: [id]})}&status=2`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const pendCommentByIds = (ids) => put({
    url: `${config.chat_service}/comment/status?${unpack({id: ids})}&status=0`,
    data: ids
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passCommentByIds = (ids) => put({
    url: `${config.chat_service}/comment/status?${unpack({id: ids})}&status=1`,
    data: ids
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const banCommentByIds = (ids) => put({
    url: `${config.chat_service}/comment/status?${unpack({id: ids})}&status=2`,
    data: ids
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteCommentByIds = (ids) => del({url: `${config.chat_service}/comment?${unpack(ids)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueFans = (param) => get({url: `${config.football_service}/football/league/fans?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueFans = (param) => post({
    url: `${config.football_service}/football/league/fans`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueFans = (param) => del({
    url: `${config.football_service}/football/league/fans/leave?${unpack(param)}`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLYSYTeamPlayer = (param) => get({url: `${config.system_service}/sys/file/import/LYSY/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLYSYMatch = (param) => get({url: `${config.system_service}/sys/file/import/LYSY/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLYSYLeaguePlayer = (param) => get({url: `${config.system_service}/sys/file/import/LYSY/league/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getwxacodeunlimit = (param) => post({url: `${config.system_service}/sys/wx/wxa_codeunlimit`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getArticleList = (params) => get({url: `${config.system_service}/sys/wx/gongzhong/article?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getChargeGrowth = () => get({url: `${config.pay_service}/payment/growth`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addChargeGrowth = (param) => post({url: `${config.pay_service}/payment/growth`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateChargeGrowth = (param) => put({url: `${config.pay_service}/payment/growth`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteChargeGrowth = (param) => del({url: `${config.pay_service}/payment/growth?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFreeTickets = (param) => get({url: `${config.pay_service}/payment/freeTicket?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFreeTicketById = (id) => get({url: `${config.pay_service}/payment/freeTicket/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addFreeTicket = (param) => post({url: `${config.pay_service}/payment/freeTicket`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateFreeTicket = (param) => put({url: `${config.pay_service}/payment/freeTicket`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteFreeTickets = (params) => del({url: `${config.pay_service}/payment/freeTicket?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getGifts = (param) => get({url: `${config.pay_service}/payment/gift?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addGift = (param) => post({url: `${config.pay_service}/payment/gift`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateGift = (param) => put({url: `${config.pay_service}/payment/gift`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteGifts = (param) => del({url: `${config.pay_service}/payment/gift?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getUserDeposits = (param) => get({url: `${config.pay_service}/payment/deposit/list?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getOrders = (params) => get({url: `${config.pay_service}/payment/order?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getOrder = (id) => get({url: `${config.pay_service}/payment/order/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateOrder = (params) => put({url: `${config.pay_service}/payment/order`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const closeOrder = (id) => post({url: `${config.pay_service}/payment/order/${id}/close`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const refundOrder = (id) => post({url: `${config.pay_service}/payment/order/${id}/refund`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const queryOrder = (id) => post({url: `${config.pay_service}/payment/order/${id}/query`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueBillAnalysisGift = (param) => get({url: `${config.pay_service}/payment/analysis/bill/gift?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueBillAnalysisCharge = (param) => get({url: `${config.pay_service}/payment/analysis/bill/charge?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getGiftOrder = (param) => get({url: `${config.pay_service}/payment/gift/order?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addFakeGiftOrder = (param) => post({url: `${config.pay_service}/payment/gift/order/fake`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueAdRule = (param) => get({url: `${config.football_service}/football/ad/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueAdRule = (param) => post({
    url: `${config.football_service}/football/ad/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueAdRule = (param) => put({
    url: `${config.football_service}/football/ad/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueShopRule = (param) => get({url: `${config.football_service}/football/shop/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueShopRule = (param) => post({
    url: `${config.football_service}/football/shop/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueShopRule = (param) => put({
    url: `${config.football_service}/football/shop/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getWXShareMomentPicture = (param) => get({url: `${config.system_service}/sys/wx/ma/picture/moment?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPaymentConfig = (params) => get({url: `${config.system_service}/sys/config/payment?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updatePaymentConfig = (params) => post({url: `${config.system_service}/sys/config/payment`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getUserLeagueMemberList = (param) => get({url: `${config.football_service}/football/charge/member?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueMemberRule = (param) => get({url: `${config.football_service}/football/charge/member/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueMemberRule = (param) => post({
    url: `${config.football_service}/football/charge/member/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueMemberRule = (param) => put({
    url: `${config.football_service}/football/charge/member/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueRegistrationRule = (param) => get({url: `${config.football_service}/football/registration/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueRegistrationRule = (param) => post({
    url: `${config.football_service}/football/registration/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueRegistrationRule = (param) => put({
    url: `${config.football_service}/football/registration/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueTeamRegistrationById = (id) => get({url: `${config.football_service}/football/registration/league/team/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueTeamRegistration = (param) => get({url: `${config.football_service}/football/registration/league/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueTeamRegistration = (param) => post({
    url: `${config.football_service}/football/registration/league/team`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueTeamRegistration = (param) => put({
    url: `${config.football_service}/football/registration/league/team`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueTeamRegistration = (param) => del({url: `${config.football_service}/football/registration/league/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const verifyLeagueTeamRegistration = (param) => post({
    url: `${config.football_service}/football/registration/league/team/verify`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerRegistration = (param) => get({url: `${config.football_service}/football/registration/league/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeaguePlayerRegistration = (param) => post({
    url: `${config.football_service}/football/registration/league/player`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeaguePlayerRegistration = (param) => put({
    url: `${config.football_service}/football/registration/league/player`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeaguePlayerRegistration = (param) => del({url: `${config.football_service}/football/registration/league/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const verifyLeaguePlayerRegistration = (param) => post({
    url: `${config.football_service}/football/registration/league/player/verify`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLeagueTeamRegistration = (param) => post({
    url: `${config.football_service}/football/registration/league/import?${unpack(param)}`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const generateLeaguePlayerCashSettlement = (param) => get({url: `${config.football_service}/football/cash/settlement/generate?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerCashSettlement = (param) => get({url: `${config.football_service}/football/cash/settlement?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeaguePlayerCashSettlement = (param) => put({
    url: `${config.football_service}/football/cash/settlement`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeaguePlayerCashSettlement = (param) => del({url: `${config.football_service}/football/cash/settlement?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerCashOrder = (param) => get({url: `${config.football_service}/football/cash/out/record?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passLeaguePlayerCashOrder = (param) => post({
    url: `${config.football_service}/football/cash/out/pass?${unpack(param)}`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const failLeaguePlayerCashOrder = (param) => post({
    url: `${config.football_service}/football/cash/out/fail?${unpack(param)}`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerCashOutVerifyInfo = (param) => get({url: `${config.football_service}/football/cash/out/verifyInfo?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCashOrders = (params) => get({url: `${config.pay_service}/payment/order/cash?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const queryCashOrder = (id) => post({url: `${config.pay_service}/payment/order/cash/${id}/query`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTodoListCount = (params) => get({url: `${config.system_service}/sys/todo/count?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTodoList = (params) => get({url: `${config.system_service}/sys/todo?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const readTodo = (params) => post({url: `${config.system_service}/sys/todo/read`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addUserLeagueMember = (param) => post({url: `${config.football_service}/football/league/member`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteUserLeagueMember = (param) => del({url: `${config.football_service}/football/league/member?${unpack(param)}`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueGiftRule = (param) => get({url: `${config.football_service}/football/gift/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueGiftRule = (param) => post({url: `${config.football_service}/football/gift/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueGiftRule = (param) => put({
    url: `${config.football_service}/football/gift/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueGiftRule = (param) => del({url: `${config.football_service}/football/gift/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueMatchManagementRule = (param) => get({url: `${config.football_service}/football/unit/matchManagement?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueMatchManagementRule = (param) => post({
    url: `${config.football_service}/football/unit/matchManagement`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueMatchManagementRule = (param) => put({
    url: `${config.football_service}/football/unit/matchManagement`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueUnitSettingRule = (param) => get({url: `${config.football_service}/football/unit/setting?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueUnitSettingRule = (param) => post({
    url: `${config.football_service}/football/unit/setting`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueUnitSettingRule = (param) => put({
    url: `${config.football_service}/football/unit/setting`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueBbsRule = (param) => get({url: `${config.football_service}/football/bbs/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueBbsRule = (param) => post({
    url: `${config.football_service}/football/bbs/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueBbsRule = (param) => put({
    url: `${config.football_service}/football/bbs/league`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBbsBoard = (param) => get({url: `${config.bbs_service}/bbs/board?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addBbsBoard = (param) => post({url: `${config.bbs_service}/bbs/board`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateBbsBoard = (param) => put({url: `${config.bbs_service}/bbs/board`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteBbsBoard = (param) => del({url: `${config.bbs_service}/bbs/board?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBbsClass = (param) => get({url: `${config.bbs_service}/bbs/class?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addBbsClass = (param) => post({url: `${config.bbs_service}/bbs/class`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateBbsClass = (param) => put({url: `${config.bbs_service}/bbs/class`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteBbsClass = (param) => del({url: `${config.bbs_service}/bbs/class?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//暂时无用
export const getProducts = (params) => get({url: `${config.pay_service}/product?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getProduct = (id) => get({url: `${config.pay_service}/product/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createProduct = (params) => post({url: `${config.pay_service}/product`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateProduct = (params) => put({url: `${config.pay_service}/product?force=true`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delProducts = (params) => del({url: `${config.pay_service}/product?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//47.92.82. 5
//129.204.161. 196
//www.qiezizhibo. com