import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Tooltip} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getMatchChargeRule,
    addMatchChargeRule,
    updateMatchChargeRule,
} from "../../../../axios";
import MatchChargeForm from "./MatchChargeForm";
import NP from 'number-precision'

const TabPane = Tabs.TabPane;

class FootBallMatchChargeManagement extends React.Component {
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
        this.setState({loading: true})
        getMatchChargeRule(params).then((data) => {
            this.setState({loading: false})
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取比赛充值规则失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    saveChargeSettingRef = (form) => {
        this.form = form;
    }
    handleChargeSettingSubmit = (e) => {
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        e.preventDefault();
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.matchId = currentMatch;
            if (values.record) {
                values.record.price = NP.times(values.record.price, 100)
                values.record.priceMonthly = NP.times(values.record.priceMonthly, 100)
                if (values.record.giftWatchPrice) {
                    values.record.giftWatchPrice = NP.times(values.record.giftWatchPrice, 100)
                }
                if (values.record.giftWatchPriceMonthly) {
                    values.record.giftWatchPriceMonthly = NP.times(values.record.giftWatchPriceMonthly, 100)
                }
            }
            if (values.live) {
                if (values.live.price) {
                    values.live.price = NP.times(values.live.price, 100)
                }
                if (values.live.priceMonthly) {
                    values.live.priceMonthly = NP.times(values.live.priceMonthly, 100)
                }
                if (values.live.giftWatchEnable) {
                    values.live.giftWatchPrice = 0
                    values.live.giftWatchPriceMonthly = 0
                }
            }
            if (values.monopoly) {
                values.monopoly.price = NP.times(values.monopoly.price, 100)
            }
            this.setState({modifyLoading: true})
            if (this.state.data && this.state.data.id) {
                updateMatchChargeRule(values).then(data => {
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
                addMatchChargeRule(values).then(data => {
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
        const ChargeSetting = Form.create()(MatchChargeForm);

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="充值" second="比赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""}
                                  bordered={false}>
                                <Tabs>
                                    <TabPane tab="充值设置" key="1">
                                        <div style={{minHeight: 32, marginBottom: 10}}>
                                            <Tooltip title="刷新">
                                                <Button type="primary" shape="circle" icon="reload"
                                                        className="pull-right"
                                                        loading={this.state.loading}
                                                        onClick={this.refresh}/>
                                            </Tooltip>
                                        </div>
                                        <ChargeSetting
                                            visible={true}
                                            record={this.state.data}
                                            handleSubmit={this.handleChargeSettingSubmit}
                                            modifyLoading={this.state.modifyLoading}
                                            ref={this.saveChargeSettingRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchChargeManagement);