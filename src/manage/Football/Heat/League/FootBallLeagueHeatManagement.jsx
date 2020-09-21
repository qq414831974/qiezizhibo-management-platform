import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form} from 'antd';
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
    leagueHeatAllMatch, updateMatchById
} from "../../../../axios";
import LeagueHeatForm from "../League/LeagueHeatForm";
import LeagueFansManagement from "../League/LeagueFansManagement";

const TabPane = Tabs.TabPane;

class FootBallLeagueHeatManagement extends React.Component {
    state = {
        data: {},
    }

    componentDidMount() {
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
    }
    saveHeatSettingRef = (form) => {
        this.form = form;
    }
    heatAll = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        leagueHeatAllMatch({leagueId: currentLeague}).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('修改成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
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
            if (this.state.data && this.state.data.id) {
                updateLeagueHeatRule(values).then(data => {
                    if (data && data.code == 200) {
                        if (data.data) {
                            this.refresh();
                            message.success('修改成功', 1);
                        } else {
                            message.warn(data.message, 1);
                        }
                    } else {
                        message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
                    }
                })
            } else {
                addLeagueHeatRule(values).then(data => {
                    if (data && data.code == 200) {
                        if (data.data) {
                            this.refresh();
                            message.success('添加成功', 1);
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

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="热度比拼" second="联赛"/>
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
                                            heatAll={this.heatAll}
                                            ref={this.saveHeatSettingRef}/>
                                    </TabPane>
                                    <TabPane tab="粉丝团" key="2">
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