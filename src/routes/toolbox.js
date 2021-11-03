import React, {Component} from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import {Route, Redirect, Switch} from 'react-router-dom';
import ToolboxDashboard from '../manage/Toolbox/ToolboxDashboard';
import UserLeagueMemberTable from '../manage/Football/Charge/League/UserLeagueMemberTable';
import PaymentConfigManagement from '../manage/Setting/Payment/PaymentConfigManagement';
import LeagueMember from '../manage/Toolbox/LeagueMember';
import Unauthorized from '../manage/Pages/Unauthorized';

var UrlPattern = require('url-pattern');

export default class CRouter extends Component {
    requireAuth = (url, component) => {
        const page401 = Unauthorized;
        const {permissions} = this.props;
        if (permissions) {
            let vaild = false;
            for (let permission of permissions) {
                if (permission) {
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
                <Route exact path="/toolbox" component={ToolboxDashboard}/>
                <Route exact path="/toolbox/leagueMember"
                       component={this.requireAuth("/football/league/charge", UserLeagueMemberTable)}/>
                <Route exact path="/toolbox/paySetting"
                       component={this.requireAuth("/setting/payment", PaymentConfigManagement)}/>
                <Route render={() => <Redirect to="/toolbox"/>}/>
            </Switch>
        )
    }
}