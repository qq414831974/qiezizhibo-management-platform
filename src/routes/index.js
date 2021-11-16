import React, {Component} from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import {Route, Redirect, Switch} from 'react-router-dom';
import AdminUserManagement from '../manage/AdminUser/UserManagement';
import UserManagement from '../manage/User/UserManagement';
import UserDetailManagement from '../manage/User/UserDetailManagement';
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
import FootBallLeagueMatchSeriesManagement from "../manage/Football/League/Series/FootBallLeagueMatchSeriesManagement";
import FootballLeagueMatchDetailManagement from "../manage/Football/League/FootballLeagueMatchDetailManagement";
import ImportManagement from "../manage/Football/Import/ImportManagement";
import RoleManagement from "../manage/Role/RoleManagement";
import PermissionManagement from "../manage/Permission/PermissionManagement";
import AreasManagement from "../manage/Areas/AreasManagement";
import CommentManagement from "../manage/Comment/CommentManagement";
import Dashboard from "../manage/Dashboard/Dashboard";
import BannerSetting from "../manage/Setting/Banner/BannerSetting";
import ScoreBoardSetting from "../manage/Setting/ScoreBoard/ScoreBoardSetting";
import BulletinSetting from "../manage/Setting/Bulletin/BulletinSetting";
import WechatSetting from "../manage/Setting/WechatSetting";
import FootballMatchSchedule from "../manage/Football/Match/FootballMatchSchedule";
import ProductManagement from "../manage/Pay/Product/ProductManagement";
import OrderManagement from "../manage/Pay/Order/OrderManagement";
import CashManagement from "../manage/Pay/Cash/CashManagement";
import ImportLYSYManagement from "../manage/Football/Import/LYSY/ImportLYSYManagement";
import FreeTicketManagement from "../manage/Pay/FreeTicket/FreeTicketManagement";
import DepositManagement from "../manage/Pay/Deposit/DepositManagement";
import MatchMonopolyManagement from "../manage/Pay/Monopoly/MatchMonopolyManagement";
import ShareSentenceManagement from "../manage/Setting/ShareSentence/ShareSentenceManagement";
import GiftManagement from "../manage/Pay/Gift/GiftManagement";
import FootBallLeagueChargeManagement from "../manage/Football/Charge/League/FootBallLeagueChargeManagement";
import FootBallMatchChargeManagement from "../manage/Football/Charge/Match/FootBallMatchChargeManagement";
import FootBallLeagueHeatManagement from "../manage/Football/Heat/League/FootBallLeagueHeatManagement";
import FootBallMatchHeatManagement from "../manage/Football/Heat/Match/FootBallMatchHeatManagement";
import FootBallLeagueBetManagement from "../manage/Football/Bet/League/FootBallLeagueBetManagement";
import FootBallMatchBetManagement from "../manage/Football/Bet/Match/FootBallMatchBetManagement";
import UserBetManagement from "../manage/Football/Bet/UserBetManagement";
import FootBallLeagueClipManagement from "../manage/Football/Clip/League/FootBallLeagueClipManagement";
import FootBallMatchClipManagement from "../manage/Football/Clip/Match/FootBallMatchClipManagement";
import FootBallLeagueAdManagement from "../manage/Football/Ad/League/FootBallLeagueAdManagement";
import FootBallLeagueEncryptionManagement from "../manage/Football/Encryption/League/FootBallLeagueEncryptionManagement";
import FootBallLeagueRegistrationManagement from "../manage/Football/Registration/FootBallLeagueRegistrationManagement";
import FootBallLeagueUnitSettingManagement from "../manage/Football/UnitSetting/FootBallLeagueUnitSettingManagement";
import TeamRegistrationManagement from "../manage/Football/Registration/Team/TeamRegistrationManagement";
import PlayerRegistrationManagement from "../manage/Football/Registration/Player/PlayerRegistrationManagement";
import FootBallMatchEncrypitonManagement from "../manage/Football/Encryption/Match/FootBallMatchEncryptionManagement";
import FootballLeagueMatchBillAnalysis from "../manage/Football/League/Bill/FootballLeagueMatchBillAnalysis";
import FootBallLeagueDetailSetting from "../manage/Football/League/Detail/FootBallLeagueDetailSetting";
import PaymentConfigManagement from "../manage/Setting/Payment/PaymentConfigManagement";
import Unauthorized from '../manage/Pages/Unauthorized';
import LogManagement from '../manage/Log/LogManagement';
import FeedbackManagement from '../manage/Setting/Feedback/FeedbackManagement';

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
                <Route exact path="/user/user" component={this.requireAuth("/user/user" ,UserManagement)}/>
                <Route exact path="/user/admin" component={this.requireAuth("/user/admin",AdminUserManagement)}/>
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
                <Route exact path="/setting/payment" component={this.requireAuth("/setting/payment",PaymentConfigManagement)}/>
                <Route exact path="/pay/product" component={this.requireAuth("/pay/product",ProductManagement)}/>
                <Route exact path="/pay/order" component={this.requireAuth("/pay/order",OrderManagement)}/>
                <Route exact path="/pay/cash" component={this.requireAuth("/pay/cash",CashManagement)}/>
                <Route exact path="/pay/freeTicket" component={this.requireAuth("/pay/freeTicket",FreeTicketManagement)}/>
                <Route exact path="/pay/monopoly" component={this.requireAuth("/pay/monopoly",MatchMonopolyManagement)}/>
                <Route exact path="/pay/gift" component={this.requireAuth("/pay/gift",GiftManagement)}/>
                <Route exact path="/pay/deposit" component={this.requireAuth("/pay/deposit",DepositManagement)}/>
                <Route exact path="/football/import" component={this.requireAuth("/football/import",ImportManagement)}/>
                <Route exact path="/football/import/lysy" component={this.requireAuth("/football/import/lysy",ImportLYSYManagement)}/>
                <Route exact path="/football/league/charge" component={this.requireAuth("/football/league/charge",FootBallLeagueChargeManagement)}/>
                <Route exact path="/football/match/charge" component={this.requireAuth("/football/match/charge",FootBallMatchChargeManagement)}/>
                <Route exact path="/football/league/heat" component={this.requireAuth("/football/league/heat",FootBallLeagueHeatManagement)}/>
                <Route exact path="/football/match/heat" component={this.requireAuth("/football/match/heat",FootBallMatchHeatManagement)}/>
                <Route exact path="/football/league/bet" component={this.requireAuth("/football/league/bet",FootBallLeagueBetManagement)}/>
                <Route exact path="/football/match/bet" component={this.requireAuth("/football/match/bet",FootBallMatchBetManagement)}/>
                <Route exact path="/football/league/clip" component={this.requireAuth("/football/league/clip",FootBallLeagueClipManagement)}/>
                <Route exact path="/football/match/clip" component={this.requireAuth("/football/match/clip",FootBallMatchClipManagement)}/>
                <Route exact path="/football/league/encryption" component={this.requireAuth("/football/league/encryption",FootBallLeagueEncryptionManagement)}/>
                <Route exact path="/football/match/encryption" component={this.requireAuth("/football/match/encryption",FootBallMatchEncrypitonManagement)}/>
                <Route exact path="/football/league/ad" component={this.requireAuth("/football/league/ad",FootBallLeagueAdManagement)}/>
                {/*<Route exact path="/football/league/registration" component={this.requireAuth("/football/league/registration",FootBallLeagueRegistrationManagement)}/>*/}
                <Route exact path="/football/league/unit" component={this.requireAuth("/football/league/unit",FootBallLeagueUnitSettingManagement)}/>
                <Route exact path="/football/league/registration/team" component={this.requireAuth("/football/league/registration/team",TeamRegistrationManagement)}/>
                <Route exact path="/football/league/registration/player" component={this.requireAuth("/football/league/registration/player",PlayerRegistrationManagement)}/>
                <Route exact path="/pay/bet" component={this.requireAuth("/pay/bet",UserBetManagement)}/>
                <Route path="/football/comment/:id" component={this.requireAuth("/football/comment/:id",CommentManagement)}/>
                <Route path="/live/:id" component={this.requireAuth("/live/:id",LiveDetailManagement)}/>
                <Route path="/user/user/:id" component={this.requireAuth("/user/user/:id" ,UserDetailManagement)}/>
                <Route path="/football/footballTeam/:id" component={this.requireAuth("/football/footballTeam/:id",TeamDetailManagement)}/>
                <Route path="/football/footballMatch/:id" component={this.requireAuth("/football/footballMatch/:id",MatchDetailManagement)}/>
                <Route path="/football/league/detail/:id" component={this.requireAuth("/football/footballLeagueMatch/:id",FootBallLeagueDetailSetting)}/>
                <Route path="/football/footballLeagueMatch/:id" component={this.requireAuth("/football/footballLeagueMatch/:id",FootballLeagueMatchDetailManagement)}/>
                <Route path="/football/footballLeagueSeries/:id" component={this.requireAuth("/football/footballLeagueSeries/:id",FootBallLeagueMatchSeriesManagement)}/>
                <Route path="/football/footballPlayer/:id" component={this.requireAuth("/football/footballPlayer/:id",FootballPlayerDetailManagement)}/>
                <Route path="/football/schedule" component={this.requireAuth("/football/schedule",FootballMatchSchedule)}/>
                <Route path="/analysis/bill" component={this.requireAuth("/analysis/bill",FootballLeagueMatchBillAnalysis)}/>
                <Route path="/sys/log" component={this.requireAuth("/sys/log",LogManagement)}/>
                <Route path="/sys/feedback" component={this.requireAuth("/sys/feedback",FeedbackManagement)}/>
                <Route render={() => <Redirect to="/index"/>}/>
            </Switch>
        )
    }
}