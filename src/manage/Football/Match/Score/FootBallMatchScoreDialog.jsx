import React from 'react';
import {
    Form,
    Avatar,
    Col,
    Button,
    Row,
    Progress,
    Timeline,
    Drawer,
    Tooltip,
    Modal,
    Input,
    Radio,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defultAvatar from '../../../../static/avatar.jpg';
import vs from '../../../../static/vs.png';
import start from '../../../../static/start.svg';
import half_time from '../../../../static/half_time.svg';
import injury from '../../../../static/injury.svg';
import extra from '../../../../static/extra.svg';
import pause from '../../../../static/pause.svg';
import penalty from '../../../../static/penalty.svg';
import finish from '../../../../static/finish.svg';
import yellowcard from '../../../../static/yellowcard.svg';
import redcard from '../../../../static/redcard.svg';
import offside from '../../../../static/offside.svg';
import goal from '../../../../static/goal.svg';
import substitution from '../../../../static/substitution.svg';
import shoot from '../../../../static/shoot.svg';
import tackle from '../../../../static/tackle.svg';
import free_kick from '../../../../static/free_kick.svg';
import foul from '../../../../static/foul.svg';
import save from '../../../../static/save.svg';
import corner from '../../../../static/corner.svg';
import long_pass from '../../../../static/long_pass.svg';
import clearance from '../../../../static/clearance.svg';
import cross from '../../../../static/cross.svg';
import own_goal from '../../../../static/own_goal.svg';
import shoot_out from '../../../../static/shoot_out.svg';
import shoot_door from '../../../../static/shoot_door.svg';
import cross_failed from '../../../../static/cross_failed.svg';
import cross_success from '../../../../static/cross_success.svg';
import substitution_arrow from '../../../../static/substitution_arrow.svg';
import {
    getTimelineByMatchId,
    getMatchStatus,
    getMatchById,
    getPlayersByTeamId,
    updateMatchById,
    updateMatchScoreStatusById,
} from "../../../../axios";
import FootBallMatchScoreAddDialog from './FootBallMatchScoreAddDialog';
import FootBallMatchScoreModifyDialog from './FootBallMatchScoreModifyDialog';
import FootBallMatchScoreTimeEventAddDialog from './FootBallMatchScoreTimeEventAddDialog';
import FootBallMatchScoreTimeEventModifyDialog from './FootBallMatchScoreTimeEventModifyDialog';
import FootBallMatchScorePassDialog from './FootBallMatchScorePassDialog';
import {message} from "antd/lib/index";

const status = {
    0: {text: "上半场"},
    14: {text: "中场"},
    15: {text: "下半场"},
    13: {text: "伤停"},
    11: {text: "加时"},
    12: {text: "点球大战"},
    21: {text: "比赛结束"},
    16: {text: "暂停"},
};

const eventType = {
    0: {text: "比赛开始", icon: start, hidden: true},
    1: {text: "进球", icon: goal},
    2: {text: "射门", icon: shoot},
    3: {text: "越位", icon: offside},
    4: {text: "抢断", icon: tackle},
    5: {text: "任意球", icon: free_kick},
    6: {text: "犯规", icon: foul},
    7: {text: "黄牌", icon: yellowcard},
    8: {text: "红牌", icon: redcard},
    9: {text: "扑救", icon: save},
    10: {text: "换人", icon: substitution},
    11: {text: "加时", icon: extra, hidden: true},
    12: {text: "点球大战", icon: penalty, hidden: true},
    13: {text: "伤停", icon: injury, hidden: true},
    14: {text: "中场", icon: half_time, hidden: true},
    15: {text: "下半场", icon: start, hidden: true},
    16: {text: "暂停", icon: pause, hidden: true},
    17: {text: "角球", icon: corner},
    18: {text: "传中", icon: cross},
    19: {text: "长传", icon: long_pass},
    20: {text: "解围", icon: clearance},
    21: {text: "比赛结束", icon: finish, hidden: true},
    22: {text: "乌龙球", icon: own_goal},
    24: {text: "点球", icon: penalty},
    25: {text: "进球(点球大战)", icon: penalty, hideTime: true},
}
const event = [
    {key: 1, text: "进球", icon: goal, show: 1},
    {key: 7, text: "黄牌", icon: yellowcard, show: 1},
    {key: 8, text: "红牌", icon: redcard, show: 1},
    {key: 10, text: "换人", icon: substitution, show: 1},

    {key: 0, text: "比赛开始", icon: start, show: 0},
    {key: 14, text: "中场", icon: half_time, show: 0},
    {key: 15, text: "下半场", icon: start, show: 0},
    {key: 13, text: "伤停", icon: injury, show: 0},
    {key: 11, text: "加时", icon: extra, show: 0},
    {key: 12, text: "点球大战", icon: penalty, show: 0},
    {key: 21, text: "比赛结束", icon: finish, show: 0},
    {key: 16, text: "暂停", icon: pause, show: 0},
    {key: 23, text: "传球控球率", icon: tackle, show: 0},

    {key: 2, text: "射门", icon: shoot, show: 2},
    {key: 3, text: "越位", icon: offside, show: 2},
    {key: 4, text: "抢断", icon: tackle, show: 2},
    {key: 5, text: "任意球", icon: free_kick, show: 2},
    {key: 6, text: "犯规", icon: foul, show: 2},
    {key: 9, text: "扑救", icon: save, show: 2},
    {key: 17, text: "角球", icon: corner, show: 2},
    {key: 18, text: "传中", icon: cross, show: 2},
    {key: 19, text: "长传", icon: long_pass, show: 2},
    {key: 20, text: "解围", icon: clearance, show: 2},
    {key: 22, text: "乌龙球", icon: own_goal, show: 2},
    {key: 24, text: "点球", icon: penalty, show: 2},
    {key: 25, text: "进球(点球大战)", icon: penalty, show: 2},
]
moment.locale('zh-cn');

const ZHUCHANG = 1;
const KECHANG = 0;
const CHUANKONG = 23;
const formation = {
    1: "4-3-3",
    2: "4-4-2",
    3: "4-5-1",
    4: "4-3-2-1",
    5: "4-6-0",
    6: "3-5-2",
    7: "5-3-2",
}

class FootBallMatchScoreDialog extends React.Component {
    state = {
        data: {},
        playerInfo: {},
        timeline: [],
        drawHeight: 270,
        drawEventHeight: 300,
        hostPoint: 0,
        guestPoint: 0,
    }

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.fetch();
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null
        }
        this.timerID = setInterval(
            () => {
                this.getTimeline();
            },
            30000
        );
    }

    componentWillUnmount() {
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null
        }
    }


    fetch = () => {
        getMatchById(this.props.matchId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data,
                    // hostFormation: data.hostTeam?(data.hostTeam.formation ? data.hostTeam.formation.type : "4-3-3"):{},
                    // guestFormation: data.guestTeam?(data.guestTeam.formation ? data.guestTeam.formation.type : "4-3-3"):{}
                });
                data.data.hostTeam && this.getPlayer(data.data.hostTeam.id);
                data.data.guestTeam && this.getPlayer(data.data.guestTeam.id);
                this.getTimeline();
            } else {
                message.error('获取比赛失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    getTimeline = () => {
        getMatchStatus(this.props.matchId).then((res) => {
            if (res && res.code == 200) {
                this.setState({status: res.data});
                let hostPass = 0;
                let hostPoss = 50;
                let guestPass = 0;
                let guestPoss = 50;
                let timelines = res.data ? res.data.timeLines : [];
                timelines && timelines.forEach((item, index) => {
                    if (item.eventType == CHUANKONG) {
                        const passAndPoss = JSON.parse(item.remark)
                        const teamId = item.teamId
                        if (teamId == this.state.data.hostTeam.id) {
                            hostPass = passAndPoss.pass
                            hostPoss = passAndPoss.possession
                        } else {
                            guestPass = passAndPoss.pass
                            guestPoss = passAndPoss.possession
                        }
                    }
                });
                let hostPoint = 0;
                let guestPoint = 0;
                if (this.state.data.hostTeam) {
                    timelines && timelines.forEach((item, index) => {
                        const isHost = this.state.data.hostTeam.id == item.teamId ? true : false;
                        if (item.eventType == 1 || item.eventType == 22) {
                            if (isHost) {
                                if (item.eventType == 22) {
                                    guestPoint = guestPoint + 1;
                                } else {
                                    hostPoint = hostPoint + 1;
                                }
                            } else {
                                if (item.eventType == 22) {
                                    hostPoint = hostPoint + 1;
                                } else {
                                    guestPoint = guestPoint + 1;
                                }
                            }
                        }
                    });
                }
                this.setState({
                    hostPoint: hostPoint,
                    guestPoint: guestPoint,
                    timelineData: timelines,
                    hostPass: hostPass,
                    hostPoss: hostPoss,
                    guestPass: guestPass,
                    guestPoss: guestPoss,
                });
            } else {
                message.error('获取时间轴失败：' + (res ? res.result + "-" + res.message : res), 3);
            }
        });
    }
    getPlayer = (teamId) => {
        getPlayersByTeamId(teamId, {pageSize: 100, pageNum: 1,}).then((data) => {
            if (data && data.code == 200) {
                this.getPlayerInfo(data.data ? data.data.records : "");
            } else {
                message.error('获取队员列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    getPlayerInfo = (data) => {
        if (data == null || data == "") {
            return;
        }
        const playerInfo = this.state.playerInfo
        data.forEach((item, index) => {
            playerInfo[item.id] = item
        });
        this.setState({
            playerInfo: playerInfo,
        });
    }
    onTimelineAddClick = () => {
        this.showDrawer();
    }
    initTimeLineDom = () => {
        let data = this.state.timelineData;
        let onDotClick = this.onDotClick;
        let dom = [];
        if (data) {
            data = data.sort((object1, object2) => {
                const value1 = object1["minute"];
                const value2 = object2["minute"];
                if (!value1 && !value2) {
                    return 0;
                }
                if (value1 > value2) {
                    return 1;
                } else if (value1 < value2) {
                    return -1;
                } else if (value1 == value2) {
                    return 0;
                }
                return 0;
            });
            data.forEach((item, index) => {
                if (item.eventType != CHUANKONG) {
                    const des = eventType[item.eventType].text
                    const hidden = eventType[item.eventType].hidden
                    const isChange = item.eventType == 10 ? true : false;
                    const dot = <div>
                        <div className="w-full center">
                            <img className="round-img-xxs-hover" onClick={onDotClick.bind(this, item)}
                                 src={eventType[item.eventType].icon}/>
                        </div>
                        <span className="w-full center">{des}</span>
                    </div>
                    const isHost = this.state.data.hostTeam ? (this.state.data.hostTeam.id == item.teamId ? true : false) : false
                    const dis = isHost ? "timeline-left" : "timeline-right"
                    const avatar = this.state.playerInfo[item.playerId] ? this.state.playerInfo[item.playerId].headImg : defultAvatar;
                    const hideTime = eventType[item.eventType].hideTime;
                    let name = this.state.playerInfo[item.playerId] ? this.state.playerInfo[item.playerId].name : "";
                    let shirtNum = this.state.playerInfo[item.playerId] ? this.state.playerInfo[item.playerId].shirtNum : "";
                    let changeDom = [];
                    if (isChange) {
                        changeDom.push(<div className="inline-block center">
                            <img className="round-img-xxs ml-s mr-s" src={substitution_arrow}/>
                        </div>);
                        changeDom.push(<div className="inline-block">
                            <div>
                                <div className="center">
                                    <Avatar className="center" size="small"
                                            src={this.state.playerInfo[item.remark] ? this.state.playerInfo[item.remark].headImg : defultAvatar}/>
                                </div>
                                <div className="center">
                                <span
                                    className="w-full">{this.state.playerInfo[item.remark] ? this.state.playerInfo[item.remark].name + `(${this.state.playerInfo[item.remark].shirtNum})` : ""}</span>
                                </div>
                            </div>
                        </div>);
                    }
                    let line = <Timeline.Item dot={dot} className={dis}>
                        {hidden ? <div style={{height: 36}}/> :
                            <Tooltip title={item.text}>
                                <div style={{height: 38}} className="center pr-s pr-s inline-flex-important">
                                    <div className="inline-block">
                                        {hideTime == true ? <span className="ml-l"/> : <span
                                            className={item.minute ? "ml-s" : "none-important"}>{item.minute ? item.minute : ""}'</span>}
                                    </div>
                                    {/*<div className="inline-block ml-s">*/}
                                    {/*<span>{des}</span>*/}
                                    {/*</div>*/}
                                    <div className="inline-block">
                                        <div className="center">
                                            <Avatar size="small" src={avatar}/>
                                        </div>
                                        <div className="center">
                                            <span className="center">{name + `(${shirtNum})`}</span>
                                        </div>
                                    </div>
                                    {changeDom}
                                </div>
                            </Tooltip>
                        }
                    </Timeline.Item>
                    if (isHost) {
                        line = <Timeline.Item dot={dot} className={dis}>
                            {hidden ? <div style={{height: 36}}/> :
                                <Tooltip title={item.text} hidden={hidden}>
                                    <div style={{height: 38}} className="center pl-s pr-s inline-flex-important">
                                        <div className="inline-block">
                                            <div className="center">
                                                <Avatar size="small" src={avatar}/>
                                            </div>
                                            <div className="center">
                                                <span className="center">{name + `(${shirtNum})`}</span>
                                            </div>
                                        </div>
                                        {changeDom}
                                        {/*<div className="inline-block ml-s">*/}
                                        {/*<span>{des}</span>*/}
                                        {/*</div>*/}
                                        <div className="inline-block">
                                            {hideTime == true ? <span className="ml-l"/> : <span
                                                className={item.minute ? "ml-s" : "none-important"}>{item.minute ? item.minute : ""}'</span>}
                                        </div>
                                    </div>
                                </Tooltip>}
                        </Timeline.Item>;
                    }
                    dom.push(line);
                }
            });
        }
        return dom;
    }
    onDotClick = (item, e) => {
        const hidden = eventType[item.eventType].hidden
        if (hidden) {
            this.setState({
                drawEventModifyVisible: true,
                record: item,
            });
        } else {
            this.setState({
                drawModifyVisible: true,
                record: item,
            });
        }
    }
    onDrawClose = () => {
        this.setState({
            drawVisible: false,
            drawHeight: 270
        });
    };
    onModifyDrawClose = () => {
        this.setState({
            drawModifyVisible: false,
            drawHeight: 270
        });
    };
    onEventAddDrawClose = () => {
        this.setState({
            drawEventAddVisible: false,
        });
    };
    onEventModifyDrawClose = () => {
        this.setState({
            drawEventModifyVisible: false,
        });
    };
    onPassDrawClose = () => {
        this.setState({
            drawPassVisible: false,
        });
    };
    showEventAddDrawer = () => {
        this.setState({
            drawEventAddVisible: true,
        });
    };
    showPassDrawer = () => {
        this.setState({
            drawPassVisible: true
        });
    }
    showDrawer = () => {
        this.setState({
            drawVisible: true,
        });
    };
    onDrawHeightChange = (height) => {
        this.setState({drawHeight: height})
    }
    onDrawEventHeightChange = (height) => {
        this.setState({drawEventHeight: height})
    }
    getTimeOption = () => {
        let doms = [];
        let indes = 0;
        const onEventSelect = this.onEventSelect;
        const rowSize = this.props.responsive.data.isMobile ? 4 : 8;
        event.forEach((item, index) => {
            if (item.show == 0) {
                let row = Math.floor(indes / rowSize);
                let dom_div = (<Col span={Math.floor(24 / rowSize)}>
                    <div onClick={onEventSelect.bind(this, item)}
                         className="step-item-hover center">
                        <div style={{position: "relative"}}>
                            <div className="w-full center">
                                <img className="round-img-s" src={item.icon ? item.icon : defultAvatar}/>
                            </div>
                            <p className="w-full mb-n center">{item.text}</p>
                        </div>
                    </div>
                </Col>);
                if (!doms[row]) {
                    doms[row] = [];
                }
                doms[row].push(dom_div)
                indes = indes + 1;
            }
        });
        let dom = [];
        doms.forEach((item, index) => {
            dom.push(<Row className="center" gutter={2}>{item}</Row>)
        });
        return <div>
            <p className="w-full mb-n center"
               style={{fontSize: 20}}>选择事件</p>
            {dom}
        </div>;
    }
    onEventSelect = (item, e) => {
        this.setState({event: item});
        if (item.key == CHUANKONG) {
            this.showPassDrawer();
        } else {
            this.showEventAddDrawer();
        }
    }
    refreshTimeLine = () => {
        this.getTimeline();
    }
    onStatusDialogRaidoChange = (e) => {
        this.setState({statusDialogRadio: e.target.value});

    }
    onStatusDialogScoreChange = (e) => {
        this.setState({statusDialogScore: e.target.value});
    }
    onStatusDialogPenaltyScoreChange = (e) => {
        this.setState({statusDialogPenaltyScore: e.target.value});
    }
    handleMatchStatusConfirm = () => {
        updateMatchScoreStatusById({
            id: this.state.data.id,
            status: this.state.statusDialogRadio,
            score: this.state.statusDialogScore,
            penaltyScore: this.state.statusDialogPenaltyScore,
        }).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.fetch();
                    this.props.refreshFuc();
                    message.success('修改成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        this.setState({dialogStatusVisible: false});
    }
    showStatusDialog = () => {
        this.setState({
            dialogStatusVisible: true,
            statusDialogRadio: this.state.data.status,
            statusDialogScore: this.state.data.score,
            statusDialogPenaltyScore: this.state.data.penaltyScore
        });
    }
    handleMatchStatusCancel = () => {
        this.setState({dialogStatusVisible: false});
    };

    render() {
        const {visible, form, record, responsive} = this.props;
        const onTimelineAddClick = this.onTimelineAddClick;
        const onDrawClose = this.onDrawClose;
        const onModifyDrawClose = this.onModifyDrawClose;
        const onEventAddDrawClose = this.onEventAddDrawClose;
        const onEventModifyDrawClose = this.onEventModifyDrawClose;
        const onPassDrawClose = this.onPassDrawClose;
        const onDrawHeightChange = this.onDrawHeightChange;
        const onDrawEventHeightChange = this.onDrawEventHeightChange;
        const getTimeOption = this.getTimeOption;
        const initTimeLineDom = this.initTimeLineDom;
        const refreshTimeLine = this.refreshTimeLine;
        const matchStatus = this.state.status;
        const isMobile = this.props.responsive.data.isMobile;
        // const domDesktop =
        //     <Row gutter={0}>
        //         <Col span={12} className="center">
        //             <div className="playground" style={{width: 300}}>
        //                 <div style={{height: 150, minWidth: 250, display: "block"}}>
        //                     <div className="playground-half">
        //                         <div style={{marginBottom: 150 / 4, marginTop: 10}}>{getHalfPlayer(ZHUCHANG)}</div>
        //                         <div className="half-playground-circle"/>
        //                         <div className="penalty-area">
        //                             <div className="penalty-area-circle"/>
        //                             <div className="keeper-area" style={{bottom: "0%"}}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="w-full mb-m">
        //                     <p className="pull-left mt-n mb-n"
        //                        style={{color: "#FFFFFF"}}>{this.state.data.hostTeam ? this.state.data.hostTeam.name : ""}</p>
        //                     <p className="pull-right mt-xxs mb-n">
        //                         {this.state.hostFormation}
        //                     </p>
        //                 </div>
        //             </div>
        //         </Col>
        //         <Col span={12} className="center">
        //             <div className="playground" style={{width: 300}}>
        //                 <div style={{height: 150, minWidth: 250, display: "block"}}>
        //                     <div className="playground-half">
        //                         <div style={{marginBottom: 150 / 4, marginTop: 10}}>{getHalfPlayer(KECHANG)}</div>
        //                         <div className="half-playground-circle"/>
        //                         <div className="penalty-area">
        //                             <div className="penalty-area-circle"/>
        //                             <div className="keeper-area" style={{bottom: "0%"}}/>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="w-full mb-m">
        //                     <p className="pull-left mt-n mb-n"
        //                        style={{color: "#FFFFFF"}}>{this.state.data.guestTeam ? this.state.data.guestTeam.name : ""}</p>
        //                     <p className="pull-right mt-xxs mb-n">
        //                         {this.state.guestFormation}
        //                     </p>
        //                 </div>
        //             </div>
        //         </Col>
        //     </Row>;
        // const domMoblie =
        //     <div className="center">
        //         <div className="playground" style={{width: 300}}>
        //             <div className="w-full mb-m">
        //                 <p className="pull-left mt-n mb-n"
        //                    style={{color: "#FFFFFF"}}>{this.state.data.guestTeam ? this.state.data.guestTeam.name : ""}</p>
        //                 <p className="pull-right mt-ms-r mb-n">
        //                     {this.state.guestFormation}
        //                 </p>
        //             </div>
        //             <div style={{height: 150, minWidth: 250, display: "block"}} className="reverse">
        //                 <div className="playground-half">
        //                     <div style={{marginBottom: 150 / 4, marginTop: 10}}>{getHalfPlayer(KECHANG, true)}</div>
        //                     <div className="half-playground-circle"/>
        //                     <div className="penalty-area">
        //                         <div className="penalty-area-circle"/>
        //                         <div className="keeper-area" style={{bottom: "0%"}}/>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div style={{height: 150, minWidth: 250, display: "block"}}>
        //                 <div className="playground-half">
        //                     <div style={{marginBottom: 150 / 4, marginTop: 10}}>{getHalfPlayer(ZHUCHANG)}</div>
        //                     <div className="half-playground-circle"/>
        //                     <div className="penalty-area">
        //                         <div className="penalty-area-circle"/>
        //                         <div className="keeper-area" style={{bottom: "0%"}}/>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="w-full mb-m">
        //                 <p className="pull-left mt-n mb-n"
        //                    style={{color: "#FFFFFF"}}>{this.state.data.hostTeam ? this.state.data.hostTeam.name : ""}</p>
        //                 <p className="pull-right mt-xxs mb-n">
        //                     {this.state.hostFormation}
        //                 </p>
        //             </div>
        //         </div>
        //     </div>;

        return visible ?
            <div><Row gutter={2}>
                <Col span={8}>
                    <div className="center">
                        <img className="round-img"
                             src={this.state.data.hostTeam ? this.state.data.hostTeam.headImg : defultAvatar}/>
                    </div>
                    <div className="center w-full mt-m">
                        <p style={{fontSize: responsive.data.isMobile ? 18 : 22}}>{this.state.data.hostTeam ? this.state.data.hostTeam.name : ""}</p>
                    </div>
                    <span className="center w-full">传球准确率</span>
                    <span className="center w-full">{this.state.hostPass}%</span>
                </Col>
                <Col span={8}>
                    <div className="center w-full">
                        <img style={{height: 90, width: 90}} src={vs}/>
                    </div>
                    <div className="center w-full">
                        <p style={{fontSize: 22, paddingLeft: 10, paddingRight: 10}}
                           onClick={this.showStatusDialog}
                           className="mb-s cursor-hand">{this.state.data ? this.state.data.score : "0-0"}</p>
                    </div>
                    {matchStatus == null || matchStatus.status == -1 ? null :
                        <div className="center w-full">
                            <p style={{fontSize: 18}}
                               className="mb-n">{matchStatus && matchStatus.status != 21 ? matchStatus.minute + "'" : ""}</p>
                        </div>
                    }
                    <div className="center w-full">
                        <p onClick={this.showStatusDialog}
                           className="mb-s cursor-hand">{matchStatus && matchStatus.status != -1 ? status[matchStatus.status].text : "未开"}</p>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="center">
                        <img className="round-img"
                             src={this.state.data.guestTeam ? this.state.data.guestTeam.headImg : defultAvatar}/>
                    </div>
                    <div className="center w-full mt-m">
                        <p style={{fontSize: responsive.data.isMobile ? 18 : 22}}>{this.state.data.guestTeam ? this.state.data.guestTeam.name : ""}</p>
                    </div>
                    <span className="center w-full">传球准确率</span>
                    <span className="center w-full">{this.state.guestPass}%</span>
                </Col>
            </Row>
                <div className={this.props.responsive.data.isMobile ? "progress-wrapper" : "progress-wrapper-2"}>
                    <span className="center">控球率</span>
                    <span className="anticon"
                          style={{left: (responsive.data.isMobile ? "0px" : "58px")}}>{this.state.hostPoss}%</span>
                    <Progress percent={this.state.hostPoss} showInfo={false}/>
                    <span className="anticon"
                          style={{right: (responsive.data.isMobile ? "0px" : "58px")}}>{this.state.guestPoss}%</span>
                </div>
                {/*{responsive.data.isMobile ? domMoblie : domDesktop}*/}
                <Timeline className="mt-m" mode="alternate">
                    {initTimeLineDom()}
                    {this.state.timeline}
                    <Timeline.Item className="timeline-left"
                                   dot={<Button icon="plus" shape="circle" size="small"
                                                onClick={onTimelineAddClick}/>}/>
                </Timeline>
                {getTimeOption()}
                <Drawer
                    className="ant-drawer-body-pa-s"
                    title="添加事件"
                    placement="bottom"
                    onClose={onDrawClose}
                    visible={this.state.drawVisible}
                    destroyOnClose={true}
                    height={this.state.drawHeight}
                >
                    <FootBallMatchScoreAddDialog visible={this.state.drawVisible}
                                                 onHeightChange={onDrawHeightChange}
                                                 matchId={this.props.matchId}
                                                 data={this.state.data}
                                                 onClose={onDrawClose}
                                                 onSuccess={refreshTimeLine}
                                                 minute={matchStatus ? matchStatus.minute : 0}
                    />
                </Drawer>
                <Drawer
                    className="ant-drawer-body-pa-s"
                    title="编辑事件"
                    placement="bottom"
                    onClose={onModifyDrawClose}
                    visible={this.state.drawModifyVisible}
                    destroyOnClose={true}
                    height={this.state.drawHeight}
                >
                    <FootBallMatchScoreModifyDialog visible={this.state.drawModifyVisible}
                                                    onHeightChange={onDrawHeightChange}
                                                    matchId={this.props.matchId}
                                                    data={this.state.data}
                                                    record={this.state.record}
                                                    onClose={onModifyDrawClose}
                                                    onSuccess={refreshTimeLine}
                    />
                </Drawer>
                <Drawer
                    className="ant-drawer-body-pa-s"
                    title="添加事件"
                    placement="bottom"
                    onClose={onEventAddDrawClose}
                    visible={this.state.drawEventAddVisible}
                    destroyOnClose={true}
                    height={this.state.drawEventHeight}
                >
                    <FootBallMatchScoreTimeEventAddDialog visible={this.state.drawEventAddVisible}
                                                          matchId={this.props.matchId}
                                                          data={this.state.data}
                                                          onClose={onEventAddDrawClose}
                                                          onSuccess={refreshTimeLine}
                                                          event={this.state.event}
                                                          minute={matchStatus ? matchStatus.minute : 0}
                                                          onHeightChange={onDrawEventHeightChange}
                    />
                </Drawer>
                <Drawer
                    className="ant-drawer-body-pa-s"
                    title="编辑事件"
                    placement="bottom"
                    onClose={onEventModifyDrawClose}
                    visible={this.state.drawEventModifyVisible}
                    destroyOnClose={true}
                    height={this.state.drawEventHeight}
                >
                    <FootBallMatchScoreTimeEventModifyDialog visible={this.state.drawEventModifyVisible}
                                                             matchId={this.props.matchId}
                                                             data={this.state.data}
                                                             record={this.state.record}
                                                             onClose={onEventModifyDrawClose}
                                                             onSuccess={refreshTimeLine}
                                                             onHeightChange={onDrawEventHeightChange}
                    />
                </Drawer>
                <Drawer
                    className="ant-drawer-body-pa-s"
                    title="传球控球率"
                    placement="bottom"
                    onClose={onPassDrawClose}
                    visible={this.state.drawPassVisible}
                    destroyOnClose={true}
                    height={300}
                >
                    <FootBallMatchScorePassDialog visible={this.state.drawPassVisible}
                                                  matchId={this.props.matchId}
                                                  data={this.state.data}
                                                  onClose={onPassDrawClose}
                                                  onSuccess={refreshTimeLine}
                    />
                </Drawer>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    width={800}
                    visible={this.state.dialogStatusVisible}
                    title="比分状态设置"
                    okText="确定"
                    onCancel={this.handleMatchStatusCancel}
                    destroyOnClose="true"
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleMatchStatusConfirm}>确定</Button>,
                        <Button key="back" onClick={this.handleMatchStatusCancel}>取消</Button>,
                    ]}
                >
                    <div>
                        <div className="w-full center">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>比分</span>
                        </div>
                        <Input style={{minWidth: 300, textAlign: "center"}} placeholder='比分'
                               onChange={this.onStatusDialogScoreChange}
                               value={this.state.statusDialogScore}/>
                        <Input style={{minWidth: 300, textAlign: "center"}} placeholder='点球比分'
                               className="mt-m"
                               onChange={this.onStatusDialogPenaltyScoreChange}
                               value={this.state.statusDialogPenaltyScore}/>
                        <Radio.Group className="mt-m" onChange={this.onStatusDialogRaidoChange}
                                     value={this.state.statusDialogRadio}>
                            <Radio value={-1}>未开始</Radio>
                            <Radio value={0}>上半场</Radio>
                            <Radio value={14}>中场休息</Radio>
                            <Radio value={15}>下半场</Radio>
                            <Radio value={21}>比赛结束</Radio>
                        </Radio.Group>
                    </div>
                </Modal>
            </div> : null
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchScoreDialog);