import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getMatchHeatRule,
    addMatchHeatRule,
    updateMatchHeatRule,
    deleteMatchHeatRule,
    getMatchById,
    getMatchPlayersByTeamId,
} from "../../../../axios";
import MatchHeatForm from "../Match/MatchHeatForm";
import MatchHeatTable from "../Match/MatchHeatTable";
import MatchGiftOrderTable from "./MatchGiftOrderTable";

const TabPane = Tabs.TabPane;

class FootBallMatchHeatManagement extends React.Component {
    state = {
        data: {},
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        this.fetch({matchId: currentMatch})
    }
    fetch = (params = {}) => {
        getMatchHeatRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取比赛热度规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getMatchById(params.matchId).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    match: data.data ? data.data : {},
                });
                let players = [];
                getMatchPlayersByTeamId(null, data.data.hostTeamId).then(res => {
                    players = players.concat(res.data.records)
                    getMatchPlayersByTeamId(null, data.data.guestTeamId).then(res => {
                        players = players.concat(res.data.records)
                        this.setState({
                            players: players,
                        });
                    })
                })
            } else {
                message.error('获取比赛信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }
    saveHeatSettingRef = (form) => {
        this.form = form;
    }
    handleHeatSettingSubmit = (e) => {
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.matchId = currentMatch;
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
                updateMatchHeatRule(values).then(data => {
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
                addMatchHeatRule(values).then(data => {
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
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        const HeatSetting = Form.create()(MatchHeatForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="热度比拼" second="比赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}>
                                <Tabs>
                                    <TabPane tab="热度比拼设置" key="1">
                                        <div className="w-full center" style={{
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}>{this.state.data && this.state.data.id ? "已开启热度比拼" : "未开启热度比拼"}</div>
                                        <HeatSetting
                                            visible={true}
                                            record={this.state.data}
                                            handleSubmit={this.handleHeatSettingSubmit}
                                            modifyLoading={this.state.modifyLoading}
                                            ref={this.saveHeatSettingRef}/>
                                    </TabPane>
                                    {this.state.data && this.state.data.id ? <TabPane tab="热度比拼详情" key="2">
                                        <MatchHeatTable
                                            matchId={currentMatch}
                                            heatRule={this.state.data}
                                            match={this.state.match}
                                            players={this.state.players}/>
                                    </TabPane> : null}
                                    <TabPane tab="送礼物详情" key="3">
                                        <MatchGiftOrderTable matchId={currentMatch}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchHeatManagement);