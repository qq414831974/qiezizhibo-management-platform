import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Avatar} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getLeagueHeatRule,
    addLeagueHeatRule,
    updateLeagueHeatRule,
    deleteLeagueHeatRule,
    getLeagueGiftRule,
    addLeagueGiftRule,
    updateLeagueGiftRule,
    deleteLeagueGiftRule,
    leagueHeatAllMatch, updateMatchById, getLeagueMatchById
} from "../../../../axios";
import LeagueHeatForm from "../League/LeagueHeatForm";
import LeagueGiftForm from "../League/LeagueGiftForm";
import LeagueFansManagement from "../League/LeagueFansManagement";
import LeagueHeatTable from "../League/LeagueHeatTable";
import LeagueCashSettlementTable from "../League/LeagueCashSettlementTable";
import LeagueCashOrderTable from "../League/LeagueCashOrderTable";
import LeagueGiftOrderTable from "../League/LeagueGiftOrderTable";
import defultAvatar from "../../../../static/avatar.jpg";

const TabPane = Tabs.TabPane;

class FootBallLeagueHeatManagement extends React.Component {
    leagueId = null;
    state = {
        currentTab: "1",
        data: {},
        leagueData: {},
    }

    componentDidMount() {
        if (this.props.location.search) {
            const currentTab = getQueryString(this.props.location.search, "tab");
            if (currentTab) {
                this.setState({currentTab: currentTab.toString()});
            }
            this.leagueId = getQueryString(this.props.location.search, "leagueId");
        }
        this.refresh();
    }

    refresh = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        this.fetch({leagueId: currentLeague})
    }
    fetch = (params = {}) => {
        getLeagueHeatRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛热度规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getLeagueGiftRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    giftData: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛礼物规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getLeagueMatchById(params.leagueId).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    leagueData: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }
    saveHeatSettingRef = (form) => {
        this.form = form;
    }
    saveGiftSettingRef = (form) => {
        this.form_gift = form;
    }
    heatAll = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        this.setState({heatAllLoading: true})
        leagueHeatAllMatch({leagueId: currentLeague}).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('修改成功', 1);
                    this.refresh();
                } else {
                    message.warn(data.message, 1);
                }
                this.setState({heatAllLoading: false})
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }
    handleHeatSettingSubmit = (e) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = currentLeague;
            if (values.roundInfos) {
                const keys = Object.keys(values.roundInfos);
                if (keys.length < values.round) {
                    message.error('轮次信息不能小于设置的轮次数量', 5);
                    return;
                }
                let roundInfos = {};
                for (let key of keys) {
                    if (key != null && values.roundInfos[key] != null) {
                        values.roundInfos[key].startTime = values.roundInfos[key].startTime ? values.roundInfos[key].startTime.format('YYYY/MM/DD HH:mm:ss') : null;
                        values.roundInfos[key].endTime = values.roundInfos[key].endTime ? values.roundInfos[key].endTime.format('YYYY/MM/DD HH:mm:ss') : null;
                        if (values.roundInfos[key].startTime == null || values.roundInfos[key].endTime == null) {
                            message.error('轮次信息时间设置错误', 5);
                            return;
                        }
                        roundInfos[key] = values.roundInfos[key];
                    }
                }
                values.roundInfos = roundInfos;
            }
            this.setState({modifyLoading: true})
            if (values.type != 2) {
                values.cashAvailable = false;
            }
            if (values.cashPercentMap) {
                let cashPercentMap = {};
                for (let key of Object.keys(values.cashPercentMap)) {
                    if (key != null && values.cashPercentMap[key] != null) {
                        cashPercentMap[key] = values.cashPercentMap[key];
                    }
                }
                values.cashPercentMap = cashPercentMap;
            }
            if (this.state.data && this.state.data.id) {
                updateLeagueHeatRule(values).then(data => {
                    this.setState({modifyLoading: false})
                    if (data && data.code == 200) {
                        if (data.data) {
                            message.success('修改成功', 1);
                            this.refresh();
                        } else {
                            message.warn(data.message, 1);
                        }
                    } else {
                        message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
                    }
                })
            } else {
                addLeagueHeatRule(values).then(data => {
                    this.setState({modifyLoading: false})
                    if (data && data.code == 200) {
                        if (data.data) {
                            message.success('修改成功', 1);
                            this.refresh();
                        } else {
                            message.warn(data.message, 1);
                        }
                    } else {
                        message.error('添加失败：' + (data ? data.result + "-" + data.message : data), 3);
                    }
                })
            }
        });
    }
    handleGiftSettingSubmit = (e) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        e.preventDefault();

        const form = this.form_gift;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = currentLeague;
            if (values.giftList == null) {
                return;
            }
            values.giftList = values.giftList.filter(item => typeof item == 'number')
            this.setState({modifyLoading: true})
            if (this.state.giftData && this.state.giftData.id) {
                updateLeagueGiftRule(values).then(data => {
                    this.setState({modifyLoading: false})
                    if (data && data.code == 200) {
                        if (data.data) {
                            message.success('修改成功', 1);
                            this.refresh();
                        } else {
                            message.warn(data.message, 1);
                        }
                    } else {
                        message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
                    }
                })
            } else {
                addLeagueGiftRule(values).then(data => {
                    this.setState({modifyLoading: false})
                    if (data && data.code == 200) {
                        if (data.data) {
                            message.success('修改成功', 1);
                            this.refresh();
                        } else {
                            message.warn(data.message, 1);
                        }
                    } else {
                        message.error('添加失败：' + (data ? data.result + "-" + data.message : data), 3);
                    }
                })
            }
        });
    }

    render() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const HeatSetting = Form.create()(LeagueHeatForm);
        const GiftSetting = Form.create()(LeagueGiftForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="热度比拼" second="联赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}
                                  title={<div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                      <Avatar
                                          src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                                      <span className="ml-s">{this.state.leagueData.name}</span>
                                  </div>}>
                                <Tabs activeKey={this.state.currentTab} onChange={(value) => {
                                    this.setState({currentTab: value});
                                    this.props.history.replace(`/football/league/heat?leagueId=${this.leagueId}&tab=${value}`)
                                }}>
                                    <TabPane tab="热度比拼设置" key="1">
                                        <div className="w-full center" style={{
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}>{this.state.data && this.state.data.id ? "已开启热度比拼" : "未开启热度比拼"}</div>
                                        <HeatSetting
                                            visible={true}
                                            record={this.state.data}
                                            handleSubmit={this.handleHeatSettingSubmit}
                                            heatAll={this.heatAll}
                                            heatAllLoading={this.state.heatAllLoading}
                                            modifyLoading={this.state.modifyLoading}
                                            ref={this.saveHeatSettingRef}/>
                                    </TabPane>
                                    <TabPane tab="礼物设置" key="2">
                                        <GiftSetting
                                            record={this.state.giftData}
                                            handleSubmit={this.handleGiftSettingSubmit}
                                            modifyLoading={this.state.modifyLoading}
                                            ref={this.saveGiftSettingRef}/>
                                    </TabPane>
                                    {this.state.data && this.state.data.id && (this.state.data.type == 2 || this.state.data.type == 3) ?
                                        <TabPane tab="联赛热度比拼详情" key="3">
                                            <LeagueHeatTable
                                                leagueId={currentLeague}
                                                heatRule={this.state.data}/>
                                            {this.state.data && this.state.data.cashAvailable ?
                                                <div>
                                                    <div className="w-full center"
                                                         style={{
                                                             fontSize: 16,
                                                             fontWeight: 'bold'
                                                         }}>
                                                        提现金额结算
                                                    </div>
                                                    <LeagueCashSettlementTable
                                                        leagueId={currentLeague}
                                                        heatRule={this.state.data}
                                                    />
                                                </div> : null}
                                        </TabPane> : null}
                                    <TabPane tab="送礼物详情" key="4">
                                        <LeagueGiftOrderTable leagueId={currentLeague}/>
                                    </TabPane>
                                    {this.state.data && this.state.data.cashAvailable ?
                                        <TabPane tab="联赛提现管理" key="5">
                                            <LeagueCashOrderTable
                                                leagueId={currentLeague}
                                                heatRule={this.state.data}/>
                                        </TabPane>
                                        : null}
                                    <TabPane tab="粉丝团" key="6">
                                        <LeagueFansManagement
                                            visible={true}
                                            leagueId={currentLeague}/>
                                    </TabPane>
                                </Tabs>
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
    console.log(state)

    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueHeatManagement);