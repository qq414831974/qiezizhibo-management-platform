import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './App';

export default () => (
    <Router basename="/anchor">
        <Switch>
            <Route path="/" component={App} />
        </Switch>
    </Router>
)