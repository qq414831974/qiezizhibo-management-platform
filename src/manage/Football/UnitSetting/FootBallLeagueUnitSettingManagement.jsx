import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Avatar} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../utils";
import {
    getLeagueRegistrationRule,
    addLeagueRegistrationRule,
    updateLeagueRegistrationRule,
    getLeagueMatchManagementRule,
    addLeagueMatchManagementRule,
    updateLeagueMatchManagementRule,
    getLeagueUnitSettingRule,
    addLeagueUnitSettingRule,
    updateLeagueUnitSettingRule,
    getLeagueMatchById,
} from "../../../axios";
import LeagueRegistrationForm from "../Registration/LeagueRegistrationForm";
import LeagueMatchManagementForm from "./matchManagement/LeagueMatchManagementForm";
import LeagueUnitSettingForm from "./LeagueUnitSettingForm";
import defultAvatar from "../../../static/avatar.jpg";

const TabPane = Tabs.TabPane;

class FootBallLeagueRegistrationManagement extends React.Component {
    state = {
        data: {},
        data_matchManagement: {},
        data_unitSetting: {},
        leagueData: {},
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        this.fetch({leagueId: currentLeague})
    }
    fetch = (params = {}) => {
        getLeagueRegistrationRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛报名规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getLeagueMatchManagementRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data_matchManagement: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛组委会比赛管理规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getLeagueUnitSettingRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data_unitSetting: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛组委会设置规则失败：' + (data ? data.result + "-" + data.message : data), 3);
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
    saveRegistrationSettingRef = (form) => {
        this.form = form;
    }
    saveMatchManagementSettingRef = (form) => {
        this.form_matchManagement = form;
    }
    saveUnitSettingRef = (form) => {
        this.form_unitSetting = form;
    }
    handleRegistrationSettingSubmit = (e) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = currentLeague;
            this.setState({modifyLoading: true})
            if (this.state.data && this.state.data.id) {
                updateLeagueRegistrationRule(values).then(data => {
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
                addLeagueRegistrationRule(values).then(data => {
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
    handleMatchManagementSettingSubmit = (e) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        e.preventDefault();
        const form = this.form_matchManagement;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = currentLeague;
            this.setState({modifyLoading: true})
            if (this.state.data_matchManagement && this.state.data_matchManagement.id) {
                updateLeagueMatchManagementRule(values).then(data => {
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
                addLeagueMatchManagementRule(values).then(data => {
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
    handleUnitSettingSubmit = (e) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        e.preventDefault();
        const form = this.form_unitSetting;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = currentLeague;
            this.setState({modifyLoading: true})
            if (this.state.data_unitSetting && this.state.data_unitSetting.id) {
                updateLeagueUnitSettingRule(values).then(data => {
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
                addLeagueUnitSettingRule(values).then(data => {
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
    onRegistrationDetailClick = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const history = this.props.history;
        history.push(`/football/league/registration/team?leagueId=${currentLeague}`);
    }

    render() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const RegistrationSetting = Form.create()(LeagueRegistrationForm);
        const MatchManagementSetting = Form.create()(LeagueMatchManagementForm);
        const UnitSettingForm = Form.create()(LeagueUnitSettingForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="组委会设置" second="联赛"/>
                <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""}
                      bordered={false}
                      title={<div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                          <Avatar
                              src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                          <span className="ml-s">{this.state.leagueData.name}</span>
                      </div>}>
                    <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""}>
                        <UnitSettingForm
                            visible={true}
                            record={this.state.data_unitSetting}
                            handleSubmit={this.handleUnitSettingSubmit}
                            modifyLoading={this.state.modifyLoading}
                            ref={this.saveUnitSettingRef}/>
                    </Card>
                    <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""}
                          title="报名设置">
                        <Tabs onChange={(e) => {
                            if (e == "2") {
                                this.onRegistrationDetailClick()
                            }
                        }}>
                            <TabPane tab="报名设置" key="1">
                                <span className="w-full center" style={{fontSize: 20}}>
                                    {this.state.data && this.state.data.id != null ? "已设置报名" : <span className="danger">未设置报名</span>}
                                </span>
                                <RegistrationSetting
                                    visible={true}
                                    record={this.state.data}
                                    handleSubmit={this.handleRegistrationSettingSubmit}
                                    modifyLoading={this.state.modifyLoading}
                                    ref={this.saveRegistrationSettingRef}/>
                            </TabPane>
                            <TabPane tab="报名详情" key="2">
                                <Button type="primary" onClick={this.onRegistrationDetailClick}>查看</Button>
                            </TabPane>
                        </Tabs>
                    </Card>
                    <Card className={this.props.responsive.data.isMobile ? "no-padding mt-l" : "mt-l"}
                          title="组委会比赛管理设置">
                        <MatchManagementSetting
                            visible={true}
                            record={this.state.data_matchManagement}
                            handleSubmit={this.handleMatchManagementSettingSubmit}
                            modifyLoading={this.state.modifyLoading}
                            ref={this.saveMatchManagementSettingRef}/>
                    </Card>
                </Card>
            </div>
        )
            ;
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueRegistrationManagement);