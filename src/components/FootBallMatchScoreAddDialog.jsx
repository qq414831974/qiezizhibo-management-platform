import React from "react";
import {receiveData} from "../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Avatar, Button, Row, Col, Icon, Spin, Collapse, message, Input, Select} from 'antd';
import {getMatchPlayersByTeamId, addTimeline} from "../axios";
import defultAvatar from '../static/avatar.jpg';
import shirt from '../static/event/shirt.png';
import shirt2 from '../static/event/shirt2.png';
import yellowcard from '../static/event/yellowcard.svg';
import redcard from '../static/event/redcard.svg';
import offside from '../static/event/offside.svg';
import goal from '../static/event/goal.svg';
import substitution from '../static/event/substitution.svg';
import shoot from '../static/event/shoot.svg';
import tackle from '../static/event/tackle.svg';
import free_kick from '../static/event/free_kick.svg';
import foul from '../static/event/foul.svg';
import save from '../static/event/save.svg';
import corner from '../static/event/corner.svg';
import long_pass from '../static/event/long_pass.svg';
import clearance from '../static/event/clearance.svg';
import cross from '../static/event/cross.svg';
import own_goal from '../static/event/own_goal.svg';
import shoot_out from '../static/event/shoot_out.svg';
import shoot_door from '../static/event/shoot_door.svg';
import cross_failed from '../static/event/cross_failed.svg';
import cross_success from '../static/event/cross_success.svg';
import tackle_failed from '../static/event/tackle_failed.svg';
import penalty from '../static/event/penalty.svg';

const Option = Select.Option;
const Panel = Collapse.Panel;
const HOSTTEAM = 0;
const GUESTTEAM = 1;
const eventType = {
    0: {text: "比赛开始", icon: "", show: true},
    1: {text: "进球", icon: "", show: true},
    2: {text: "射门", icon: ""},
    3: {text: "越位", icon: ""},
    4: {text: "抢断", icon: ""},
    5: {text: "任意球", icon: ""},
    6: {text: "犯规", icon: ""},
    7: {text: "黄牌", icon: "", show: true},
    8: {text: "红牌", icon: "", show: true},
    9: {text: "扑救", icon: ""},
    10: {text: "换人", icon: "", show: true},
    11: {text: "加时", icon: "", show: true},
    12: {text: "点球大战", icon: "", show: true},
    13: {text: "伤停", icon: ""},
    14: {text: "中场", icon: "", show: true},
    15: {text: "下半场", icon: "", show: true},
    16: {text: "暂停", icon: ""},
    17: {text: "角球", icon: ""},
    18: {text: "传中", icon: ""},
    19: {text: "长传", icon: ""},
    20: {text: "解围", icon: ""},
    21: {text: "比赛结束", icon: "", show: true},
    22: {text: "乌龙球", icon: ""},
    24: {text: "点球", icon: ""},
    25: {text: "进球(点球大战)", icon: "", hideTime: true, minute: 121},
}
const event = [
    {key: 1, text: "进球", icon: goal, show: 1},
    {key: 7, text: "黄牌", icon: yellowcard, show: 1},
    {key: 8, text: "红牌", icon: redcard, show: 1},
    {key: 17, text: "角球", icon: corner, show: 1},
    {key: 5, text: "任意球", icon: free_kick, show: 1},
    {key: 2, text: "射门", icon: shoot, show: 1},
    {key: 9, text: "扑救", icon: save, show: 1},
    {key: 24, text: "点球", icon: penalty, show: 1},

    {key: 0, text: "比赛开始", icon: "", show: 0},
    {key: 14, text: "中场", icon: "", show: 0},
    {key: 15, text: "下半场", icon: "", show: 0},
    {key: 11, text: "加时", icon: "", show: 0},
    {key: 12, text: "点球大战", icon: "", show: 0},
    {key: 21, text: "比赛结束", icon: "", show: 0},
    {key: 16, text: "暂停", icon: "", show: 0},
    {key: 13, text: "伤停", icon: "", show: 0},

    {key: 10, text: "换人", icon: substitution, show: 2},
    {key: 3, text: "越位", icon: offside, show: 2},
    {key: 4, text: "抢断", icon: tackle, show: 2},
    {key: 6, text: "犯规", icon: foul, show: 2},
    {key: 18, text: "传中", icon: cross, show: 2},
    {key: 19, text: "长传", icon: long_pass, show: 2},
    {key: 20, text: "解围", icon: clearance, show: 2},
    {key: 22, text: "乌龙球", icon: own_goal, show: 2},
    {key: 25, text: "进球(点球大战)", icon: penalty, show: 2},
]

class FootBallMatchScoreAddDialog extends React.Component {
    state = {
        current: 0,
        currentChecked: false,
        team: null,
        player: null,
        loading: true,
        hidden: true,
    };

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.props.data.hostteam.isHostTeam = true;
        this.props.data.guestteam.isHostTeam = false;
        const callback1 = () => {
            this.check1 = true;
            if (this.check1 && this.check2) {
                this.setState({loading: false});
            }
        }
        const callback2 = () => {
            this.check2 = true;
            if (this.check1 && this.check2) {
                this.setState({loading: false});
            }
        }
        this.fetchTeamPlayer(this.props.matchId, this.props.data.hostteam.id, HOSTTEAM, callback1);
        this.fetchTeamPlayer(this.props.matchId, this.props.data.guestteam.id, GUESTTEAM, callback2);
    }

    fetchTeamPlayer = (matchId, teamId, type, callback) => {
        getMatchPlayersByTeamId(null, teamId).then((data) => {
            if (data && data.code == 200) {
                if (type == HOSTTEAM) {
                    this.setState({hostTeamPlayer: data.data ? data.data.records : []})
                } else {
                    this.setState({guestTeamPlayer: data.data ? data.data.records : []})
                }
                callback();
            } else {
                message.error('获取比赛队伍队员失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    addTimeline = (param) => {
        addTimeline(param).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success("添加成功", 1);
                    this.props.onSuccess();
                    this.props.onClose();
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message + "-" + data.data : data), 3);
            }
        });
    }
    getTeamOption = () => {
        let dom = [];
        let teamPlayerData = [];
        if (this.state.team) {
            if (this.state.team.isHostTeam) {
                teamPlayerData = this.state.hostTeamPlayer;
            } else {
                teamPlayerData = this.state.guestTeamPlayer;
            }
            teamPlayerData.forEach((item, index) => {
                dom.push(<Option value={item.id + ""} data={item.id}>{<div className="inline-p"><Avatar
                    src={item.headImg}/>
                    <p
                        className="ml-s">{item.name + "(" + item.shirtNum + "号)"}</p></div>}</Option>)
            });
        }
        return dom;
    }

    next() {
        const current = this.state.current + 1;
        let currentChecked = false;
        if (current == 0 && this.state.team != null) {
            currentChecked = true;
        }
        if (current == 1 && this.state.player != null) {
            currentChecked = true;
        }
        if (current == 2 && this.state.event != null) {
            currentChecked = true;
        }
        this.setState({current: current, currentChecked: currentChecked});
        if (current == 1) {
            this.props.onHeightChange(380);
        } else if (current == 2) {
            let hidden = this.state.hidden;
            if (this.state.event) {
                if (this.state.event.show == 2) {
                    this.setState({hidden: false});
                    hidden = false;
                }
            }
            if (hidden) {
                this.props.onHeightChange(350);
            } else {
                this.props.onHeightChange(500);
            }
        } else if (current == 3) {
            this.props.onHeightChange(400);
        } else {
            this.props.onHeightChange(270);
        }
    }

    prev() {
        const current = this.state.current - 1;
        let currentChecked = false;
        if (current == 0 && this.state.team != null) {
            currentChecked = true;
        }
        if (current == 1 && this.state.player != null) {
            currentChecked = true;
        }
        if (current == 2 && this.state.event != null) {
            currentChecked = true;
        }
        this.setState({current: current, currentChecked: currentChecked});
        if (current == 1) {
            this.props.onHeightChange(380);
        } else if (current == 2) {
            let hidden = this.state.hidden;
            if (this.state.event) {
                if (this.state.event.show == 2) {
                    this.setState({hidden: false});
                    hidden = false;
                }
            }
            if (hidden) {
                this.props.onHeightChange(350);
            } else {
                this.props.onHeightChange(500);
            }
        } else if (current == 3) {
            this.props.onHeightChange(400);
        } else {
            this.props.onHeightChange(270);
        }
    }

    onTeamSelect = (isHostTeam, e) => {
        this.setState({team: isHostTeam ? this.props.data.hostteam : this.props.data.guestteam, currentChecked: true});
        this.next();
    }
    onPlayerSelect = (player, e) => {
        this.setState({player: player, currentChecked: true});
        this.next();
    }
    getTeamPlayerList = () => {
        let doms = [];
        let teamPlayerData = null;
        const shirtStyle = {position: "absolute", fontSize: 12, color: "#FFFFFF",};
        const shirtStyle2 = {position: "absolute", fontSize: 12, color: "#000000",};
        const onPlayerSelect = this.onPlayerSelect;
        if (this.state.team) {
            if (this.state.team.isHostTeam) {
                teamPlayerData = this.state.hostTeamPlayer;
            } else {
                teamPlayerData = this.state.guestTeamPlayer;
            }
            teamPlayerData.forEach((item, index) => {
                // if (item.status !== 3) {//1：首发，2：替补，3：队员 队员不显示
                let dom_div = (
                    <Col key={item.id}
                         span={(Math.floor(24 / (teamPlayerData.length > 6 ? 6 : teamPlayerData.length)))}>
                        <div onClick={onPlayerSelect.bind(this, item)}
                             className={this.state.player === item ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                            <div style={{width: "58px", position: "relative"}}>
                                <div className="center" style={{position: "absolute", right: 0}}>
                                    <img
                                        alt={item.status === 1 ? "首发" : "队员"}
                                        style={{opacity: 0.8, width: "20px", height: "20px"}}
                                        src={item.status === 1 ? shirt : shirt2}/>
                                    <p style={item.status === 1 ? shirtStyle : shirtStyle2}>{item.shirtNum}</p>
                                </div>
                                <img className="qz-live-round-img-s" alt="头像" src={item.headImg ? item.headImg : defultAvatar}/>
                                <p className="mb-n">{item.name}</p>
                            </div>
                        </div>
                    </Col>);
                let row = Math.floor(index / 6);
                if (!doms[row]) {
                    doms[row] = [];
                }
                doms[row].push(dom_div)
                // }
            });
        }
        let dom = [];
        doms.forEach((item, index) => {
            dom.push(<Row key={index} className="center" gutter={2}>{item}</Row>)
        });
        return <div>
            <p className="w-full mb-n"
               style={{fontSize: 20}}
            >选择球员</p>
            {dom}
        </div>;
    };
    getEventList = () => {
        let doms = [];
        let doms_hidden = [];
        const onEventSelect = this.onEventSelect;
        const onHiddenChange = this.onHiddenChange;
        const rowSize = this.props.responsive.data.isMobile ? 4 : 6;
        let indes = 0;
        let index_hidden = 0;
        event.forEach((item, index) => {
            if (item.show == 1) {
                let row = Math.floor(indes / rowSize);
                let dom_div = (<Col key={item.key} span={Math.floor(24 / rowSize)}>
                    <div onClick={onEventSelect.bind(this, item)}
                         className={this.state.event === item ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                        <div style={{width: "78px", position: "relative"}}>
                            <img className="qz-live-round-img-m" alt={item.text} src={item.icon ? item.icon : defultAvatar}/>
                            <p className="mb-n">{item.text}</p>
                        </div>
                    </div>
                </Col>);
                if (!doms[row]) {
                    doms[row] = [];
                }
                doms[row].push(dom_div)
                indes = indes + 1;
            } else if (item.show == 2) {
                let row = Math.floor(index_hidden / rowSize);
                let dom_div = (<Col key={item.key} span={Math.floor(24 / rowSize)}>
                    <div onClick={onEventSelect.bind(this, item)}
                         className={this.state.event === item ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                        <div style={{width: "78px", position: "relative"}}>
                            <img className="qz-live-round-img-m" alt={item.text} src={item.icon ? item.icon : defultAvatar}/>
                            <p className="mb-n">{item.text}</p>
                        </div>
                    </div>
                </Col>);
                if (!doms_hidden[row]) {
                    doms_hidden[row] = [];
                }
                doms_hidden[row].push(dom_div)
                index_hidden = index_hidden + 1;
            }
        });
        let dom = [];
        doms.forEach((item, index) => {
            dom.push(<Row key={`row_show${index}`} className="center" gutter={2}>{item}</Row>)
        });
        let dom_hidden = [];
        doms_hidden.forEach((item, index) => {
            dom_hidden.push(<Row key={`row_hidden${index}`} hidden={this.state.hidden} className="center"
                                 gutter={2}>{item}</Row>)
        });
        return <div>
            <p className="w-full mb-n"
               style={{fontSize: 20}}
            >选择事件</p>
            {dom}
            <Collapse activeKey={this.state.hidden ? null : "1"} onChange={onHiddenChange} bordered={false}
                      className="qz-live-step-collapse-no-border"
            >
                <Panel header={
                    <div className="w-full center" style={{paddingRight: "40px"}}>
                        <Icon type={this.state.hidden ? "down" : "up"} style={{fontSize: 15}}/>
                    </div>
                }
                       forceRender
                       key="1">
                    {dom_hidden}
                </Panel>
            </Collapse>
        </div>;
    }
    onEventSelect = (item, e) => {
        if (item != this.state.event) {
            this.setState({event: item, currentChecked: true, remark: null, text: null, minute: null});
        } else {
            this.setState({event: item, currentChecked: true});
        }
        this.next();
    }
    onHiddenChange = (e) => {
        if (e.length != 0) {
            this.setState({hidden: false});
            this.props.onHeightChange(500);
        } else {
            this.setState({hidden: true});
            this.props.onHeightChange(350);
        }
    }
    submit = () => {
        const params = {
            matchId: this.props.data.id,
            teamId: this.state.team.id,
            playerId: this.state.player.id,
            eventType: this.state.event.key,
            minute: this.state.minute ? this.state.minute : (eventType[this.state.event.key]["minute"] ? eventType[this.state.event.key]["minute"] : this.props.minute),
            remark: this.state.event.key === 25 ? "1" : this.state.remark,
            text: this.state.text,
        }
        this.addTimeline(params);
    }
    getEventDetail = () => {
        const currentEvent = this.state.event;
        const onEventDetailSelect = this.onEventDetailSelect;
        if (currentEvent == null) {
            return null;
        }
        const doms = {
            1: <div className="pt-m">
                <div className="center">
                    <span>助攻</span>
                </div>
                <div className="center mt-s">
                    <Select size="large" style={{minWidth: 150}}
                            onSelect={this.onEventPlayerSelect}>{this.getTeamOption()}</Select>
                </div>
            </div>,
            7: null,
            8: null,
            10: <div className="pt-m">
                <div className="center">
                    <span>换上</span>
                </div>
                <div className="center mt-s">
                    <Select size="large" style={{minWidth: 150}}
                            onSelect={this.onEventPlayerSelect}>{this.getTeamOption()}</Select>
                </div>
            </div>,
            2: <div className="pt-m center">
                <div
                    onClick={onEventDetailSelect.bind(this, 3)}
                    className={currentEvent.key === 2 && this.state.remark === 3 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="射偏" src={shoot_out}/>
                        <p className="mb-n">射偏</p>
                    </div>
                </div>
                <div
                    onClick={onEventDetailSelect.bind(this, 2)}
                    className={currentEvent.key === 2 && this.state.remark === 2 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="射在门框" src={shoot_door}/>
                        <p className="mb-n">射在门框</p>
                    </div>
                </div>
                <div
                    onClick={onEventDetailSelect.bind(this, 1)}
                    className={currentEvent.key === 2 && this.state.remark === 1 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="射门被拦截" src={save}/>
                        <p className="mb-n">射门被拦截</p>
                    </div>
                </div>
            </div>,
            3: null,
            4: <div className="pt-m center">
                <div
                    onClick={onEventDetailSelect.bind(this, 0)}
                    className={currentEvent.key === 4 && this.state.remark === 0 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="失败" src={tackle_failed}/>
                        <p className="mb-n">失败</p>
                    </div>
                </div>
                <div
                    onClick={onEventDetailSelect.bind(this, 1)}
                    className={currentEvent.key === 4 && this.state.remark === 1 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="成功" src={tackle}/>
                        <p className="mb-n">成功</p>
                    </div>
                </div>
            </div>,
            5: null,
            6: null,
            9: null,
            17: null,
            18: <div className="pt-m center">
                <div
                    onClick={onEventDetailSelect.bind(this, 0)}
                    className={currentEvent.key === 18 && this.state.remark === 3 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="失败" src={cross_failed}/>
                        <p className="mb-n">失败</p>
                    </div>
                </div>
                <div
                    onClick={onEventDetailSelect.bind(this, 1)}
                    className={currentEvent.key === 18 && this.state.remark === 2 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="qz-live-round-img-m" alt="成功" src={cross_success}/>
                        <p className="mb-n">成功</p>
                    </div>
                </div>
            </div>,
            19: null,
            20: null,
            22: null,
            24:<div className="pt-m center">
                <div
                    onClick={onEventDetailSelect.bind(this, 0)}
                    className={currentEvent.key === 24 && this.state.remark === 0 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="round-img-m" src={shoot_out}/>
                        <p className="mb-n">没进</p>
                    </div>
                </div>
                <div
                    onClick={onEventDetailSelect.bind(this, 1)}
                    className={currentEvent.key === 24 && this.state.remark === 1 ? "qz-live-step-item-hover qz-live-step-item-selected center" : "qz-live-step-item-hover center"}>
                    <div style={{width: "78px", position: "relative"}}>
                        <img className="round-img-m" src={shoot}/>
                        <p className="mb-n">进球</p>
                    </div>
                </div>
            </div>,
            25: null,
        };
        currentEvent.dom = doms[currentEvent.key];
        const hideTime = eventType[currentEvent.key].hideTime;
        return <div>
            <div>
                <Avatar src={currentEvent.icon}/>
            </div>
            <div className="w-full">
                <span style={{fontSize: 14}}>{currentEvent.text}</span>
            </div>
            <div className="pt-s">
                {hideTime == true ? null :
                    <Input defaultValue={this.state.minute ? this.state.minute : this.props.minute}
                           onChange={this.onTimeChange}
                           style={{width: 130}}
                           addonBefore="在"
                           addonAfter="分钟"/>}
            </div>
            {currentEvent.dom}
            <div className="center pt-s">
                <span>描述</span>
            </div>
            <div className="center w-full pl-l pr-l pt-s">
                <Input.TextArea rows={2} style={{maxWidth: "350px"}} onChange={this.onTextChange} className="center"
                                placeholder="请输入描述文字不(不超过50字)"/>
            </div>
        </div>
    }
    onEventPlayerSelect = (e, op) => {
        this.setState({
            remark: op.props.data,
        });
    }
    onEventDetailSelect = (value, e) => {
        this.setState({
            remark: value,
        });
    }
    onTimeChange = (e) => {
        const value = e.target.value
        e.target.value = e.target.value.replace(/[^\d]/g, '')
        if (value > 999) {
            alert("数值过大");
            e.target.value = null;
            return;
        }
        this.setState({
            minute: Number.parseInt(value),
        });
    }
    onTextChange = (e) => {
        this.setState({
            text: e.target.value,
        });
    }

    render() {
        const {data} = this.props;
        const {current, currentChecked} = this.state;
        const onTeamSelect = this.onTeamSelect;
        const getTeamPlayerList = this.getTeamPlayerList;
        const getEventList = this.getEventList;
        const getEventDetail = this.getEventDetail;
        let clazzName = this.state.current >= 1 ? "qz-live-steps-content-large" : "qz-live-steps-content";
        if (this.state.current === 2 && !this.state.hidden) {
            clazzName = "qz-live-steps-content-large-more";
        }
        const steps = [{
            content: <div>
                <p className="w-full mb-n" style={{fontSize: 20}}>选择球队</p>
                <Row gutter={24}>
                    <Col span={12}>
                        <div
                            className={this.state.team && (data.hostteam.id === this.state.team.id) ? "qz-live-step-item-hover qz-live-step-item-selected" : "qz-live-step-item-hover"}
                            onClick={onTeamSelect.bind(this, true)}>
                            <img className="qz-live-round-img mt-s" alt="主队" src={data.hostteam.headImg}/>
                            <p style={{fontSize: 16}} className="w-full">{data.hostteam.name}</p>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div
                            className={this.state.team && (data.guestteam.id === this.state.team.id) ? "qz-live-step-item-hover qz-live-step-item-selected" : "qz-live-step-item-hover"}
                            onClick={onTeamSelect.bind(this, false)}>
                            <img className="qz-live-round-img mt-s" alt="客队" src={data.guestteam.headImg}/>
                            <p style={{fontSize: 16}} className="w-full">{data.guestteam.name}</p>
                        </div>
                    </Col>
                </Row>
            </div>,
        }, {
            content: getTeamPlayerList(),
        }, {
            content: getEventList(),
        }, {
            content: getEventDetail(),
        }];
        return this.state.loading ? <div className="center">
                <Spin/>
            </div>
            : <div className="qz-live-steps-div">
                <div
                    className={clazzName}>{steps[current].content}</div>
                <div className="qz-live-steps-action center">
                    {
                        current > 0
                        && (
                            <Button icon="arrow-left" size="large" shape="circle"
                                    onClick={() => this.prev()}/>
                        )
                    }
                    {
                        current < steps.length - 1
                        &&
                        <Button disabled={!currentChecked} type="primary" icon="arrow-right" size="large" shape="circle"
                                className={current === 0 ? "" : "ml-m"}
                                onClick={() => this.next()}/>
                    }
                    {
                        current === steps.length - 1
                        && <Button type="primary" icon="check" size="large" shape="circle"
                                   className="ml-m" onClick={() => {
                            this.submit();
                        }}/>
                    }
                </div>
            </div>;
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchScoreAddDialog);