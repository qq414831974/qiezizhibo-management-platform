/**
 * Created by wufan on 2018/10/18.
 */
import React from 'react';
import {Row, Col, Card, Avatar, Icon, message} from 'antd';
import EchartsViews from './EchartsViews';
import EchartsProjects from './EchartsProjects';
import avatar from '../../static/avatar.jpg';
import logo from '../../static/logo.png';
import {getActivityInfoList, getRecentMatches} from "../../axios/index";


class Dashboard extends React.Component {
    state = {
        activityData: null,
        matchData: null,
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        //获取直播列表
        getActivityInfoList({pageSize: 100, pageNum: 1, status: "enabled"}).then((data) => {
            if (data && data.items && data.items.length > 0) {
                this.setState({
                    activityData: data.items,
                });
            }
        });
        //获取近期的比赛
        getRecentMatches({areatype: 2}).then((res) => {
            if (res && res.code == 200) {
                const data = res.data;
                if (data && data.total > 0) {
                    this.setState({
                        matchData: data.records,
                    });
                }
            } else {
                message.error('获取近期比赛信息失败：' + (res ? res.code + ":" + res.message : res), 3);
            }
        });
    }
    //获取直播详细
    getLiveDetail = () => {
        let total = 0;//总数
        let living = 0;//正在直播数
        if (this.state.activityData) {
            this.state.activityData.forEach((item, index) => {
                if (item.status == "enabled") {
                    if (item.isPushing == true) {
                        living = living + 1;
                    }
                    total = total + 1;
                }
            });
        }
        return {total, living};
    }
    //获取比赛详细
    getMatchDetail = () => {
        //总比赛
        let totalMatch = 0;
        //正在比赛
        let matching = 0;
        //已完场
        let done = 0;
        //近期比赛的列表
        let matchDom = [];
        if (this.state.matchData) {
            this.state.matchData.forEach((item, index) => {
                const hostteam = item.hostteam;
                const guestteam = item.guestteam;
                //不是未开始（-1 or null）或者不是完场（21）
                if (item.status != null && item.status != -1 && item.status != 21) {
                    matching = matching + 1;
                }
                //完场（21）
                else if (item.status == 21) {
                    done = done + 1;
                }
                totalMatch = totalMatch + 1;
                if (hostteam == null || guestteam == null) {
                    matchDom.push(<div className="w-full mb-s cursor-hand cell-hover" key={item.id}
                                       onClick={this.onMatchClick.bind(this, item.id)}>
                        <span>{item.name}</span>
                    </div>);
                } else {
                    matchDom.push(<div className="w-full mb-s cursor-hand cell-hover" key={item.id}
                                       onClick={this.onMatchClick.bind(this, item.id)}>
                        <Row gutter={0}>
                            <Col span={10}>
                                <div className="team-host">
                                    <p className="team-name">{hostteam.name}</p>
                                    <Avatar className="team-avatar" src={hostteam.headImg ? hostteam.headImg : avatar}/>
                                </div>
                            </Col>
                            <Col span={4}>
                                {item.status != null && item.status != 21 && item.status != -1 ?
                                    <div className="w-full center">
                                        <Icon type="video-camera" theme="outlined"/>
                                        <p style={{fontSize: 14}}>{item.score ? item.score : "0-0"}</p>
                                    </div>
                                    :
                                    <p className="w-full center"
                                       style={{fontSize: 14}}>{item.status == -1 ? "VS" : item.score}</p>}
                            </Col>
                            <Col span={10}>
                                <div className="team-guest">
                                    <Avatar className="team-avatar"
                                            src={guestteam.headImg ? guestteam.headImg : avatar}/>
                                    <p className="team-name">{guestteam.name}</p>
                                </div>
                            </Col>
                        </Row>
                    </div>);
                }
            });
        }
        return {totalMatch, matching, done, matchDom};
    }
    onMatchClick = (id) => {
        const history = this.props.history;
        history.push(`/football/footballMatch/${id}`);
    }

    render() {
        const {total, living} = this.getLiveDetail();
        const {totalMatch, matching, done, matchDom} = this.getMatchDetail();
        return (
            <div className="gutter-example button-demo">
                <Row gutter={10}>
                    <Col className="gutter-row" md={4}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="heart" className="text-2x text-danger"/>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">直播</div>
                                        <h2>{total}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="cloud" className="text-2x"/>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">近期比赛</div>
                                        <h2>{totalMatch}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={4}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="camera" className="text-2x text-info"/>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">正在直播</div>
                                        <h2>{living}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="mail" className="text-2x text-success"/>
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">正在比赛</div>
                                        <h2>{matching}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={16}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{height: 214}}>
                                <div className="w-full center"><img src={logo} className="round-img"/></div>
                                <span style={{fontSize:20}} className="w-full center mt-s">欢迎来到全国青少年校园足球赛事后台管理</span>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col className="gutter-row" md={8}>
                        <div className="gutter-box">
                            <Card bordered={false} style={{height: 460, overflowY: "scroll"}}>
                                <div className="pb-m">
                                    <h3>近期比赛</h3>
                                    <small>{matching}场正在进行中，{done}场已完场，{totalMatch - done - matching}场未开始</small>
                                </div>
                                <a className="card-tool"><Icon type="sync"/></a>
                                {matchDom}
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={16}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="pb-m">
                                    <h3>访问量统计</h3>
                                    <small>最近7天用户访问量</small>
                                </div>
                                <a className="card-tool"><Icon type="sync"/></a>
                                <EchartsViews/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;