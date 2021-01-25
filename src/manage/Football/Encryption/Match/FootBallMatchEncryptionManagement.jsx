import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getMatchEncryptionRule,
    addMatchEncryptionRule,
    updateMatchEncryptionRule, getMatchById,
} from "../../../../axios";
import MatchEncryptionForm from "./MatchEncryptionForm";
import FootBallMatchPlayersMediaPanel from "../../Match/Media/FootBallMatchPlayersMediaPanel";

const TabPane = Tabs.TabPane;

class FootBallMatchEncryptionManagement extends React.Component {
    state = {
        data: {},
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        this.fetch({matchId: currentMatch})
        if (this.props.location.search) {
            let currentTab = getQueryString(this.props.location.search, "tab");
            if (currentTab == null) {
                currentTab = 1;
            }
            this.setState({currentTab: currentTab.toString()});
        }
    }
    fetch = (params = {}) => {
        getMatchEncryptionRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取比赛加密规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        this.setState({matchLoading: true})
        getMatchById(params.matchId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    match: data.data,
                    matchLoading: false
                });
            }
        });
    }

    saveEncryptionSettingRef = (form) => {
        this.form = form;
    }
    handleEncryptionSettingSubmit = (e) => {
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.matchId = currentMatch;
            this.setState({modifyLoading: true})
            if (this.state.data && this.state.data.id) {
                updateMatchEncryptionRule(values).then(data => {
                    this.setState({modifyLoading: false})
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
                addMatchEncryptionRule(values).then(data => {
                    this.setState({modifyLoading: false})
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
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        const EncryptionSetting = Form.create()(MatchEncryptionForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="加密" second="比赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}>
                                <Tabs activeKey={this.state.currentTab} onChange={(value) => {
                                    this.setState({currentTab: value});
                                    this.props.history.replace(`/football/match/encryption?matchId=${currentMatch}&tab=${value}`)
                                }}>
                                    <TabPane tab="加密设置" key="1">
                                        <div className="w-full center" style={{
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}>{this.state.data && this.state.data.id ? "已开启加密" : "未开启加密"}</div>
                                        <EncryptionSetting
                                            visible={this.state.currentTab == 1 ? true : false}
                                            record={this.state.data}
                                            handleSubmit={this.handleEncryptionSettingSubmit}
                                            ref={this.saveEncryptionSettingRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchEncryptionManagement);