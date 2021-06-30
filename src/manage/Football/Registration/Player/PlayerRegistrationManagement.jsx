import React from 'react';
import {Row, Col, Card, message, Avatar,} from 'antd';
import PlayerRegistrationTable from './PlayerRegistrationTable';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {getLeagueMatchById, getLeagueTeamRegistrationById} from "../../../../axios";
import defultAvatar from "../../../../static/avatar.jpg";


class PlayerRegistrationManagement extends React.Component {
    state = {
        data: {},
        leagueData: {},
        teamData: {},
    }
    componentDidMount() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const currentTeam = getQueryString(this.props.location.search, "teamId");
        this.fetch(currentLeague, currentTeam);
    }

    fetch = (leagueId, teamId) => {
        getLeagueMatchById(leagueId).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    leagueData: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
        getLeagueTeamRegistrationById(teamId).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    teamData: data.data ? data.data : {},
                });
            } else {
                message.error('获取报名球队信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }

    render() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const currentTeam = getQueryString(this.props.location.search, "teamId");

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球员报名管理"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}
                                  title={<div>
                                      <div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                          <Avatar
                                              src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                                          <span className="ml-s">{this.state.leagueData.name}</span>
                                      </div>
                                      <div className="center purple-light pt-s pb-s pl-m pr-m mt-s border-radius-10px">
                                          <Avatar
                                              src={this.state.teamData.headImg ? this.state.teamData.headImg : defultAvatar}/>
                                          <span className="ml-s">{this.state.teamData.name}</span>
                                      </div>
                                  </div>}>
                                <PlayerRegistrationTable teamId={currentTeam} leagueId={currentLeague}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerRegistrationManagement);