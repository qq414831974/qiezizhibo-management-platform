import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Avatar, Modal, Checkbox} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getLeagueMatchById,
    leagueBetAllMatch,
    leagueChargeAllMatch,
    leagueClipAllMatch, leagueEncryptionAllMatch,
    leagueHeatAllMatch,
} from "../../../../axios";
import defultAvatar from "../../../../static/avatar.jpg";
import {Link} from "react-router-dom";

const TabPane = Tabs.TabPane;

class FootBallLeagueDetailSetting extends React.Component {
    state = {
        data: {},
        leagueData: {},
        checkedValues: ["charge", "heat", "bet", "clip", "encryption"]
    }

    componentDidMount() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return;
        }
        this.refresh();
    }

    refresh = () => {
        const currentLeague = this.props.match.params.id;
        this.fetch({leagueId: currentLeague})
    }
    fetch = (params = {}) => {
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
    handleApplyAll = () => {
        const leagueId = this.props.match.params.id;
        const checkedValues = this.state.checkedValues;
        if (checkedValues.includes("charge")) {
            this.setState({chargeAllLoading: true})
            leagueChargeAllMatch({leagueId: leagueId}).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        message.success('收费应用成功', 1);
                        // this.refresh();
                    } else {
                        message.warn(data.message, 1);
                    }
                    this.setState({chargeAllLoading: false})
                } else {
                    message.error('收费应用失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })

        }
        if (checkedValues.includes("heat")) {
            this.setState({heatAllLoading: true})
            leagueHeatAllMatch({leagueId: leagueId}).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        message.success('热度应用成功', 1);
                        // this.refresh();
                    } else {
                        message.warn(data.message, 1);
                    }
                    this.setState({heatAllLoading: false})
                } else {
                    message.error('热度应用失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })
        }
        if (checkedValues.includes("bet")) {
            this.setState({betAllLoading: true})
            leagueBetAllMatch({leagueId: leagueId}).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        message.success('竞猜应用成功', 1);
                        // this.refresh();
                    } else {
                        message.warn(data.message, 1);
                    }
                    this.setState({betAllLoading: false})
                } else {
                    message.error('竞猜应用失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })
        }
        if (checkedValues.includes("clip")) {
            this.setState({clipAllLoading: true})
            leagueClipAllMatch({leagueId: leagueId}).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        message.success('自动剪辑应用成功', 1);
                        // this.refresh();
                    } else {
                        message.warn(data.message, 1);
                    }
                    this.setState({clipAllLoading: false})
                } else {
                    message.error('自动剪辑应用失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })
        }
        if (checkedValues.includes("encryption")) {
            this.setState({encryptionAllLoading: true})
            leagueEncryptionAllMatch({leagueId: leagueId}).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        message.success('加密应用成功', 1);
                        // this.refresh();
                    } else {
                        message.warn(data.message, 1);
                    }
                    this.setState({encryptionAllLoading: false})
                } else {
                    message.error('加密应用失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })
        }
    }
    onApplyConfirmClick = () => {
        this.setState({applyConfirmShow: true})
    }
    onApplyCancelClick = () => {
        this.setState({applyConfirmShow: false})
    }
    onCheckChange = (checkedValues) => {
        this.setState({checkedValues: checkedValues})
    }

    render() {
        const leagueId = this.props.match.params.id;

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="设置" second="联赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile ? "no-padding" : ""} bordered={false}
                                  title={<div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                      <Avatar
                                          src={this.state.leagueData.headImg ? this.state.leagueData.headImg : defultAvatar}/>
                                      <span className="ml-s">{this.state.leagueData.name}</span>
                                  </div>}>
                                <div className="w-full center">
                                    <Button key="charge" loading={this.state.chargeAllLoading} type="primary">
                                        <Link to={
                                            `/football/league/charge?leagueId=${leagueId}`
                                        }>收费</Link>
                                    </Button>
                                    <Button key="heat" loading={this.state.heatAllLoading} type="primary">
                                        <Link to={
                                            `/football/league/heat?leagueId=${leagueId}`
                                        }>热度</Link>
                                    </Button>
                                    <Button key="bet" loading={this.state.betAllLoading} type="primary">
                                        <Link to={
                                            `/football/league/bet?leagueId=${leagueId}`
                                        }>竞猜</Link>
                                    </Button>
                                    <Button key="clip" loading={this.state.clipAllLoading} type="primary">
                                        <Link to={
                                            `/football/league/clip?leagueId=${leagueId}`
                                        }>剪辑</Link>
                                    </Button>
                                    <Button key="encryption" loading={this.state.encryptionAllLoading} type="primary">
                                        <Link to={
                                            `/football/league/encryption?leagueId=${leagueId}`
                                        }>加密</Link>
                                    </Button>
                                    {/*<Button key="ad" type="primary"><Link to={*/}
                                    {/*    `/football/league/ad?leagueId=${leagueId}`*/}
                                    {/*}>广告</Link>*/}
                                    {/*</Button>*/}
                                    <Button key="registration" type="primary">
                                        <Link to={
                                            `/football/league/unit?leagueId=${leagueId}`
                                        }>组委会设置</Link>
                                    </Button>
                                </div>
                                <div className="w-full center mt-l">
                                    <Button key="all" type="primary" onClick={this.onApplyConfirmClick}>
                                        全部一键应用
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Modal
                    key="dialog-all"
                    title="确认应用"
                    visible={this.state.applyConfirmShow}
                    onOk={this.handleApplyAll}
                    onCancel={this.onApplyCancelClick}
                    zIndex={1001}
                >
                    <Checkbox.Group style={{width: '100%'}}
                                    className="mb-s"
                                    value={this.state.checkedValues}
                                    onChange={this.onCheckChange}>
                        <Row>
                            <Col span={24} className="mt-s">
                                <Checkbox value="charge">收费</Checkbox>
                            </Col>
                            <Col span={24} className="mt-s">
                                <Checkbox value="heat">热度</Checkbox>
                            </Col>
                            <Col span={24} className="mt-s">
                                <Checkbox value="bet">竞猜</Checkbox>
                            </Col>
                            <Col span={24} className="mt-s">
                                <Checkbox value="clip">剪辑</Checkbox>
                            </Col>
                            <Col span={24} className="mt-s">
                                <Checkbox value="encryption">加密</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                    <span style={{fontSize: 14}}>是否确认将以上设置应用到该联赛中的全部比赛？</span>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueDetailSetting);