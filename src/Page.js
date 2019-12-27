import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './manage/Pages/NotFound';
import Login from './manage/Pages/Login';
import App from './App';

export default () => (
    <Router basename="/manage">
        <Switch>
            {/*<Route exact path="/" component={HomePage} />*/}
            {/*<Route exact path="/match/:id" component={HomePage} />*/}
            {/*<Route exact path="/match" component={MatchPage} />*/}
            {/*<Route exact path="/league" component={LeagueMatchSearchPage} />*/}
            {/*<Route exact path="/league/:id" component={LeagueMatchPage} />*/}
            {/*<Route exact path="/contact" component={ContactUsPage} />*/}
            <Route exact path="/" render={() => <Redirect to="/index" push />} />
            <Route path="/login" component={Login} />
            <Route path="/" component={App} />
            {/*<Route path="/404" component={NotFound} />*/}
            <Route component={NotFound} />
        </Switch>
    </Router>
)
// export default () => (
//     <Router basename="/web">
//         <Switch>
//             <Route exact path="/" component={HomePage} />
//             <Route exact path="/match/:id" component={HomePage} />
//             <Route exact path="/match" component={MatchPage} />
//             <Route exact path="/league" component={LeagueMatchSearchPage} />
//             <Route exact path="/league/:id" component={LeagueMatchPage} />
//             <Route exact path="/contact" component={ContactUsPage} />
//             <Route exact path="/anchorManager" component={AnchorManager} />
//             <Route exact path="/securitySystem" component={SecuritySystem} />
//             <Route exact path="/registAgreement" component={RegistAgreement} />
//             <Route exact path="/plantStandard" component={PlantStandard} />
//             <Route exact path="/homeLiveRoom/:id" component={HomeLiveRoom} />
//             <Route exact path="/homeLiveRoom" component={HomeLiveRoom} />
//             <Route exact path="/homeLiveRoomCulture" component={HomeLiveRoomCulture} />
//             <Route exact path="/homeLiveRoomCulture/:id" component={HomeLiveRoomCulture} />
//             <Route exact path="/recruit" component={Recruit} />
//             <Route exact path="/pact" component={Pact} />
//             <Route path="/404" component={NotFound} />
//             <Route component={NotFound} />
//         </Switch>
//     </Router>
// )