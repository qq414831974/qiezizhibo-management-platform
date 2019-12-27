/**
 * Created by wufan on 2018/12/26.
 */
import axios from 'axios';
import {get, post, put, del, unpack} from './tools';
import * as config from './config';

export const npmDependencies = () => get('./npm.json').then(res => res.data).catch(err => console.log(err));

export const weibo = () => get('./weibo.json').then(res => res.data).catch(err => console.log(err));

export const webSocket = (activityid) => `wss://www.qiezizhibo-api.com/api/websocket/${activityid}`;

export const uploadimg = 'https://www.qiezizhibo-api.com/api/uploadimg?avatar=true';

export const uploadmedia = 'https://www.qiezizhibo-api.com/api/uploadmedia';

export const upload = 'https://www.qiezizhibo-api.com/api/uploadimg';

export const uploaddocx_team = 'https://www.qiezizhibo-api.com/api/import/team';

export const uploaddocx_match = 'https://www.qiezizhibo-api.com/api/import/match';

export const login = (params) => post({url: 'https://www.qiezizhibo-api.com/api/login', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const loginout = () => get({url: 'https://www.qiezizhibo-api.com/api/logout'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllUser = (params) => post({url: 'https://www.qiezizhibo-api.com/api/getAllUser', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllDefaultUser = () => get({url: 'https://www.qiezizhibo-api.com/api/defaultUser'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createUser = (params) => post({url: 'https://www.qiezizhibo-api.com/api/user/', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delUserByIds = (params) => post({url: 'https://www.qiezizhibo-api.com/api/deleteUserInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateUserById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/user', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delUserById = (id) => del({url: 'https://www.qiezizhibo-api.com/api/user/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const createActivity = (params) => post({url: 'https://www.qiezizhibo-api.com/api/activity', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityInfo = (id) => get({url: 'https://www.qiezizhibo-api.com/api/activity/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityInfoList = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/getAllActivity',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityInfo = (id, params) => put({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityFakeInfo = (id, params) => put({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id + '/fake',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityDetailInfo = (id) => get({url: 'https://www.qiezizhibo-api.com/api/activity/' + id + "/template"})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityDetailInfo = (id, params) => put({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id + "/template",
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityIngest = (id) => get({url: 'https://www.qiezizhibo-api.com/api/activity/' + id + "/ingest"})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const postActivityIngest = (id, params) => post({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id + "/ingest",
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const putActivityIngest = (id, params) => put({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id + "/ingest",
    data: params
})
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
export const getAllPlayersNotInTeam = (params, teamId) => post({
    url: 'https://www.qiezizhibo-api.com/api/getAllPlayersNotInTeam?teamId=' + teamId,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createPlayer = (params) => post({url: 'https://www.qiezizhibo-api.com/api/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerById = (id) => get({url: 'https://www.qiezizhibo-api.com/api/player/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updatePlayerById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delPlayerByIds = (params) => post({url: 'https://www.qiezizhibo-api.com/api/deletePlayerInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delPlayerById = (id) => del({url: 'https://www.qiezizhibo-api.com/api/player/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
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

export const getAllTeams = (params) => post({url: 'https://www.qiezizhibo-api.com/api/getAllTeams', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createTeam = (params) => post({url: 'https://www.qiezizhibo-api.com/api/team', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamById = (id) => get({url: 'https://www.qiezizhibo-api.com/api/team/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateTeamById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/team', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delTeamByIds = (params) => post({url: 'https://www.qiezizhibo-api.com/api/deleteTeamInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delTeamById = (id) => del({url: 'https://www.qiezizhibo-api.com/api/team/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addPlayerToTeam = (params) => post({url: 'https://www.qiezizhibo-api.com/api/addPlayerToTeam', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addPlayerToMatchTeam = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/addPlayerToMatchTeam',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInTeam = (params) => put({
    url: 'https://www.qiezizhibo-api.com/api/modifyPlayerInTeam',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInMatchTeam = (params) => put({
    url: 'https://www.qiezizhibo-api.com/api/modifyPlayerInMatchTeam',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchs = (params) => post({url: 'https://www.qiezizhibo-api.com/api/getAllMatchs', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createMatch = (params) => post({url: 'https://www.qiezizhibo-api.com/api/match', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchById = (id) => get({url: 'https://www.qiezizhibo-api.com/api/match/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/match', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchScoreStatusById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/match/score', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delMatchByIds = (params) => post({url: 'https://www.qiezizhibo-api.com/api/deleteMatchInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delMatchById = (id) => del({url: 'https://www.qiezizhibo-api.com/api/match/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getAllLeagueMatchSeries = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/getAllLeagueMatchs',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllLeagueMatchs = (params) => get({
    url: `https://www.qiezizhibo-api.com/api/leagueMatchs?${unpack(params)}`,
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createLeagueMatch = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/footballLeagueMatch',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueMatchById = (id) => get({url: 'https://www.qiezizhibo-api.com/api/leagueMatch/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateLeagueMatchById = (params) => put({
    url: 'https://www.qiezizhibo-api.com/api/footballLeagueMatch',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateLeagueMatchByIdSelective = (params) => put({
    url: 'https://www.qiezizhibo-api.com/api/footballLeagueMatch?selective=true',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delLeagueMatchByIds = (params) => post({
    url: 'https://www.qiezizhibo-api.com/api/deleteLeagueMatchInfo',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delLeagueMatchById = (id) => del({url: 'https://www.qiezizhibo-api.com/api/footballLeagueMatch/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchPlayersByTeamId = (matchid, teamid) => get({url: 'https://www.qiezizhibo-api.com/api/getMatchPlayersByTeamId?matchid=' + matchid + '&teamid=' + teamid})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getFormationById = (params) => get({url: 'https://www.qiezizhibo-api.com/api/footballFormation/' + params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFormationByMatchTeam = (params) => get({url: `https://www.qiezizhibo-api.com/api/footballFormation?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateFormation = (params) => put({url: 'https://www.qiezizhibo-api.com/api/footballFormation', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });


export const preUpload = (filename, filesize) => get({url: 'https://www.qiezizhibo-api.com/api/preupload?filename=' + filename + (filesize ? '&filesize=' + filesize : '')})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const prelogin = () => get({url: 'https://www.qiezizhibo-api.com/api/prelogin'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createMedia = (id, params) => post({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id + '/media',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getMediaList = (id) => get({url: 'https://www.qiezizhibo-api.com/api/activity/' + id + '/media'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMedia = (id) => del({url: 'https://www.qiezizhibo-api.com/api/activity/media/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const bulkMedia = (id, params) => put({
    url: 'https://www.qiezizhibo-api.com/api/activity/' + id + '/media/bulk',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTransProgress = (id, taskIds) => get({url: 'https://www.qiezizhibo-api.com/api/activity/' + id + '/progress?taskIds=' + taskIds})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getPing = (id) => get({url: 'https://www.qiezizhibo-api.com/api/activity/' + id + '/ping'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getFunc = (params) => post({url: 'https://www.qiezizhibo-api.com/get', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllRoles = (params) => post({url: 'https://www.qiezizhibo-api.com/api/getAllRoles', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getRoleList = () => get({url: 'https://www.qiezizhibo-api.com/api/getRoleList'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createRole = (params) => post({url: 'https://www.qiezizhibo-api.com/api/role', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const updateRoleById = (params) => put({url: 'https://www.qiezizhibo-api.com/api/role', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delRoleByIds = (params) => post({url: 'https://www.qiezizhibo-api.com/api/deleteRoles', data: params})
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
export const getRecentMatches = () => get({url: 'https://www.qiezizhibo-api.com/api/getRecentMatches'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getOneMatch = () => get({url: 'https://www.qiezizhibo-api.com/api/getOneMatch'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLiveDetail = (id) => get({url: `https://www.qiezizhibo-api.com/api/activity/${id}/getLiveDetail`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllComment = (param) => post({url: `https://www.qiezizhibo-api.com/api/getAllComment`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMessageByMatchId = (matchId, pageNum, pageSize) => get({url: `https://www.qiezizhibo-api.com/api/comment?matchId=${matchId}&pageNum=${pageNum}&pageSize=${pageSize}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCommentByMatchId = (matchId, param) => post({
    url: `https://www.qiezizhibo-api.com/api/getLiveComment?matchId=${matchId}`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCommentCountByMatchId = (matchId) => get({url: `https://www.qiezizhibo-api.com/api/comment/count?matchId=${matchId}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addCommentByMatchId = (matchId, param) => post({
    url: `https://www.qiezizhibo-api.com/api/comment?matchId=${matchId}`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateComment = (param) => put({url: `https://www.qiezizhibo-api.com/api/comment`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const pendCommentById = (id) => put({url: `https://www.qiezizhibo-api.com/api/comment/${id}?status=0`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passCommentById = (id) => put({url: `https://www.qiezizhibo-api.com/api/comment/${id}?status=1`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const banCommentById = (id) => put({url: `https://www.qiezizhibo-api.com/api/comment/${id}?status=2`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const pendCommentByIds = (ids) => put({url: `https://www.qiezizhibo-api.com/api/commentStatus?status=0`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passCommentByIds = (ids) => put({url: `https://www.qiezizhibo-api.com/api/commentStatus?status=1`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const banCommentByIds = (ids) => put({url: `https://www.qiezizhibo-api.com/api/commentStatus?status=2`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteCommentById = (id) => del({url: `https://www.qiezizhibo-api.com/api/comment/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteCommentByIds = (ids) => post({url: `https://www.qiezizhibo-api.com/api/deleteComment`, data: ids})
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
export const getLeagueTeam = (params) => get({url: `https://www.qiezizhibo-api.com/api/league/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamInLeague = (params) => get({url: `https://www.qiezizhibo-api.com/api/league/getLeagueTeam?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTeamToLeague = (params) => post({url: `https://www.qiezizhibo-api.com/api/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTeamInLeague = (params) => put({url: `https://www.qiezizhibo-api.com/api/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTeamInLeague = (params) => del({url: `https://www.qiezizhibo-api.com/api/league/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayer = (params) => get({url: `https://www.qiezizhibo-api.com/api/league/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerByLeagueTeam = (params) => get({url: `https://www.qiezizhibo-api.com/api/league/getLeaguePlayer?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMedia = (params) => get({url: `https://www.qiezizhibo-api.com/api/media?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerMedia = (params) => get({url: `https://www.qiezizhibo-api.com/api/media/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMediaToPlayer = (params) => post({url: 'https://www.qiezizhibo-api.com/api/media/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyMediaToPlayer = (params) => put({url: 'https://www.qiezizhibo-api.com/api/media/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMediaToPlayer = (params) => del({url: `https://www.qiezizhibo-api.com/api/media/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMediaInPlayer = (params) => post({
    url: `https://www.qiezizhibo-api.com/api/updateMediaInPlayer`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMediaInPlayer = (params) => post({url: `https://www.qiezizhibo-api.com/api/getMediaInPlayer`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeaguePlayer = (params) => post({url: `https://www.qiezizhibo-api.com/api/league/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePlayerInLeague = (params) => put({url: `https://www.qiezizhibo-api.com/api/league/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delPlayerInLeague = (params) => del({url: `https://www.qiezizhibo-api.com/api/league/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchMedia = (params) => get({url: `https://www.qiezizhibo-api.com/api/media/recommend?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const search = (params) => get({url: `https://www.qiezizhibo-api.com/api/search?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getVisit = () => get({url: `https://www.qiezizhibo-api.com/api/getVisit`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setConfig = (params) => post({url: `https://www.qiezizhibo-api.com/api/config`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delConfig = (params) => del({url: `https://www.qiezizhibo-api.com/api/config?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getConfig = () => get({url: `https://www.qiezizhibo-api.com/api/config`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getScoreboard = () => get({url: `https://www.qiezizhibo-api.com/api/config/scoreboard`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setScoreboard = (params) => post({url: `https://www.qiezizhibo-api.com/api/config/scoreboard`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteScoreboard = (params) => del({url: `https://www.qiezizhibo-api.com/api/config/scoreboard?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBulletin = () => get({url: `https://www.qiezizhibo-api.com/api/config/bulletin`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setBulletin = (params) => post({url: `https://www.qiezizhibo-api.com/api/config/bulletin`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteBulletin = (params) => del({url: `https://www.qiezizhibo-api.com/api/config/bulletin?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchSchedule = (params) => get({url: `https://www.qiezizhibo-api.com/api/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchSchedule = (params) => post({url: `https://www.qiezizhibo-api.com/api/schedule/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delMatchSchedule = (params) => del({url: `https://www.qiezizhibo-api.com/api/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueTeamRank = (params) => get({url: `https://www.qiezizhibo-api.com/api/genLeagueTeamRank?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeaguePlayerRank = (params) => get({url: `https://www.qiezizhibo-api.com/api/genLeaguePlayerRank?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueInfoBySeriesId = (id) => get({url: `https://www.qiezizhibo-api.com/api/leagueSeries?leagueId=${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueIntoSeries = (params) => post({url: `https://www.qiezizhibo-api.com/api/leagueSeries`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const removeLeagueIntoSeries = (params) => del({url: `https://www.qiezizhibo-api.com/api/leagueSeries?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getNoSeriesLeague = (params) => get({url: `https://www.qiezizhibo-api.com/api/getNoSeriesLeague?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAreasList = () => get({url: 'https://www.qiezizhibo-api.com/api/areas'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createArea = (params) => post({url: 'https://www.qiezizhibo-api.com/api/areas', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delAreaById = (id) => del({url: `https://www.qiezizhibo-api.com/api/areas/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueReport = (id) => get({url: `https://www.qiezizhibo-api.com/api/league/${id}/report`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueReport = (id) => post({url: `https://www.qiezizhibo-api.com/api/league/${id}/report`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getArticleList = (params) => get({url: `https://www.qiezizhibo-api.com/api/article?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//47.92.82. 5
//129.204.161. 196
//www.qiezizhibo. com