import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getLeagueBetRule,
    addLeagueBetRule,
    updateLeagueBetRule,
    deleteLeagueBetRule,
    leagueBetAllMatch,
} from "../../../../axios";
import LeagueBetForm from "../League/LeagueBetForm";

const TabPane = Tabs.TabPane;

class FootBallLeagueBetManagement extends React.Component {
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
        getLeagueBetRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛竞猜规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    saveBetSettingRef = (form) => {
        this.form = form;
    }
    betAll = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        this.setState({betAllLoading: true})
        leagueBetAllMatch({leagueId: currentLeague}).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('修改成功', 1);
                    this.refresh();
                } else {
                    message.warn(data.message, 1);
                }
                this.setState({betAllLoading: false})
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }
    handleBetSettingSubmit = (e) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.leagueId = currentLeague;
            if (values.settleExpireInterval) {
                values.settleExpireInterval = values.settleExpireInterval * 24 * 60;
            }
            this.setState({modifyLoading: true})
            if (this.state.data && this.state.data.id) {
                updateLeagueBetRule(values).then(data => {
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
                addLeagueBetRule(values).then(data => {
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
        const BetSetting = Form.create()(LeagueBetForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="竞猜" second="联赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}>
                                <Tabs>
                                    <TabPane tab="竞猜设置" key="1">
                                        <div className="w-full center" style={{
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}>{this.state.data && this.state.data.id ? "已开启竞猜" : "未开启竞猜"}</div>
                                        <BetSetting
                                            visible={true}
                                            record={this.state.data}
                                            handleSubmit={this.handleBetSettingSubmit}
                                            betAll={this.betAll}
                                            betAllLoading={this.state.betAllLoading}
                                            modifyLoading={this.state.modifyLoading}
                                            ref={this.saveBetSettingRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueBetManagement);