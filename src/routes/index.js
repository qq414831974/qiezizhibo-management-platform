import React, {Component} from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import {Route, Redirect, Switch} from 'react-router-dom';
import UserManagement from '../manage/User/UserManagement';
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
import MatchMonopolyManagement from "../manage/Pay/Monopoly/MatchMonopolyManagement";


export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const {auth} = this.props;
        const {permissions} = auth.data;
        console.log(this.props);
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'}/>;
        return component;
    };

    render() {
        return (
            <Switch>
                <Route exact path="/index" component={Dashboard}/>
                <Route exact path="/user" component={UserManagement}/>
                <Route exact path="/role/role" component={RoleManagement}/>
                <Route exact path="/role/permission" component={PermissionManagement}/>
                <Route exact path="/area" component={AreasManagement}/>
                <Route exact path="/football/footballPlayer" component={FootBallPlayerManagement}/>
                <Route exact path="/football/footballTeam" component={FootBallTeamManagement}/>
                <Route exact path="/football/footballMatch" component={FootBallMatchManagement}/>
                <Route exact path="/football/footballLeagueMatch" component={FootBallLeagueMatchManagement}/>
                <Route exact path="/live" component={LiveManagement}/>
                <Route exact path="/setting/banner" component={BannerSetting}/>
                <Route exact path="/setting/scoreboard" component={ScoreBoardSetting}/>
                <Route exact path="/setting/wechat" component={WechatSetting}/>
                <Route exact path="/setting/bulletin" component={BulletinSetting}/>
                <Route exact path="/pay/product" component={ProductManagement}/>
                <Route exact path="/pay/order" component={OrderManagement}/>
                <Route exact path="/football/import" component={ImportManagement}/>
                <Route exact path="/football/import/lysy" component={ImportLYSYManagement}/>
                <Route path="/football/comment/:id" component={CommentManagement}/>
                <Route path="/live/:id" component={LiveDetailManagement}/>
                <Route path="/football/footballTeam/:id" component={TeamDetailManagement}/>
                <Route path="/football/footballMatch/:id" component={MatchDetailManagement}/>
                <Route path="/football/footballLeagueMatch/:id" component={FootballLeagueMatchDetailManagement}/>
                <Route path="/football/footballLeagueSeries/:id" component={FootBallLeagueMatchSeriesManagement}/>
                <Route path="/football/footballPlayer/:id" component={FootballPlayerDetailManagement}/>
                <Route path="/football/schedule" component={FootballMatchSchedule}/>
                <Route path="/freeTicket" component={FreeTicketManagement}/>
                <Route path="/monopoly" component={MatchMonopolyManagement}/>
                <Route render={() => <Redirect to="/index"/>}/>
            </Switch>
        )
    }
}