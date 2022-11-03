import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Avatar} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getLeagueBbsRule,
    addLeagueBbsRule,
    updateLeagueBbsRule,
    getLeagueMatchById,
} from "../../../../axios";
import LeagueBbsForm from "./LeagueBbsForm";
import defultAvatar from "../../../../static/avatar.jpg";

const TabPane = Tabs.TabPane;

class FootBallLeagueBbsManagement extends React.Component {
    state = {
        data: {},
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
        getLeagueBbsRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛论坛规则失败：' + (data ? data.result + "-" + data.message : data), 3);
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
    saveBbsSettingRef = (form) => {
        this.form = form;
    }
    handleBbsSettingSubmit = (e) => {
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
                updateLeagueBbsRule(values).then(data => {
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
                addLeagueBbsRule(values).then(data => {
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
        const BbsSetting = Form.create()(LeagueBbsForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="论坛" second="联赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false} title={<div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                <Avatar src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                                <span className="ml-s">{this.state.leagueData.name}</span>
                            </div>}>
                                <Tabs>
                                    <TabPane tab="论坛设置" key="1">
                                        <div className="w-full center" style={{
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}>{this.state.data && this.state.data.id ? "已开启论坛" : "未开启论坛"}</div>
                                        <BbsSetting
                                            visible={true}
                                            record={this.state.data}
                                            handleSubmit={this.handleBbsSettingSubmit}
                                            modifyLoading={this.state.modifyLoading}
                                            ref={this.saveBbsSettingRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueBbsManagement);