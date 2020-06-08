/**
 * Created by wufan on 2018/12/26.
 */
import axios from 'axios';
import {get, post, put, del, unpack} from './tools';
import * as config from './config';
import {getNowDate, getPastMonthDate} from '../utils';

export const npmDependencies = () => get('./npm.json').then(res => res.data).catch(err => console.log(err));

export const weibo = () => get('./weibo.json').then(res => res.data).catch(err => console.log(err));

export const webSocket = (activityid) => `${config.websocket_service}/websocket/${activityid}`;

export const uploadimg = `${config.system_service}/file/upload/image?avatar=true`;

export const uploadmedia = `${config.system_service}/file/upload/media`;

export const upload = `${config.system_service}/file/upload/image`;

export const uploaddocx_team = `${config.system_service}/file/import/team`;

export const uploaddocx_match = `${config.system_service}/file/import/match`;

export const login = (params) => post({url: `${config.auth_service}/auth`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAuthUserDetail = (params) => post({url: `${config.auth_service}/auth/user`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getUserInfo = (params) => get({url: `${config.user_service}/user/${params.id}?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllUser = (params) => get({url: `${config.user_service}/user?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllDefaultUser = () => get({url: `${config.user_service}/user/defaultUser`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createUser = (params) => post({url: `${config.user_service}/user`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
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

export const getAllPlayers = (params) => get({url: `${config.football_service}/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllPlayersNotInTeam = (params, teamId) => get({
    url: `${config.football_service}/player?${unpack({teamId: teamId, notinteam: true, ...params})}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createPlayer = (params) => post({url: `${config.football_service}/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPlayerById = (id) => get({url: `${config.football_service}/player/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updatePlayerById = (params) => put({url: `${config.football_service}/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delPlayerByIds = (params) => del({url: `${config.football_service}/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getPlayersByTeamId = (id, params) => get({
    url: `${config.football_service}/player?${unpack({teamId: id, ...params})}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });

export const getAllTeams = (params) => get({url: `${config.football_service}/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createTeam = (params) => post({url: `${config.football_service}/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamById = (id) => get({url: `${config.football_service}/team/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateTeamById = (params) => put({url: `${config.football_service}/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delTeamByIds = (params) => del({url: `${config.football_service}/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const addPlayerToTeam = (params) => post({url: `${config.football_service}/team/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addPlayerToMatchTeam = (params) => post({
    url: `${config.football_service}/team/match/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInTeam = (params) => put({
    url: `${config.football_service}/team/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const modifyPlayerInMatchTeam = (params) => put({
    url: `${config.football_service}/team/match/player`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchs = (params) => get({url: `${config.football_service}/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createMatch = (params) => post({url: `${config.football_service}/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchById = (id) => get({url: `${config.football_service}/match/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchById = (params) => put({url: `${config.football_service}/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateMatchScoreStatusById = (params) => put({url: `${config.football_service}/match/score`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delMatchByIds = (params) => del({url: `${config.football_service}/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });

export const getAllLeagueMatchSeries = (params) => get({
    url: `${config.football_service}/league?${unpack({leagueType: 3, ...params})}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAllLeagueMatchs = (params) => get({
    url: `${config.football_service}/league?${unpack({leagueType: 4, ...params})}`,
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const createLeagueMatch = (params) => post({
    url: `${config.football_service}/league`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueMatchById = (id) => get({url: `${config.football_service}/league/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const updateLeagueMatchById = (params) => put({
    url: `${config.football_service}/league`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const delLeagueMatchByIds = (params) => del({
    url: `${config.football_service}/league?${unpack(params)}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getMatchPlayersByTeamId = (matchid, teamid) => get({
    url: `${config.football_service}/player?${unpack({
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

export const getFormationById = (id) => get({url: `${config.football_service}/match/formation/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFormationByMatchTeam = (params) => get({url: `${config.football_service}/match/formation?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateFormation = (params) => put({url: `${config.football_service}/match/formation`, data: params})
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
export const getActivityMedia = (id,param) => get({url: `${config.media_service}/media/activity/${id}?${unpack(param)}`})
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

export const getPing = (id) => get({url: `${config.live_service}/activity/${id}/ping`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getAllRoles = (params) => get({url: `${config.user_service}/role?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const getPermissionList = (params) => get({url: `${config.user_service}/permission?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createPermission = (params) => post({url: `${config.user_service}/permission`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePermissionById = (params) => put({url: `${config.user_service}/permission`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delPermissionByIds = (params) => del({url: `${config.user_service}/permission?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createRole = (params) => post({url: `${config.user_service}/role`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });

export const updateRoleById = (params) => put({url: `${config.user_service}/role`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delRoleByIds = (params) => del({url: `${config.user_service}/role?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTimelineByMatchId = (params) => get({
    url: `${config.football_service}/timeline?${unpack(params)}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTimeline = (params) => put({url: `${config.football_service}/timeline`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTimeline = (params) => post({url: `${config.football_service}/timeline`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTimelineByIds = (params) => del({
    url: `${config.football_service}/timeline?${unpack(params)}`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePassAndPossession = (params) => post({
    url: `${config.football_service}/timeline/passAndPossession`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getPassAndPossession = (matchid, teamid) => get({
    url: `${config.football_service}/timeline/passAndPossession?${unpack({
        matchId: matchid,
        teamId: teamid
    })}`
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchTime = (matchid) => get({url: `${config.football_service}/timeline/time?${unpack({matchId: matchid})}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getRecentMatches = (param) => get({
    url: `${config.football_service}/match?${unpack({
        pageSize: 20,
        pageNum: 1,
        dateBegin: getPastMonthDate(),
        dateEnd: getNowDate(),
        ...param
    })}`
})
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
export const getCommentCountByMatchId = (matchId) => get({url: `${config.chat_service}/comment/count?${unpack({matchId: matchId})}`})
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
export const getLeagueTeam = (params) => get({url: `${config.football_service}/league/rank/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getTeamInLeague = (id) => get({url: `${config.football_service}/league/${id}/team`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addTeamToLeague = (params) => post({url: `${config.football_service}/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateTeamInLeague = (params) => put({url: `${config.football_service}/league/team`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteTeamInLeague = (params) => del({url: `${config.football_service}/league/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayer = (params) => get({url: `${config.football_service}/league/rank/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerByLeagueTeam = (params) => get({url: `${config.football_service}/league/rank/player/${params.playerId}?${unpack(params)}`})
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
export const addLeaguePlayer = (params) => post({url: `${config.football_service}/league/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updatePlayerInLeague = (params) => put({url: `${config.football_service}/league/player`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delPlayerInLeague = (params) => del({url: `${config.football_service}/league/player?${unpack(params)}`})
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
export const getVisit = (param) => get({url: `${config.user_service}/user/visit?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBanner = (params) => get({url: `${config.system_service}/system/config/banner?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setBanner = (params) => post({url: `${config.system_service}/system/config/banner`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateBanner = (params) => put({url: `${config.system_service}/system/config/banner`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delConfig = (params) => del({url: `${config.system_service}/system/config?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getScoreboard = () => get({url: `${config.system_service}/system/config/scoreboard`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setScoreboard = (params) => post({url: `${config.system_service}/system/config/scoreboard`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateScoreboard = (params) => put({
    url: `${config.system_service}/system/config/scoreboard`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteScoreboard = (params) => del({url: `${config.system_service}/system/config?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getBulletin = (param) => get({url: `${config.system_service}/system/config/bulletin?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const setBulletin = (params) => post({url: `${config.system_service}/system/config/bulletin`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteBulletin = (params) => del({url: `${config.system_service}/system/config?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllMatchSchedule = (params) => get({url: `${config.system_service}/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchSchedule = (params) => post({url: `${config.system_service}/schedule/match`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delMatchSchedule = (params) => del({url: `${config.system_service}/schedule/match?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueTeamRank = (params) => post({url: `${config.football_service}/league/rank/team?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeaguePlayerRank = (params) => post({url: `${config.football_service}/league/rank/player?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueInfoBySeriesId = (params) => get({url: `${config.football_service}/league?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueIntoSeries = (params) => post({url: `${config.football_service}/league/series`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const removeLeagueIntoSeries = (params) => del({url: `${config.football_service}/league/series?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getNoSeriesLeague = (params) => get({url: `${config.football_service}/league?${unpack({leagueType: 2, ...params})}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAreasList = () => get({url: `${config.system_service}/system/config/area`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createArea = (params) => post({url: `${config.system_service}/system/config/area`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delAreaById = (params) => del({url: `${config.system_service}/system/config/area?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueReport = (id) => get({url: `${config.football_service}/league/${id}/report`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const genLeagueReport = (id) => post({url: `${config.football_service}/league/${id}/report`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getArticleList = (params) => get({url: `${config.system_service}/system/gongzhong/article?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//47.92.82. 5
//129.204.161. 196
//www.qiezizhibo. com