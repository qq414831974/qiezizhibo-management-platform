import React, {Component} from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import {Route, Redirect, Switch} from 'react-router-dom';
import UserManagement from '../manage/User/UserManagement';
import ExpManagement from '../manage/Exp/ExpManagement';
import GrowthManagement from '../manage/Growth/GrowthManagement';
import FootBallPlayerManagement from "../manage/Football/Player/FootBallPlayerManagement";
import FootballPlayerDetailManagement from "../manage/Football/Player/FootballPlayerDetailManagement";
import LiveManagement from "../manage/Live/LiveManagement";
import LiveDetailManagement from "../manage/Live/LiveDetailManagement";
import FootBallTeamManagement from "../manage/Football/Team/FootBallTeamManagement";
import TeamDetailManagement from "../manage/Football/Team/FootBallTeamDetailManagement";
import FootBallMatchManagement from "../manage/Football/Match/FootBallMatchManagement";
import MatchDetailManagement from "../manage/Football/Match/FootBallMatchDetailManagement";
import FootBallLeagueMatchManagement from "../manage/Football/League/FootBallLeagueMatchManagement";
import FootBallLeagueMatchSeriesManagement from "../manage/Football/League/FootBallLeagueMatchSeriesManagement";
import FootballLeagueMatchDetailManagement from "../manage/Football/League/FootballLeagueMatchDetailManagement";
import ImportManagement from "../manage/Football/Import/ImportManagement";
import RoleManagement from "../manage/Role/RoleManagement";
import PermissionManagement from "../manage/Permission/PermissionManagement";
import AreasManagement from "../manage/Areas/AreasManagement";
import CommentManagement from "../manage/Comment/CommentManagement";
import Dashboard from "../manage/Dashboard/Dashboard";
import BannerSetting from "../manage/Setting/BannerSetting";
import ScoreBoardSetting from "../manage/Setting/ScoreBoardSetting";
import BulletinSetting from "../manage/Setting/BulletinSetting";
import WechatSetting from "../manage/Setting/WechatSetting";
import FootballMatchSchedule from "../manage/Football/Match/FootballMatchSchedule";
import ProductManagement from "../manage/Pay/Product/ProductManagement";
import OrderManagement from "../manage/Pay/Order/OrderManagement";
import ImportLYSYManagement from "../manage/Football/Import/LYSY/ImportLYSYManagement";
import FreeTicketManagement from "../manage/Pay/FreeTicket/FreeTicketManagement";
import DepositManagement from "../manage/Pay/Deposit/DepositManagement";
import MatchMonopolyManagement from "../manage/Pay/Monopoly/MatchMonopolyManagement";
import ShareSentenceManagement from "../manage/Setting/ShareSentence/ShareSentenceManagement";
import GiftManagement from "../manage/Pay/Gift/GiftManagement";
import FootBallLeagueHeatManagement from "../manage/Football/Heat/League/FootBallLeagueHeatManagement";
import FootBallMatchHeatManagement from "../manage/Football/Heat/Match/FootBallMatchHeatManagement";
import FootBallLeagueBetManagement from "../manage/Football/Bet/League/FootBallLeagueBetManagement";
import FootBallMatchBetManagement from "../manage/Football/Bet/Match/FootBallMatchBetManagement";
import UserBetManagement from "../manage/Football/Bet/UserBetManagement";
import FootBallLeagueClipManagement from "../manage/Football/Clip/League/FootBallLeagueClipManagement";
import FootBallMatchClipManagement from "../manage/Football/Clip/Match/FootBallMatchClipManagement";
import Unauthorized from '../manage/Pages/Unauthorized';

var UrlPattern = require('url-pattern');

export default class CRouter extends Component {
    requireAuth = (url, component) => {
        const page401 = Unauthorized;
        const {permissions} = this.props;
        if (permissions) {
            let vaild = false;
            for (let permission of permissions) {
                if(permission){
                    var pattern = new UrlPattern(permission);
                    if (pattern.match(url)) {
                        vaild = true;
                        break;
                    }
                }
            }
            if (vaild) {
                return component
            } else {
                return page401
            }
        }
        return page401;
    };

    render() {
        return (
            <Switch>
                <Route exact path="/index" component={Dashboard}/>
                <Route exact path="/user/admin" component={this.requireAuth("/user/admin",UserManagement)}/>
                <Route exact path="/exp/exp" component={this.requireAuth("/exp/exp",ExpManagement)}/>
                <Route exact path="/exp/growth" component={this.requireAuth("/exp/growth",GrowthManagement)}/>
                <Route exact path="/role/role" component={this.requireAuth("/role/role",RoleManagement)}/>
                <Route exact path="/role/permission" component={this.requireAuth("/role/permission",PermissionManagement)}/>
                <Route exact path="/area" component={this.requireAuth("/area",AreasManagement)}/>
                <Route exact path="/football/footballPlayer" component={this.requireAuth("/football/footballPlayer",FootBallPlayerManagement)}/>
                <Route exact path="/football/footballTeam" component={this.requireAuth("/football/footballTeam",FootBallTeamManagement)}/>
                <Route exact path="/football/footballMatch" component={this.requireAuth("/football/footballMatch",FootBallMatchManagement)}/>
                <Route exact path="/football/footballLeagueMatch" component={this.requireAuth("/football/footballLeagueMatch",FootBallLeagueMatchManagement)}/>
                <Route exact path="/live" component={this.requireAuth("/live",LiveManagement)}/>
                <Route exact path="/setting/banner" component={this.requireAuth("/setting/banner",BannerSetting)}/>
                <Route exact path="/setting/scoreboard" component={this.requireAuth("/setting/scoreboard",ScoreBoardSetting)}/>
                <Route exact path="/setting/wechat" component={this.requireAuth("/setting/wechat",WechatSetting)}/>
                <Route exact path="/setting/bulletin" component={this.requireAuth("/setting/bulletin",BulletinSetting)}/>
                <Route exact path="/setting/sharesentence" component={this.requireAuth("/setting/sharesentence",ShareSentenceManagement)}/>
                <Route exact path="/pay/product" component={this.requireAuth("/pay/product",ProductManagement)}/>
                <Route exact path="/pay/order" component={this.requireAuth("/pay/order",OrderManagement)}/>
                <Route exact path="/pay/freeTicket" component={this.requireAuth("/pay/freeTicket",FreeTicketManagement)}/>
                <Route exact path="/pay/monopoly" component={this.requireAuth("/pay/monopoly",MatchMonopolyManagement)}/>
                <Route exact path="/pay/gift" component={this.requireAuth("/pay/gift",GiftManagement)}/>
                <Route exact path="/pay/deposit" component={this.requireAuth("/pay/deposit",DepositManagement)}/>
                <Route exact path="/football/import" component={this.requireAuth("/football/import",ImportManagement)}/>
                <Route exact path="/football/import/lysy" component={this.requireAuth("/football/import/lysy",ImportLYSYManagement)}/>
                <Route exact path="/football/league/heat" component={this.requireAuth("/football/league/heat",FootBallLeagueHeatManagement)}/>
                <Route exact path="/football/match/heat" component={this.requireAuth("/football/match/heat",FootBallMatchHeatManagement)}/>
                <Route exact path="/football/league/bet" component={this.requireAuth("/football/league/bet",FootBallLeagueBetManagement)}/>
                <Route exact path="/football/match/bet" component={this.requireAuth("/football/match/bet",FootBallMatchBetManagement)}/>
                <Route exact path="/football/league/clip" component={this.requireAuth("/football/league/clip",FootBallLeagueClipManagement)}/>
                <Route exact path="/football/match/clip" component={this.requireAuth("/football/match/clip",FootBallMatchClipManagement)}/>
                <Route exact path="/pay/bet" component={this.requireAuth("/pay/bet",UserBetManagement)}/>
                <Route path="/football/comment/:id" component={this.requireAuth("/football/comment/:id",CommentManagement)}/>
                <Route path="/live/:id" component={this.requireAuth("/live/:id",LiveDetailManagement)}/>
                <Route path="/football/footballTeam/:id" component={this.requireAuth("/football/footballTeam/:id",TeamDetailManagement)}/>
                <Route path="/football/footballMatch/:id" component={this.requireAuth("/football/footballMatch/:id",MatchDetailManagement)}/>
                <Route path="/football/footballLeagueMatch/:id" component={this.requireAuth("/football/footballLeagueMatch/:id",FootballLeagueMatchDetailManagement)}/>
                <Route path="/football/footballLeagueSeries/:id" component={this.requireAuth("/football/footballLeagueSeries/:id",FootBallLeagueMatchSeriesManagement)}/>
                <Route path="/football/footballPlayer/:id" component={this.requireAuth("/football/footballPlayer/:id",FootballPlayerDetailManagement)}/>
                <Route path="/football/schedule" component={this.requireAuth("/football/schedule",FootballMatchSchedule)}/>
                <Route render={() => <Redirect to="/index"/>}/>
            </Switch>
        )
    }
}