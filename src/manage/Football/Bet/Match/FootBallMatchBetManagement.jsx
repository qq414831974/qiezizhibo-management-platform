import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getMatchBetRule,
    addMatchBetRule,
    updateMatchBetRule,
} from "../../../../axios";
import MatchBetForm from "../Match/MatchBetForm";

const TabPane = Tabs.TabPane;

class FootBallMatchBetManagement extends React.Component {
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
        getMatchBetRule(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取比赛竞猜规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    saveBetSettingRef = (form) => {
        this.form = form;
    }
    handleBetSettingSubmit = (e) => {
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.matchId = currentMatch;
            if (values.settleExpireInterval) {
                values.settleExpireInterval = values.settleExpireInterval * 24 * 60;
            }
            this.setState({modifyLoading: true})
            if (this.state.data && this.state.data.id) {
                updateMatchBetRule(values).then(data => {
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
                addMatchBetRule(values).then(data => {
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
        const BetSetting = Form.create()(MatchBetForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="竞猜" second="比赛"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchBetManagement);