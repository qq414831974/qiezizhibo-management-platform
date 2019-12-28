/**
 * Created by wufan on 2018/12/26.
 */
import axios from 'axios';
import {get, post, put, del, unpack} from './tools';
import * as config from './config';

export const npmDependencies = () => get('./npm.json').then(res => res.data).catch(err => console.log(err));

export const weibo = () => get('./weibo.json').then(res => res.data).catch(err => console.log(err));

export const webSocket = (activityid) => `wss://www.qiezizhibo-api.com/api/websocket/${activityid}`;

export const uploadimg = 'http://localhost:8080/api/uploadimg?avatar=true';

export const uploadmedia = 'http://localhost:8080/api/uploadmedia';

export const upload = 'http://localhost:8080/api/uploadimg';

export const uploaddocx_team = 'http://localhost:8080/api/import/team';

export const uploaddocx_match = 'http://localhost:8080/api/import/match';

export const login = (params) => post({url: 'http://localhost:8080/api/login', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const loginout = () => get({url: 'http://localhost:8080/api/logout'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllUser = (params) => post({url: 'http://localhost:8080/api/getAllUser', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllDefaultUser = () => get({url: 'http://localhost:8080/api/defaultUser'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createUser = (params) => post({url: 'http://localhost:8080/api/user/', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delUserByIds = (params) => post({url: 'http://localhost:8080/api/deleteUserInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateUserById = (params) => put({url: 'http://localhost:8080/api/user', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delUserById = (id) => del({url: 'http://localhost:8080/api/user/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const createActivity = (params) => post({url: 'http://localhost:8080/api/activity', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityInfo = (id) => get({url: 'http://localhost:8080/api/activity/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityInfoList = (params) => post({
    url: 'http://localhost:8080/api/getAllActivity',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityInfo = (id, params) => put({
    url: 'http://localhost:8080/api/activity/' + id,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityFakeInfo = (id, params) => put({
    url: 'http://localhost:8080/api/activity/' + id + '/fake',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityDetailInfo = (id) => get({url: 'http://localhost:8080/api/activity/' + id + "/template"})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyActivityDetailInfo = (id, params) => put({
    url: 'http://localhost:8080/api/activity/' + id + "/template",
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getActivityIngest = (id) => get({url: 'http://localhost:8080/api/activity/' + id + "/ingest"})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const postActivityIngest = (id, params) => post({
    url: 'http://localhost:8080/api/activity/' + id + "/ingest",
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const putActivityIngest = (id, params) => put({
    url: 'http://localhost:8080/api/activity/' + id + "/ingest",
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllPlayers = (params) => post({url: 'http://localhost:8080/api/getAllPlayers', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllPlayersNotInTeam = (params, teamId) => post({
    url: 'http://localhost:8080/api/getAllPlayersNotInTeam?teamId=' + teamId,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createPlayer = (params) => post({url: 'http://localhost:8080/api/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerById = (id) => get({url: 'http://localhost:8080/api/player/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updatePlayerById = (params) => put({url: 'http://localhost:8080/api/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delPlayerByIds = (params) => post({url: 'http://localhost:8080/api/deletePlayerInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delPlayerById = (id) => del({url: 'http://localhost:8080/api/player/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayersByTeamId = (id, params) => post({
    url: 'http://localhost:8080/api/getPlayersByTeamId/' + id,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });

export const getAllTeams = (params) => post({url: 'http://localhost:8080/api/getAllTeams', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createTeam = (params) => post({url: 'http://localhost:8080/api/team', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamById = (id) => get({url: 'http://localhost:8080/api/team/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateTeamById = (params) => put({url: 'http://localhost:8080/api/team', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delTeamByIds = (params) => post({url: 'http://localhost:8080/api/deleteTeamInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delTeamById = (id) => del({url: 'http://localhost:8080/api/team/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addPlayerToTeam = (params) => post({url: 'http://localhost:8080/api/addPlayerToTeam', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addPlayerToMatchTeam = (params) => post({
    url: 'http://localhost:8080/api/addPlayerToMatchTeam',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInTeam = (params) => put({
    url: 'http://localhost:8080/api/modifyPlayerInTeam',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInMatchTeam = (params) => put({
    url: 'http://localhost:8080/api/modifyPlayerInMatchTeam',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchs = (params) => post({url: 'http://localhost:8080/api/getAllMatchs', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createMatch = (params) => post({url: 'http://localhost:8080/api/match', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchById = (id) => get({url: 'http://localhost:8080/api/match/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchById = (params) => put({url: 'http://localhost:8080/api/match', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchScoreStatusById = (params) => put({url: 'http://localhost:8080/api/match/score', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delMatchByIds = (params) => post({url: 'http://localhost:8080/api/deleteMatchInfo', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delMatchById = (id) => del({url: 'http://localhost:8080/api/match/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getAllLeagueMatchSeries = (params) => post({
    url: 'http://localhost:8080/api/getAllLeagueMatchs',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllLeagueMatchs = (params) => get({
    url: `http://localhost:8080/api/leagueMatchs?${unpack(params)}`,
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createLeagueMatch = (params) => post({
    url: 'http://localhost:8080/api/footballLeagueMatch',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueMatchById = (id) => get({url: 'http://localhost:8080/api/leagueMatch/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateLeagueMatchById = (params) => put({
    url: 'http://localhost:8080/api/footballLeagueMatch',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateLeagueMatchByIdSelective = (params) => put({
    url: 'http://localhost:8080/api/footballLeagueMatch?selective=true',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delLeagueMatchByIds = (params) => post({
    url: 'http://localhost:8080/api/deleteLeagueMatchInfo',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delLeagueMatchById = (id) => del({url: 'http://localhost:8080/api/footballLeagueMatch/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchPlayersByTeamId = (matchid, teamid) => get({url: 'http://localhost:8080/api/getMatchPlayersByTeamId?matchid=' + matchid + '&teamid=' + teamid})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getFormationById = (params) => get({url: 'http://localhost:8080/api/footballFormation/' + params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFormationByMatchTeam = (params) => get({url: `http://localhost:8080/api/footballFormation?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateFormation = (params) => put({url: 'http://localhost:8080/api/footballFormation', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });


export const preUpload = (filename, filesize) => get({url: 'http://localhost:8080/api/preupload?filename=' + filename + (filesize ? '&filesize=' + filesize : '')})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const prelogin = () => get({url: 'http://localhost:8080/api/prelogin'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createMedia = (id, params) => post({
    url: 'http://localhost:8080/api/activity/' + id + '/media',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getMediaList = (id) => get({url: 'http://localhost:8080/api/activity/' + id + '/media'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMedia = (id) => del({url: 'http://localhost:8080/api/activity/media/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const bulkMedia = (id, params) => put({
    url: 'http://localhost:8080/api/activity/' + id + '/media/bulk',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTransProgress = (id, taskIds) => get({url: 'http://localhost:8080/api/activity/' + id + '/progress?taskIds=' + taskIds})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getPing = (id) => get({url: 'http://localhost:8080/api/activity/' + id + '/ping'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getFunc = (params) => post({url: 'http://localhost:8080/get', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllRoles = (params) => post({url: 'http://localhost:8080/api/getAllRoles', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getRoleList = () => get({url: 'http://localhost:8080/api/getRoleList'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createRole = (params) => post({url: 'http://localhost:8080/api/role', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const updateRoleById = (params) => put({url: 'http://localhost:8080/api/role', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delRoleByIds = (params) => post({url: 'http://localhost:8080/api/deleteRoles', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTimelineByMatchId = (params) => post({
    url: 'http://localhost:8080/api/getTimelineByMatchId',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTimeline = (params) => put({url: 'http://localhost:8080/api/timeline', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTimeline = (params) => post({url: 'http://localhost:8080/api/timeline', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineById = (id) => del({url: 'http://localhost:8080/api/timeline/' + id})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineByIds = (params) => post({
    url: 'http://localhost:8080/api/deleteTimeline',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineByMatchId = (params) => post({
    url: 'http://localhost:8080/api/deleteTimelineByMatchId',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePassAndPossession = (params) => post({
    url: 'http://localhost:8080/api/passAndPossession',
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPassAndPossession = (matchid, teamid) => get({url: 'http://localhost:8080/api/passAndPossession?matchid=' + matchid + (teamid ? ('&teamid=' + teamid) : '')})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchTime = (matchid) => get({url: 'http://localhost:8080/api/getMatchTime/' + matchid})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getRecentMatches = () => get({url: 'http://localhost:8080/api/getRecentMatches'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getOneMatch = () => get({url: 'http://localhost:8080/api/getOneMatch'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLiveDetail = (id) => get({url: `http://localhost:8080/api/activity/${id}/getLiveDetail`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllComment = (param) => post({url: `http://localhost:8080/api/getAllComment`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMessageByMatchId = (matchId, pageNum, pageSize) => get({url: `http://localhost:8080/api/comment?matchId=${matchId}&pageNum=${pageNum}&pageSize=${pageSize}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCommentByMatchId = (matchId, param) => post({
    url: `http://localhost:8080/api/getLiveComment?matchId=${matchId}`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getCommentCountByMatchId = (matchId) => get({url: `http://localhost:8080/api/comment/count?matchId=${matchId}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addCommentByMatchId = (matchId, param) => post({
    url: `http://localhost:8080/api/comment?matchId=${matchId}`,
    data: param
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateComment = (param) => put({url: `http://localhost:8080/api/comment`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const pendCommentById = (id) => put({url: `http://localhost:8080/api/comment/${id}?status=0`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passCommentById = (id) => put({url: `http://localhost:8080/api/comment/${id}?status=1`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const banCommentById = (id) => put({url: `http://localhost:8080/api/comment/${id}?status=2`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const pendCommentByIds = (ids) => put({url: `http://localhost:8080/api/commentStatus?status=0`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const passCommentByIds = (ids) => put({url: `http://localhost:8080/api/commentStatus?status=1`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const banCommentByIds = (ids) => put({url: `http://localhost:8080/api/commentStatus?status=2`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteCommentById = (id) => del({url: `http://localhost:8080/api/comment/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteCommentByIds = (ids) => post({url: `http://localhost:8080/api/deleteComment`, data: ids})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchs = (params) => get({url: `http://localhost:8080/api/matchs?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchStatus = (params) => get({url: `http://localhost:8080/api/matchStatus?matchid=${params}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueTeam = (params) => get({url: `http://localhost:8080/api/league/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamInLeague = (params) => get({url: `http://localhost:8080/api/league/getLeagueTeam?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTeamToLeague = (params) => post({url: `http://localhost:8080/api/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTeamInLeague = (params) => put({url: `http://localhost:8080/api/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTeamInLeague = (params) => del({url: `http://localhost:8080/api/league/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayer = (params) => get({url: `http://localhost:8080/api/league/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerByLeagueTeam = (params) => get({url: `http://localhost:8080/api/league/getLeaguePlayer?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMedia = (params) => get({url: `http://localhost:8080/api/media?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerMedia = (params) => get({url: `http://localhost:8080/api/media/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMediaToPlayer = (params) => post({url: 'http://localhost:8080/api/media/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyMediaToPlayer = (params) => put({url: 'http://localhost:8080/api/media/player', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMediaToPlayer = (params) => del({url: `http://localhost:8080/api/media/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMediaInPlayer = (params) => post({
    url: `http://localhost:8080/api/updateMediaInPlayer`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMediaInPlayer = (params) => post({url: `http://localhost:8080/api/getMediaInPlayer`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeaguePlayer = (params) => post({url: `http://localhost:8080/api/league/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePlayerInLeague = (params) => put({url: `http://localhost:8080/api/league/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delPlayerInLeague = (params) => del({url: `http://localhost:8080/api/league/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchMedia = (params) => get({url: `http://localhost:8080/api/media/recommend?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const search = (params) => get({url: `http://localhost:8080/api/search?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getVisit = () => get({url: `http://localhost:8080/api/getVisit`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setConfig = (params) => post({url: `http://localhost:8080/api/config`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delConfig = (params) => del({url: `http://localhost:8080/api/config?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getConfig = (params) => get({url: `http://localhost:8080/api/config?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getScoreboard = () => get({url: `http://localhost:8080/api/config/scoreboard`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setScoreboard = (params) => post({url: `http://localhost:8080/api/config/scoreboard`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteScoreboard = (params) => del({url: `http://localhost:8080/api/config/scoreboard?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBulletin = () => get({url: `http://localhost:8080/api/config/bulletin`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setBulletin = (params) => post({url: `http://localhost:8080/api/config/bulletin`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteBulletin = (params) => del({url: `http://localhost:8080/api/config/bulletin?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchSchedule = (params) => get({url: `http://localhost:8080/api/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchSchedule = (params) => post({url: `http://localhost:8080/api/schedule/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delMatchSchedule = (params) => del({url: `http://localhost:8080/api/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueTeamRank = (params) => get({url: `http://localhost:8080/api/genLeagueTeamRank?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeaguePlayerRank = (params) => get({url: `http://localhost:8080/api/genLeaguePlayerRank?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueInfoBySeriesId = (id) => get({url: `http://localhost:8080/api/leagueSeries?leagueId=${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueIntoSeries = (params) => post({url: `http://localhost:8080/api/leagueSeries`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const removeLeagueIntoSeries = (params) => del({url: `http://localhost:8080/api/leagueSeries?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getNoSeriesLeague = (params) => get({url: `http://localhost:8080/api/getNoSeriesLeague?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAreasList = () => get({url: 'http://localhost:8080/api/areas'})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createArea = (params) => post({url: 'http://localhost:8080/api/areas', data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delAreaById = (id) => del({url: `http://localhost:8080/api/areas/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueReport = (id) => get({url: `http://localhost:8080/api/league/${id}/report`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueReport = (id) => post({url: `http://localhost:8080/api/league/${id}/report`, data: null})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getArticleList = (params) => get({url: `http://localhost:8080/api/article?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//47.92.82. 5
//129.204.161. 196
//www.qiezizhibo. com