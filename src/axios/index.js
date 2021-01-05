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
export const getCurrentAdminUserInfo = () => get({url: `${config.user_service}/admin/user/info`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
    });
export const getAdminUserInfo = (params) => get({url: `${config.user_service}/admin/user/${params.id}?${unpack(params)}`})
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
export const getVisit = () => get({url: `${config.user_service}/user/visit`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getAllDefaultUser = () => get({url: `${config.user_service}/user/defaultUser`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
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
export const getBanner = (params) => get({url: `${config.system_service}/system/config/banner`, data: params})
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
export const getBulletin = () => get({url: `${config.system_service}/system/config/bulletin`})
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
export const updateBulletin = (params) => put({url: `${config.system_service}/system/config/bulletin`, data: params})
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
export const getOrders = (params) => get({url: `${config.pay_service}/order?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getOrder = (id) => get({url: `${config.pay_service}/order/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateOrder = (params) => put({url: `${config.pay_service}/order`, data: params})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const closeOrder = (id) => post({url: `${config.pay_service}/pay/${id}/close`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const refundOrder = (id) => post({url: `${config.pay_service}/pay/${id}/refund`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const queryOrder = (id) => post({url: `${config.pay_service}/pay/${id}/query`, data: {}})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const chargeAllMatchByLeagueId = (id) => get({url: `${config.football_service}/league/${id}/chargeAll`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getwxacodeunlimit = (param) => post({url: `${config.system_service}/system/wxa_codeunlimit`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLYSYTeamPlayer = (param) => get({url: `${config.system_service}/file/import/LYSY?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLYSYMatch = (param) => get({url: `${config.system_service}/file/import/LYSY/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const importLYSYLeaguePlayer = (param) => get({url: `${config.system_service}/file/import/LYSY/league/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFreeTickets = (param) => get({url: `${config.pay_service}/freeTicket?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getFreeTicketById = (id) => get({url: `${config.pay_service}/freeTicket/${id}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addFreeTicket = (param) => post({url: `${config.pay_service}/freeTicket`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateFreeTicket = (param) => put({url: `${config.pay_service}/freeTicket`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteFreeTickets = (params) => del({url: `${config.pay_service}/freeTicket?${unpack(params)}`})
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
export const getMatchMonopolys = (param) => get({url: `${config.football_service}/match/monopoly?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getShareSentenceList = () => get({url: `${config.system_service}/system/share/sentence`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const createShareSentence = (params) => post({
    url: `${config.system_service}/system/share/sentence`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateShareSentence = (params) => put({
    url: `${config.system_service}/system/share/sentence`,
    data: params
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const delShareSentenceById = (params) => del({url: `${config.system_service}/system/share/sentence?${unpack(params)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getExp = () => get({url: `${config.user_service}/exp`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addExp = (param) => post({url: `${config.user_service}/exp`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateExp = (param) => put({url: `${config.user_service}/exp`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteExp = (param) => del({url: `${config.user_service}/exp?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getChargeGrowth = () => get({url: `${config.pay_service}/growth`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addChargeGrowth = (param) => post({url: `${config.pay_service}/growth`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateChargeGrowth = (param) => put({url: `${config.pay_service}/growth`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteChargeGrowth = (param) => del({url: `${config.pay_service}/growth?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getGifts = (param) => get({url: `${config.pay_service}/gift?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addGift = (param) => post({url: `${config.pay_service}/gift`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateGift = (param) => put({url: `${config.pay_service}/gift`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteGifts = (param) => del({url: `${config.pay_service}/gift?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueHeatRule = (param) => get({url: `${config.football_service}/heat/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueHeatRule = (param) => post({url: `${config.football_service}/heat/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueHeatRule = (param) => put({url: `${config.football_service}/heat/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueHeatRule = (param) => del({url: `${config.football_service}/heat/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueHeatAllMatch = (param) => get({url: `${config.football_service}/heat/league/heatAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueFans = (param) => get({url: `${config.football_service}/league/fans?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueFans = (param) => post({
    url: `${config.football_service}/league/fans?${unpack(param)}`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueFans = (param) => put({url: `${config.football_service}/league/fans`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueFans = (param) => post({
    url: `${config.football_service}/league/fans/leave?${unpack(param)}`,
    data: null
})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchHeatRule = (param) => get({url: `${config.football_service}/heat/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchHeatRule = (param) => post({url: `${config.football_service}/heat/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchHeatRule = (param) => put({url: `${config.football_service}/heat/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMatchHeatRule = (param) => del({url: `${config.football_service}/heat/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchTeamHeat = (param) => get({url: `${config.football_service}/heat/match/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchPlayerHeat = (param) => get({url: `${config.football_service}/heat/match/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeaguePlayerHeat = (param) => get({url: `${config.football_service}/heat/league/player?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueTeamHeat = (param) => get({url: `${config.football_service}/heat/league/team?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchTeamHeat = (param) => post({url: `${config.football_service}/heat/match/team`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchPlayerHeat = (param) => post({url: `${config.football_service}/heat/match/player`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeaguePlayerHeat = (param) => post({url: `${config.football_service}/heat/league/player`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueTeamHeat = (param) => post({url: `${config.football_service}/heat/league/team`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getGiftOrder = (param) => get({url: `${config.pay_service}/gift/order?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addFakeGiftOrder = (param) => post({url: `${config.pay_service}/gift/order/fake`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueBetRule = (param) => get({url: `${config.football_service}/bet/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueBetRule = (param) => post({url: `${config.football_service}/bet/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueBetRule = (param) => put({url: `${config.football_service}/bet/league`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteLeagueBetRule = (param) => del({url: `${config.football_service}/bet/league?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueBetAllMatch = (param) => get({url: `${config.football_service}/bet/league/betAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchBetRule = (param) => get({url: `${config.football_service}/bet/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchBetRule = (param) => post({url: `${config.football_service}/bet/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchBetRule = (param) => put({url: `${config.football_service}/bet/match`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const deleteMatchBetRule = (param) => del({url: `${config.football_service}/bet/match?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getUserBets = (param) => get({url: `${config.football_service}/bet?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateUserBet = (param) => put({url: `${config.football_service}/bet`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getUserDeposits = (param) => get({url: `${config.pay_service}/deposit/list?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueClipRule = (param) => get({url: `${config.football_service}/league/${param.leagueId}/clip?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addLeagueClipRule = (param) => post({url: `${config.football_service}/league/${param.leagueId}/clip`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateLeagueClipRule = (param) => put({url: `${config.football_service}/league/${param.leagueId}/clip`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const leagueClipAllMatch = (param) => get({url: `${config.football_service}/league/${param.leagueId}/clipAll?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getMatchClipRule = (param) => get({url: `${config.football_service}/match/${param.matchId}/clip?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const addMatchClipRule = (param) => post({url: `${config.football_service}/match/${param.matchId}/clip`, data: param})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const updateMatchClipRule = (param) => put({url: `${config.football_service}/match/${param.matchId}/clip`, data: param})
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
export const updateClipCollectionsByMatchId = (param) => put({url: `${config.media_service}/media/clipCollection`, data: param})
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
export const getLeagueBillAnalysisGift = (param) => get({url: `${config.pay_service}/analysis/bill/gift?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
export const getLeagueBillAnalysisCharge = (param) => get({url: `${config.pay_service}/analysis/bill/charge?${unpack(param)}`})
    .then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error)
    });
//47.92.82. 5
//129.204.161. 196
//www.qiezizhibo. com