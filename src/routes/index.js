import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import MatchManagement from '../pages/MatchManagement'
import TimelineManagement from '../pages/TimelineManagement'
export default class Router extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/:id" component={TimelineManagement} />
                <Route exact path="/" component={MatchManagement} />
                <Route render={() => <Redirect to="/" />} />
            </Switch>
        )
    }
}