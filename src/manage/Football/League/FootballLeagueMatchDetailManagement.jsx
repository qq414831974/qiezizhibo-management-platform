import React from 'react';
import {
    Form,
    Avatar,
    Button,
    Row,
    Col,
    List,
    Card,
    Modal,
    Radio,
    Switch,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    getLeagueMatchById,
    getLeagueTeam,
    addTeamToLeague,
    updateTeamInLeague,
    deleteTeamInLeague,
    getLeaguePlayer,
    addLeaguePlayer,
    updatePlayerInLeague,
    delPlayerInLeague,
    updateLeagueMatchById,
    genLeagueTeamRank,
    genLeaguePlayerRank,
    genLeagueReport,
    getLeagueReport,
} from "../../../axios/index";
import avatar from '../../../static/avatar.jpg';
import logo from '../../../static/logo.png';
import {Link, Redirect} from 'react-router-dom';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import FootBallLeagueMatchAddTeamDialog from "./FootBallLeagueMatchAddTeamDialog";
import FootBallLeagueMatchModifyTeamDialog from "./FootBallLeagueMatchModifyTeamDialog";
import FootBallLeagueMatchAddPlayerDialog from "./FootBallLeagueMatchAddPlayerDialog";
import FootBallLeagueMatchModifyPlayerDialog from "./FootBallLeagueMatchModifyPlayerDialog";
import {message} from "antd/lib/index";

moment.locale('zh-cn');

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class FootballLeagueMatchDetailManagement extends React.Component {
    state = {teamList: [], playerList: [], teamSwitch: true, playerSwitch: true}

    componentDidMount() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return;
        }
        this.fetch();
    }

    fetch = () => {
        getLeagueMatchById(this.props.match.params.id).then(data => {
            if(data && data.code == 200  && data.data){
                this.setState({
                    data: data.data,
                    teamListloading: true,
                    teamSwitch: data.data.showleagueteam,
                    playerSwitch: data.data.showleagueplayer
                });
                if (data.data && data.data.id) {
                    getLeagueTeam({leagueId: data.data.id}).then(res => {
                        if (res && res.code == 200) {
                            this.setState({teamList: res.data, teamListloading: false});
                        }
                    })
                }
            }
        });
        this.setState({playerListLoading: true});
        getLeaguePlayer({leagueId: this.props.match.params.id}).then(data => {
            if (data && data.code == 200) {
                this.setState({playerList: data.data, playerListLoading: false});
            } else {
                this.setState({playerListLoading: false});
            }
        });
        getLeagueReport(this.props.match.params.id).then(data => {
            if(data && data.code == 200){
                this.setState({reportUrl: data.data.url});
            }
        })
    }
    refresh = () => {
        this.fetch();
    }
    refreshReport = () => {
        getLeagueReport(this.props.match.params.id).then(data => {
            if(data && data.code == 200){
                this.setState({reportUrl: data.data.url});
            }
        })
    }
    onAddTeamClick = (e) => {
        this.setState({addTeamVisible: true});
    }
    onAddPlayerClick = (e) => {
        this.setState({addPlayerVisible: true});
    }
    onTeamClick = (record) => {
        this.setState({currentTeam: record, modifyTeamVisible: true});
    }
    onPlayerClick = (record) => {
        this.setState({currentPlayer: record, modifyPlayerVisible: true});
    }
    handleAddPlayerOK = () => {
        const form = this.addPlayerForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addLeaguePlayer(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({addPlayerVisible: false});
        });
    }
    handleAddTeamOK = () => {
        const form = this.addTeamForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addTeamToLeague(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({addTeamVisible: false});
        });
    }
    handleModifyPlayerOK = () => {
        const form = this.modifyPlayerForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updatePlayerInLeague(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({modifyPlayerVisible: false});
        });
    }
    handleModifyTeamOK = () => {
        const form = this.modifyTeamForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateTeamInLeague(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({modifyTeamVisible: false});
        });
    }
    handleAddTeamCancel = () => {
        this.setState({addTeamVisible: false});
    }
    handleAddPlayerCancel = () => {
        this.setState({addPlayerVisible: false});
    }
    saveAddTeamDialogRef = (form) => {
        this.addTeamForm = form;
    }
    saveAddPlayerDialogRef = (form) => {
        this.addPlayerForm = form;
    }
    handleModifyTeamCancel = () => {
        this.setState({modifyTeamVisible: false});
    }
    handleModifyPlayerCancel = () => {
        this.setState({modifyPlayerVisible: false});
    }
    saveModifyTeamDialogRef = (form) => {
        this.modifyTeamForm = form;
    }
    saveModifyPlayerDialogRef = (form) => {
        this.modifyPlayerForm = form;
    }
    handleTeamDelete = () => {
        this.setState({deleteVisible: true, handleDeleteOK: this.handleDeleteTeamOK});
    }
    handlePlayerDelete = () => {
        this.setState({deleteVisible: true, handleDeleteOK: this.handleDeletePlayerOK});
    }
    handleDeletePlayerOK = () => {
        this.state.currentPlayer &&
        delPlayerInLeague({
            leagueId: this.state.currentPlayer.leaguematchId,
            teamId: this.state.currentPlayer.teamId,
            playerId: this.state.currentPlayer.playerId
        }).then(data => {
            this.setState({deleteVisible: false, modifyPlayerVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.success(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleDeleteTeamOK = () => {
        this.state.currentTeam &&
        deleteTeamInLeague({
            leagueId: this.state.currentTeam.leaguematchid,
            teamId: this.state.currentTeam.teamid
        }).then(data => {
            this.setState({deleteVisible: false, modifyTeamVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.success(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    onSortRadioChange = (e) => {
        updateLeagueMatchById({id: this.props.match.params.id, autorankorder: e.target.value}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('修改成功', 1);
                    this.setState({
                        sortradiovalue: e.target.value,
                    });
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    onLeagueTeamSwitchChange = (e) => {
        updateLeagueMatchById({id: this.props.match.params.id, showleagueteam: e}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('修改成功', 1);
                    this.setState({teamSwitch: e});
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    onLeaguePlayerSwitchChange = (e) => {
        updateLeagueMatchById({id: this.props.match.params.id, showleagueplayer: e}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('修改成功', 1);
                    this.setState({playerSwitch: e});
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getGroupLegueTeam = () => {
        let dom = [];
        if (this.state.teamList) {
            const indexes = Object.keys(this.state.teamList).sort();
            indexes.forEach(key => {
                const leagueTeam = this.state.teamList[key];
                dom.push(
                    <List
                        key={key}
                        rowKey={record => record.id}
                        header={key}
                        size="small"
                        dataSource={leagueTeam ? leagueTeam : []}
                        loading={this.state.teamListloading}
                        renderItem={item => (<div className="cell-hover pa-s cursor-hand"
                                                  onClick={this.onTeamClick.bind(this, item)}>
                            <Avatar size="large" src={item.team.headImg ? item.team.headImg : logo}/>
                            <span className="ml-s">{item.team.name}</span>
                            <div className="pull-right pa-s">
                                <span
                                    className="pl-s pr-s">{item.matchTotal ? item.matchTotal : 0}</span>
                                <span
                                    className="pl-s pr-s">{`${item.matchWin ? item.matchWin : 0}/${item.matchDraw ? item.matchDraw : 0}/${item.matchLost ? item.matchLost : 0}`}</span>
                                <span
                                    className="pl-s pr-s">{`${item.totalGoal ? item.totalGoal : 0}/${item.totalGoalLost ? item.totalGoalLost : 0}`}</span>
                                <span className="pl-s pr-s">{item.ranks ? item.ranks : 0}</span>
                            </div>
                        </div>)}
                    />)
            })
        }
        return dom;
    }
    genLeagueTeamRank = () => {
        message.info("正在生成，请稍后", 10)
        genLeagueTeamRank({leagueId: this.state.data.id}).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('生成成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('生成失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    genLeaguePlayerRank = () => {
        message.info("正在生成，请稍后", 10)
        genLeaguePlayerRank({leagueId: this.state.data.id}).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('生成成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('生成失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    genLeagueReport = () => {
        message.info("正在生成，请稍后", 10)
        genLeagueReport(this.state.data.id).then(data => {
            if (data && data.code == 200) {
                if (data.data && data.data.id) {
                    this.refreshReport();
                    message.destroy();
                    message.success('生成成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('生成失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }

    render() {
        const isMobile = this.props.responsive.data.isMobile;
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/football/footballLeagueMatch"/>;
        }
        const AddTeamDialog = Form.create()(FootBallLeagueMatchAddTeamDialog);
        const ModifyTeamDialog = Form.create()(FootBallLeagueMatchModifyTeamDialog);
        const AddPlayerDialog = Form.create()(FootBallLeagueMatchAddPlayerDialog);
        const ModifyPlayerDialog = Form.create()(FootBallLeagueMatchModifyPlayerDialog);
        return (
            <div>
                <BreadcrumbCustom first={<Link to={'/football/footballLeagueMatch'}>联赛管理</Link>} second="详细设置"/>
                <div className="dark-white pa-s">
                    <div className="w-full center">
                        <Avatar size="large"
                                src={this.state.data ? (this.state.data.headImg ? this.state.data.headImg : logo) : logo}/>
                    </div>
                    <div className="w-full center">
                        <span style={{fontSize: 18}}>{this.state.data ? this.state.data.name : "无联赛名"}</span>
                    </div>
                    <div className="w-full center">
                        <span>{this.state.data ? `${this.state.data.dateBegin} - ${this.state.data.dateEnd}` : ""}</span>
                    </div>
                    <div className="w-full center">
                        <Button type="primary" onClick={this.genLeagueReport}>一键生成海报图</Button>
                    </div>
                    <div className="w-full center">
                        {this.state.reportUrl ?
                            <a style={{textDecoration: "underline"}}
                               target="_blank"
                               href={this.state.reportUrl}>
                                <span>{this.state.reportUrl}</span>
                            </a>
                            :
                            <span>暂无海报</span>
                        }
                    </div>
                    <Row gutter={10}>
                        <Col md={12}>
                            <div className="w-full">
                                <div className="w-full center">
                                    <span style={{fontSize: 20, fontWeight: 'bold'}}>积分榜</span>
                                    <Switch checked={this.state.teamSwitch} onChange={this.onLeagueTeamSwitchChange}/>
                                </div>
                                <div className="w-full center">
                                    <Button type="primary" onClick={this.genLeagueTeamRank}>一键生成</Button>
                                </div>
                                <Card className="mt-m" title={<div>
                                    <Button type="primary" shape="circle" icon="plus" onClick={this.onAddTeamClick}/>
                                    <span className="ml-s mr-s">队伍</span>
                                    <Radio.Group onChange={this.onSortRadioChange}
                                                 value={this.state.sortradiovalue ? this.state.sortradiovalue : (this.state.data ? this.state.data.autorankorder : true)}>
                                        <Radio value={true}>自动</Radio>
                                        <Radio value={false}>手动</Radio>
                                    </Radio.Group>
                                    <span className="pull-right pa-s">{"赛   胜/平/负   进/失 积分"}</span>
                                </div>}>
                                    {this.getGroupLegueTeam()}
                                </Card>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="w-full center">
                                <span style={{fontSize: 20, fontWeight: 'bold'}}>球员榜</span>
                                <Switch checked={this.state.playerSwitch} onChange={this.onLeaguePlayerSwitchChange}/>
                            </div>
                            <div className="w-full center">
                                <Button type="primary" onClick={this.genLeaguePlayerRank}>一键生成</Button>
                            </div>
                            <Card className="mt-m" title={<div>
                                <Row gutter={10}>
                                    <Col span={8}>
                                        <Button type="primary" shape="circle" icon="plus" className="inline-block"
                                                onClick={this.onAddPlayerClick}/>
                                        <span className="w-full center inline-block ml-s">球员</span>
                                    </Col>
                                    <Col span={8}>
                                        <span className="w-full center">球队</span>
                                    </Col>
                                    <Col span={8}>
                                        <span className="w-full center">进球</span>
                                    </Col>
                                </Row>
                            </div>}>
                                <List
                                    rowKey={record => record.id}
                                    style={{minHeight: 400}}
                                    size="small"
                                    dataSource={this.state.playerList ? this.state.playerList : []}
                                    loading={this.state.playerListLoading}
                                    renderItem={item => (<Row gutter={10} className="cell-hover pa-s cursor-hand"
                                                              onClick={this.onPlayerClick.bind(this, item)}>
                                        <Col span={8}>
                                            <Avatar size="large"
                                                    src={item.player.headImg ? item.player.headImg : avatar}/>
                                            <span className="ml-s">{item.player.name}</span>
                                        </Col>
                                        <Col span={8}>
                                            <Avatar size="large" src={item.team.headImg ? item.team.headImg : logo}/>
                                            <span className="ml-s">{item.team.name}</span>
                                        </Col>
                                        <Col span={8}>
                                            <span className="w-full center">{item.goal}</span>
                                        </Col>
                                    </Row>)}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="添加队伍"
                    okText="确定"
                    visible={this.state.addTeamVisible}
                    onOk={this.handleAddTeamOK}
                    onCancel={this.handleAddTeamCancel}
                    zIndex={1001}
                    destroyOnClose="true"
                >
                    <AddTeamDialog
                        visible={this.state.addTeamVisible}
                        record={this.state.data}
                        ref={this.saveAddTeamDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="添加球员"
                    okText="确定"
                    visible={this.state.addPlayerVisible}
                    onOk={this.handleAddPlayerOK}
                    onCancel={this.handleAddPlayerCancel}
                    zIndex={1001}
                    destroyOnClose="true"
                >
                    <AddPlayerDialog
                        visible={this.state.addPlayerVisible}
                        record={this.state.data}
                        ref={this.saveAddPlayerDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="编辑队伍"
                    okText="确定"
                    visible={this.state.modifyTeamVisible}
                    onOk={this.handleModifyTeamOK}
                    onCancel={this.handleModifyTeamCancel}
                    zIndex={1001}
                    destroyOnClose="true"
                    footer={[
                        <Button key="delete" type="danger" className="pull-left"
                                onClick={this.handleTeamDelete}>删除</Button>,
                        <Button key="back" onClick={this.handleModifyTeamCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleModifyTeamOK}>
                            确定
                        </Button>
                    ]}
                >
                    <ModifyTeamDialog
                        visible={this.state.modifyTeamVisible}
                        record={this.state.currentTeam}
                        league={this.state.data}
                        ref={this.saveModifyTeamDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="编辑球员"
                    okText="确定"
                    visible={this.state.modifyPlayerVisible}
                    onOk={this.handleModifyPlayerOK}
                    onCancel={this.handleModifyPlayerCancel}
                    zIndex={1001}
                    destroyOnClose="true"
                    footer={[
                        <Button key="delete" type="danger" className="pull-left"
                                onClick={this.handlePlayerDelete}>删除</Button>,
                        <Button key="back" onClick={this.handleModifyPlayerCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleModifyPlayerOK}>
                            确定
                        </Button>
                    ]}
                >
                    <ModifyPlayerDialog
                        visible={this.state.modifyPlayerVisible}
                        record={this.state.currentPlayer}
                        ref={this.saveModifyPlayerDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.state.handleDeleteOK}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootballLeagueMatchDetailManagement);