import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar, Row, Col} from 'antd';
import {
    getMatchTeamHeat,
    getMatchPlayerHeat,
    addMatchTeamHeat,
    addMatchPlayerHeat,
    addFakeGiftOrder, getMatchById
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import MatchHeatAddDialog from './MatchHeatAddDialog';
import MatchHeatFakeAddDialog from "./MatchHeatFakeAddDialog";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import defultAvatar from "../../../../static/avatar.jpg";


class MatchHeatTable extends React.Component {
    state = {
        data: [],
        loading: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch();
        getMatchById(this.props.matchId).then(data => {
            if (data && data.code == 200) {
                this.setState({leagueId: data.data.leagueId})
            } else {
                message.error('获取比赛信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    };

    fetch = () => {
        if (this.props.heatRule && this.props.heatRule.type == 0) {
            this.fetchMatchTeamHeat();
        } else if (this.props.heatRule && this.props.heatRule.type == 1) {
            this.fetchMatchPlayerHeat();
        }
    }
    fetchMatchTeamHeat = () => {
        this.setState({loading: true});
        getMatchTeamHeat({matchId: this.props.matchId}).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data ? data.data : [],
                });
            } else {
                message.error('获取比赛球队热度列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    fetchMatchPlayerHeat = () => {
        this.setState({loading: true});
        getMatchPlayerHeat({matchId: this.props.matchId, pageNum: 1, pageSize: 200}).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : [],
                });
            } else {
                message.error('获取比赛球员热度列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    onNameClick = (record, e) => {
        let target = null
        if (this.props.heatRule && this.props.heatRule.type == 0) {
            target = this.getTeam(record.teamId);
        } else {
            target = this.getPlayer(record.playerId);
        }
        this.setState({record: record, heatRule: this.props.heatRule, target: target, dialogChoiceVisible: true});
    }
    saveMatchHeatFakeAddDialogRef = (form) => {
        this.formFakeAdd = form;
    }
    showMatchHeatFakeAddDialog = () => {
        this.setState({dialogFakeAddVisible: true});
    };
    handleMatchHeatFakeAddCancel = () => {
        this.setState({dialogFakeAddVisible: false});
    };

    handleMatchHeatFakeAddCreate = () => {
        const form = this.formFakeAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addFakeGiftOrder(values).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        this.setState({dialogChoiceVisible: false});
                        message.success('添加成功', 3);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            })
            this.setState({dialogFakeAddVisible: false});
        });
    };
    saveMatchHeatAddDialogRef = (form) => {
        this.formAdd = form;
    }
    showMatchHeatAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleMatchHeatAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };

    handleMatchHeatAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (this.props.heatRule && this.props.heatRule.type == 0) {
                this.addTeamHeat(values.matchId, values.teamId, values.heat);
            } else if (this.props.heatRule && this.props.heatRule.type == 1) {
                this.addPlayerHeat(values.matchId, values.playerId, values.heat);
            }
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleChoiceCancel = () => {
        this.setState({dialogChoiceVisible: false});
    };
    addTeamHeat = (matchId, teamId, heat) => {
        addMatchTeamHeat({matchId, teamId, heat}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('添加成功', 3);
                }
            } else {
                message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    addPlayerHeat = (matchId, playerId, heat) => {
        addMatchPlayerHeat({matchId, playerId, heat}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('添加成功', 3);
                }
            } else {
                message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getTeam = (teamId) => {
        const match = this.props.match
        if (match == null) {
            return null;
        }
        const hostTeam = this.props.match.hostteam
        const guestTeam = this.props.match.guestteam
        if (teamId == hostTeam.id) {
            return hostTeam
        } else if (teamId == guestTeam.id) {
            return guestTeam
        }
        return null;
    }
    getPlayer = (playerId) => {
        const players = this.props.players
        if (players == null) {
            return null;
        }
        for (let player of players) {
            if (player.id == playerId) {
                return player;
            }
        }
        return null;
    }

    render() {
        const onNameClick = this.onNameClick;

        const AddDialog = Form.create()(MatchHeatAddDialog);
        const FakeAddDialog = Form.create()(MatchHeatFakeAddDialog);

        const getTeam = this.getTeam;
        const getPlayer = this.getPlayer;

        const isMobile = this.props.responsive.data.isMobile;


        const columns = [{
            title: '队伍/球员',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '70%',
            render: function (text, record, index) {
                if (record.teamId) {
                    const team = getTeam(record.teamId);
                    return <div className="center"><Avatar src={team && team.headImg ? team.headImg : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{team ? team.name : "未知"}</a>
                    </div>;
                } else if (record.playerId) {
                    const player = getPlayer(record.playerId);
                    return <div className="center"><Avatar src={player && player.headImg ? player.headImg : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>{player ? `${player.name}(${player.shirtNum}号)` : "未知"}</a>
                    </div>;
                }
                return <span>未知</span>;
            }
        }, {
            title: '热度',
            key: 'heat',
            dataIndex: 'heat',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.heat + record.heatBase}</a>;
            },
        },
        ];
        return <div><Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           loading={this.state.loading}
                           bordered
                           pagination={false}
                           title={() =>
                               <div style={{height: 32}}>
                                   <Tooltip title="刷新">
                                       <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                               loading={this.state.loading}
                                               onClick={this.refresh}/>
                                   </Tooltip>
                               </div>
                           }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加热度"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleMatchHeatAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleMatchHeatAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleMatchHeatAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           record={this.state.record}
                           target={this.state.target}
                           heatRule={this.props.heatRule}
                           ref={this.saveMatchHeatAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="刷票"
                visible={this.state.dialogFakeAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleMatchHeatFakeAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleMatchHeatFakeAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleMatchHeatFakeAddCancel}>
                <FakeAddDialog visible={this.state.dialogFakeAddVisible}
                               record={this.state.record}
                               leagueId={this.state.leagueId}
                               target={this.state.target}
                               heatRule={this.props.heatRule}
                               ref={this.saveMatchHeatFakeAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="请选择"
                visible={this.state.dialogChoiceVisible}
                footer={[
                    <Button key="back" onClick={this.handleChoiceCancel}>取消</Button>,
                ]}
                onCancel={this.handleChoiceCancel}>
                <Row gutter={10}>
                    <Col span={12}>
                        <Button
                            type="primary"
                            className="w-full h-full center"
                            onClick={this.showMatchHeatAddDialog}>添加热度</Button>
                    </Col>
                    <Col span={12}>
                        <Button
                            type="primary"
                            className="w-full h-full center"
                            onClick={this.showMatchHeatFakeAddDialog}>刷票</Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchHeatTable);