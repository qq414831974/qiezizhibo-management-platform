import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {Row, Col, Card, Tooltip, Tag, List, Button, Modal, Avatar, Select, Spin, Popconfirm} from 'antd';
import {
    updateFormation,
    getMatchPlayersByTeamId,
    addPlayerToMatchTeam,
    getMatchById,
    modifyPlayerInMatchTeam,
    getFormationByMatchTeam,
    deletePlayerInMatchTeam
} from "../../../../axios";
import defultAvatar from '../../../../static/avatar.jpg';
import shirt from '../../../../static/shirt.png';
import shirt2 from '../../../../static/shirt2.png';
import {Form, message} from "antd/lib/index";
import FootBallMatchAddPlayersDialog from "./FootBallMatchAddPlayersDialog";
import FootBallMatchModifyPlayersDialog from "./FootBallMatchModifyPlayersDialog";

const Option = Select.Option;

const ZHUCHANG = 1;
const KECHANG = 0;

const formation = {
    1: "4-3-3",
    2: "4-4-2",
    3: "4-5-1",
    4: "4-3-2-1",
    5: "4-6-0",
    6: "3-5-2",
    7: "5-3-2",
}
const positions =
    [{title: "门将", value: "gk"}, {title: "教练", value: "co"}, {title: "后卫", value: "b"},
        {title: "右边后卫", value: "rwb"}, {title: "右后卫", value: "rb"},
        {title: "右中后卫", value: "rcb"}, {title: "中后卫", value: "cb"}, {title: "左中后卫", value: "lcb"},
        {title: "左后卫", value: "lb"}, {title: "左边后卫", value: "lwb"}, {title: "攻击型后卫", value: "ab"},
        {title: "清道夫", value: "sw"}, {title: "中场", value: "m"}, {title: "右后腰", value: "rcdm"},
        {title: "后腰", value: "cdm"}, {title: "左后腰", value: "lcdm"}, {title: "右边中场", value: "rwm"},
        {title: "右中场", value: "rm"}, {title: "右中中场", value: "rcm"}, {title: "中中场", value: "cm"},
        {title: "左中中场", value: "lcm"}, {title: "左中场", value: "lm"}, {title: "左边中场", value: "lwm"},
        {title: "右前腰", value: "rcam"}, {title: "前腰", value: "cam"}, {title: "左前腰", value: "lcam"},
        {title: "前锋", value: "f"}, {title: "右前锋", value: "rf"}, {title: "中前锋", value: "cf"},
        {title: "左前锋", value: "lf"}, {title: "右边锋", value: "rw"}, {title: "右中锋", value: "rs"},
        {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"},];

class FootBallMatchPlayersSettingPanel extends React.Component {
    state = {
        playerInfo: {},
        pageLoaded: false,
    }

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.fetch();
    };

    fetch = () => {
        this.setState({
            pageLoaded: false,
        });
        getMatchById(this.props.matchId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data,
                });
                getFormationByMatchTeam({
                    matchId: this.props.matchId,
                    teamId: data.data.hostTeamId
                }).then((formation) => {
                    if (formation && formation.code == 200) {
                        this.setState({
                            hostFormation: formation.data ? formation.data : null
                        }, () => {
                            getFormationByMatchTeam({
                                matchId: this.props.matchId,
                                teamId: data.data.guestTeamId
                            }).then((formation) => {
                                if (formation && formation.code == 200) {
                                    this.setState({
                                        pageLoaded: true,
                                        guestFormation: formation.data ? formation.data : null
                                    })
                                }
                            });
                        })
                    }
                });
                this.fetchHostTeam({
                    pageSize: 100,
                    pageNum: 1,
                });
                this.fetchGuestTeam({
                    pageSize: 100,
                    pageNum: 1,
                });
            } else {
                message.error('获取比赛失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    fetchHostTeam = (params = {}) => {
        this.setState({
            hostloading: true,
        });
        getMatchPlayersByTeamId(this.props.matchId, this.state.data.hostTeamId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    hostdata: data.data ? data.data.records : "",
                    hostloading: false,
                });
                // this.getPlayerInfo(data ? data : "");
            } else {
                message.error('获取主队队员失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    fetchGuestTeam = (params = {}) => {
        this.setState({
            guestloading: true,
        });
        getMatchPlayersByTeamId(this.props.matchId, this.state.data.guestTeamId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    guestdata: data.data ? data.data.records : "",
                    guestloading: false,
                });
                // this.getPlayerInfo(data ? data : "");
            } else {
                message.error('获取客队队员失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    getFormation = (type) => {
        return formation[type]
    }
    // getPlayerInfo = (data) => {
    //     if (data == null || data == "") {
    //         return;
    //     }
    //     const playerInfo = this.state.playerInfo
    //     data.forEach((item, index) => {
    //         playerInfo[item.id] = item
    //     });
    //     this.setState({
    //         playerInfo: playerInfo,
    //     });
    // }
    getPositionName = (p) => {
        let title = "";
        positions.forEach((item, index) => {
            if (item.value == p) {
                title = item.title;
            }
        });
        return title;
    }
    getPosition = (record) => {
        if (record ? record.position == null : true) {
            return null;
        }
        const positionName = this.getPositionName;
        let i = 0;
        let position = [];
        let dom = [];
        position = record.position;
        position.forEach((item, index) => {
            dom.push(<Tag key={i} color="#001529">{positionName(item)}</Tag>)
            i = i + 1;
        });

        return <div className="center">{dom}</div>;
    };
    showMatchPlayerAddDialog = (type) => {
        this.setState({
            dialogAddVisible: true,
            currentTeam: type,
        });
    };
    showModifyDialog = (type, item) => {
        this.setState({
            dialogModifyVisible: true,
            currentPlayer: item,
            currentTeam: type,
        });
    }
    handleMatchPlayerAdd = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const formation = values.formation;
            updateFormation(formation).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        delete values.formation;
                        addPlayerToMatchTeam(values).then((data) => {
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
                        });
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleMatchPlayerModify = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const formation = values.formation;
            updateFormation(formation).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        delete values.formation;
                        modifyPlayerInMatchTeam(values).then((data) => {
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
                        });
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            })
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    saveMatchPlayerDialogRef = (form) => {
        this.formAdd = form;
    };
    saveMatchPlayerModifyDialogRef = (form) => {
        this.formModify = form;
    };
    handleMatchPlayerAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleMatchPlayerModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    getHalfPlayer = (type) => {
        let formation;
        let formationStr;
        if (type == KECHANG) {
            if (this.state.guestFormation) {
                formation = this.state.guestFormation;
            }
        } else {
            if (this.state.hostFormation) {
                formation = this.state.hostFormation;
            }
        }
        if (formation == null) {
            return null;
        }
        formationStr = this.getFormation(formation.type);
        let times = 12;
        const getColPlayer = (item, colWidth, type, formation) => {
            let dom_col = [];
            for (var i = 0; i < item; i++) {
                times = times - 1;
                let playerInfo;
                if (formation.detail) {
                    playerInfo = formation.detail[times];
                }
                dom_col.push(<Col span={colWidth} key={"player" + "-" + type + "-" + item + "-" + i}>
                    <div className="center flex-important" style={{WebkitTransform: 'perspective(1000)'}}>
                        <Avatar size="large" className={type == KECHANG ? "reverse" : ""}
                                src={playerInfo ? playerInfo.headImg : defultAvatar}/>
                    </div>
                </Col>);
            }
            return dom_col;
        }
        const formationList = formationStr.split("-")
        const divHeight = 250 * 3 / 4 / formationList.length;
        let dom = []
        for (var i = formationList.length - 1; i >= 0; i--) {
            dom.push(<div style={{height: divHeight}} key={"row-div" + "-" + type + "-" + i}>
                <Row gutter={1} className="center flex-important" key={"row" + "-" + type + "-" + i}>
                    {getColPlayer(formationList[i], Math.floor(24 / formationList[i]), type, formation)}
                </Row>
            </div>);
        }
        let playerInfo;
        if (formation) {
            if (formation.detail) {
                playerInfo = formation.detail[(times - 1)];
            }
        }
        dom.push(<div className="center flex-important" style={{WebkitTransform: 'perspective(1000)'}}
                      key={"player-gk" + "-" + type}>
            <Avatar size="large" className={type == KECHANG ? "reverse" : ""}
                    src={playerInfo ? playerInfo.headImg : defultAvatar}/>
        </div>);
        return dom;
    }
    onHostFormationSelect = (e, op) => {
        // this.state.hostFormation.type = e
        // this.setState({
        //     hostFormation: this.state.hostFormation,
        // });
        this.updateFormation({
            matchId: this.state.data.id,
            teamId: this.state.data.hostTeamId,
            value: e,
            type: ZHUCHANG
        })
    }
    onGuestFormationSelect = (e, op) => {
        // this.state.guestFormation.type = e
        // this.setState({
        //     guestFormation: this.state.guestFormation,
        // });
        this.updateFormation({
            matchId: this.state.data.id,
            teamId: this.state.data.guestTeamId,
            value: e,
            type: KECHANG
        })
    }
    updateFormation = ({matchId, teamId, value, type}) => {
        updateFormation({matchId: matchId, teamId: teamId, type: value}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    // if (type == KECHANG) {
                    //     this.state.guestFormation.type = value;
                    //     this.setState({
                    //         guestFormation: this.state.guestFormation,
                    //     });
                    // } else {
                    //     this.state.hostFormation.type = value;
                    //     this.setState({
                    //         hostFormation: this.state.hostFormation,
                    //     });
                    // }
                    this.refresh();
                    message.success('修改成功', 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleMatchPlayerDelete = () => {
        let teamId;
        if (this.state.currentTeam == KECHANG) {
            teamId = this.state.guestFormation.teamId
        } else {
            teamId = this.state.hostFormation.teamId
        }
        deletePlayerInMatchTeam({
            matchId: this.props.matchId,
            teamId: teamId,
            playerId: this.state.currentPlayer.id,
        }).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        this.setState({dialogModifyVisible: false, deleteVisible: false});
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const shirtStyle = {position: "absolute", fontSize: 16, color: "#FFFFFF", paddingBottom: "15px"};
        const shirtStyle2 = {position: "absolute", fontSize: 16, color: "#000000", paddingBottom: "15px"};
        const getPosition = this.getPosition;
        const getHalfPlayer = this.getHalfPlayer;
        const onHostFormationSelect = this.onHostFormationSelect;
        const onGuestFormationSelect = this.onGuestFormationSelect;
        const showMatchPlayerAddDialog = this.showMatchPlayerAddDialog;
        const showModifyDialog = this.showModifyDialog;
        const AddDialog = Form.create()(FootBallMatchAddPlayersDialog);
        const ModifyDialog = Form.create()(FootBallMatchModifyPlayersDialog);
        return this.state.pageLoaded ? <div>
            <Row gutter={8}>
                <Col span={7}>
                    <Card>
                        <div className="center">
                            <img className="round-img"
                                 src={this.state.data ? this.state.data.hostTeam.headImg : defultAvatar}/>
                        </div>
                        <div className="center w-full">
                            <p style={{fontSize: 22}}
                               className="mt-s mb-n">{this.state.data ? this.state.data.hostTeam.name : ""}</p>
                        </div>
                        <div className="center w-full">
                            <p className="mt-n">主队</p>
                        </div>
                        <div className="center w-full mt-n mb-n">
                            <Button type="primary" icon="plus" shape="circle" className="mt-n"
                                    onClick={showMatchPlayerAddDialog.bind(this, ZHUCHANG)}/>
                        </div>
                        <List
                            rowKey={record => record.id}
                            style={{minHeight: 400}}
                            size="small"
                            className="list-header-border-none"
                            dataSource={this.state.hostdata ? this.state.hostdata : []}
                            loading={this.state.hostloading}
                            renderItem={item => (
                                <List.Item className="cursor-hand"
                                           onClick={showModifyDialog.bind(this, ZHUCHANG, item)}>
                                    <div className="center list-item-hover">
                                        <img className="round-img-s"
                                             src={item.headImg ? item.headImg : defultAvatar}/>
                                    </div>
                                    <div className="pl-m">
                                        <p style={{fontSize: 16}}>{item.name}</p>
                                    </div>
                                    <div className="center pl-m">
                                        {getPosition(item)}
                                    </div>
                                    <Tooltip
                                        placement="right"
                                        title={item.status == 1 ? "首发" : "替补"}>
                                        <div className="center" style={{position: "absolute", right: 0}}>

                                            <img
                                                style={{opacity: 0.8, width: "40px", height: "40px"}}
                                                src={item.status == 1 ? shirt : shirt2}/>
                                            <p style={item.status == 1 ? shirtStyle : shirtStyle2}>{item.shirtNum}</p>

                                        </div>
                                    </Tooltip>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <div className="playground">
                        <div className="w-full mb-m">
                            <p className="pull-left mt-n mb-n"
                               style={{color: "#FFFFFF"}}>{this.state.data.guestTeam.name}</p>
                            <Select size="small"
                                    value={this.state.guestFormation ? this.state.guestFormation.type : 1}
                                    className="pull-right mt-ms-r mb-n"
                                    onSelect={onGuestFormationSelect}
                                    style={{minWidth: 100}}>
                                <Option value={1}>4-3-3</Option>
                                <Option value={2}>4-4-2</Option>
                                <Option value={3}>4-5-1</Option>
                                <Option value={4}>4-3-2-1</Option>
                                <Option value={5}>4-6-0</Option>
                                <Option value={6}>3-5-2</Option>
                                <Option value={7}>5-3-2</Option>
                            </Select>
                        </div>
                        <div style={{height: 250, minWidth: 250, display: "block"}} className="reverse">
                            <div className="playground-half">
                                <div style={{marginBottom: 250 / 4, marginTop: 10}}>{getHalfPlayer(KECHANG)}</div>
                                <div className="half-playground-circle"/>
                                <div className="penalty-area">
                                    <div className="penalty-area-circle"/>
                                    <div className="keeper-area"/>
                                </div>
                            </div>
                        </div>
                        <div style={{height: 250, minWidth: 250, display: "block"}}>
                            <div className="playground-half">
                                <div style={{marginBottom: 250 / 4, marginTop: 10}}>{getHalfPlayer(ZHUCHANG)}</div>
                                <div className="half-playground-circle"/>
                                <div className="penalty-area">
                                    <div className="penalty-area-circle"/>
                                    <div className="keeper-area"/>
                                </div>
                            </div>
                        </div>
                        <div className="w-full mb-m">
                            <p className="pull-left mt-n mb-n"
                               style={{color: "#FFFFFF"}}>{this.state.data.hostTeam.name}</p>
                            <Select size="small"
                                    value={this.state.hostFormation ? this.state.hostFormation.type : 1}
                                    className="pull-right mt-xxs mb-n"
                                    onSelect={onHostFormationSelect}
                                    style={{minWidth: 100}}>
                                <Option value={1}>4-3-3</Option>
                                <Option value={2}>4-4-2</Option>
                                <Option value={3}>4-5-1</Option>
                                <Option value={4}>4-3-2-1</Option>
                                <Option value={5}>4-6-0</Option>
                                <Option value={6}>3-5-2</Option>
                                <Option value={7}>5-3-2</Option>
                            </Select>
                        </div>
                    </div>
                </Col>
                <Col span={7}>
                    <Card>
                        <div className="center">
                            <img className="round-img"
                                 src={this.state.data ? this.state.data.guestTeam.headImg : defultAvatar}/>
                        </div>
                        <div className="center w-full">
                            <p style={{fontSize: 22}}
                               className="mt-s mb-n">{this.state.data ? this.state.data.guestTeam.name : ""}</p>
                        </div>
                        <div className="center w-full">
                            <p className="mt-n">客队</p>
                        </div>
                        <div className="center w-full mt-n mb-n">
                            <Button type="primary" icon="plus" shape="circle" className="mt-n"
                                    onClick={showMatchPlayerAddDialog.bind(this, KECHANG)}/>
                        </div>
                        <List
                            rowKey={record => record.id}
                            style={{minHeight: 400}}
                            size="small"
                            className="list-header-border-none"
                            dataSource={this.state.guestdata ? this.state.guestdata : []}
                            loading={this.state.guestloading}
                            renderItem={item => (
                                <List.Item className="cursor-hand"
                                           onClick={showModifyDialog.bind(this, KECHANG, item)}>
                                    <div className="center list-item-hover">
                                        <img className="round-img-s"
                                             src={item.headImg ? item.headImg : defultAvatar}/>
                                    </div>
                                    <div className="pl-m">
                                        <p style={{fontSize: 16}}>{item.name}</p>
                                    </div>
                                    <div className="center pl-m">
                                        {getPosition(item)}
                                    </div>
                                    <Tooltip
                                        placement="right"
                                        title={item.status == 1 ? "首发" : "替补"}>
                                        <div className="center" style={{position: "absolute", right: 0}}>

                                            <img
                                                style={{opacity: 0.8, width: "40px", height: "40px"}}
                                                src={item.status == 1 ? shirt : shirt2}/>
                                            <p style={item.status == 1 ? shirtStyle : shirtStyle2}>{item.shirtNum}</p>

                                        </div>
                                    </Tooltip>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                width={800}
                visible={this.state.dialogAddVisible}
                title="添加球员"
                okText="确定"
                onCancel={this.handleMatchPlayerAddCancel}
                destroyOnClose="true"
                onOk={this.handleMatchPlayerAdd}
            >
                <AddDialog
                    visible={this.state.dialogAddVisible}
                    record={this.state.currentTeam == ZHUCHANG ? this.state.hostFormation : this.state.guestFormation}
                    teamId={this.state.currentTeam == ZHUCHANG ? this.state.data.hostTeamId : this.state.data.guestTeamId}
                    matchId={this.props.matchId}
                    ref={this.saveMatchPlayerDialogRef}/>
            </Modal>
            <Modal
                width={800}
                visible={this.state.dialogModifyVisible}
                title="编辑球员"
                okText="确定"
                onCancel={this.handleMatchPlayerModifyCancel}
                destroyOnClose="true"
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={() => {
                                this.setState({deleteVisible: true});
                            }}>
                        删除
                    </Button>,
                    <Button key="back" onClick={this.handleMatchPlayerModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleMatchPlayerModify}>
                        确定
                    </Button>
                ]}
            >
                <ModifyDialog
                    visible={this.state.dialogModifyVisible}
                    record={this.state.currentTeam == ZHUCHANG ? this.state.hostFormation : this.state.guestFormation}
                    matchId={this.props.matchId}
                    teamId={this.state.currentTeam == ZHUCHANG ? this.state.data.hostTeamId : this.state.data.guestTeamId}
                    player={this.state.currentPlayer}
                    ref={this.saveMatchPlayerModifyDialogRef}/>
            </Modal>
            <Modal
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.handleMatchPlayerDelete}
                onCancel={this.handleDeleteCancel}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
            </Modal>
        </div> : <div className="center">
            <Spin spinning={!this.state.pageLoaded} size="large"/></div>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchPlayersSettingPanel);