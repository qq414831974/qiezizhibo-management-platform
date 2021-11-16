import React from 'react';
import {Row, Col, Card, message, Avatar,} from 'antd';
import TeamRegistrationTable from './TeamRegistrationTable';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {getLeagueMatchById} from "../../../../axios";
import defultAvatar from "../../../../static/avatar.jpg";


class TeamRegistrationManagement extends React.Component {
    state = {
        data: {},
        leagueData: {},
    }

    componentDidMount() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        this.fetch(currentLeague);
    }

    fetch = (leagueId) => {
        getLeagueMatchById(leagueId).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    leagueData: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }

    render() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球队报名管理"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}
                                  title={<div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                      <Avatar
                                          src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                                      <span className="ml-s">{this.state.leagueData.name}</span>
                                  </div>}>
                                <TeamRegistrationTable leagueId={currentLeague} history={this.props.history}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamRegistrationManagement);