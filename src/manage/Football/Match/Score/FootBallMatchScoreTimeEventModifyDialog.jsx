import React from "react";
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Avatar, Button, message, Input, Popconfirm, DatePicker, Modal} from 'antd';
import {deleteTimelineByIds, updateTimeline} from "../../../../axios";
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
import start from '../../../../static/start.svg';
import half_time from '../../../../static/half_time.svg';
import injury from '../../../../static/injury.svg';
import extra from '../../../../static/extra.svg';
import pause from '../../../../static/pause.svg';
import penalty from '../../../../static/penalty.svg';
import finish from '../../../../static/finish.svg';
import moment from 'moment'
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const START = 0;
const SECOND_HALF = 15;
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
}

class FootBallMatchScoreTimeEventModifyDialog extends React.Component {
    state = {
        current: 0,
        currentChecked: false,
        loading: true,
        hidden: true,
    };

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        const currentEvent = this.props.record;
        if (currentEvent.eventType == 16) {
            this.props.onHeightChange(360);
        } else {
            this.props.onHeightChange(300);
        }
    }

    updateTimeline = (param) => {
        updateTimeline(param).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success("修改成功");
                    this.props.onSuccess();
                    this.props.onClose();
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    submit = () => {
        const currentEvent = this.props.record;
        const params = {
            id: currentEvent.id,
            matchId: this.props.data.id,
            eventType: this.props.record.eventType,
            minute: this.state.minute ? this.state.minute : currentEvent.minute,
            remark: this.state.remark ? this.state.remark : currentEvent.remark,
            text: this.state.text ? this.state.text : currentEvent.text,
        }
        this.updateTimeline(params);
    }
    setRemark = (data) => {
        this.setState({remark: data});
    }
    getEventDetail = () => {
        const {record} = this.props;
        const currentEvent = eventType[record.eventType];
        if (currentEvent == null) {
            return null;
        }
        const doms = {
            0: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            defaultValue={moment(record.remark)}
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            14: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            defaultValue={moment(record.remark)}
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            15: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            defaultValue={moment(record.remark)}
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            13: <div>
                <span className="mr-s">伤停时间:</span>
                <Input addonAfter="分" defaultValue={record.remark} onChange={(e) => {
                    this.setRemark(e.target.value);
                }}/>
            </div>,
            11: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            defaultValue={moment(record.remark)}
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            12: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            defaultValue={moment(record.remark)}
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            21: "",
            16: <div>
                <span className="mr-s">暂停时间:</span>
                <Input addonAfter="分" defaultValue={record.remark} onChange={(e) => {
                    this.setRemark(e.target.value);
                }}/>
            </div>,
        };
        currentEvent.dom = doms[record.eventType];
        return <div>
            <div>
                <Avatar src={currentEvent.icon}/>
            </div>
            <div className="w-full">
                <span style={{fontSize: 14}}>{currentEvent.text}</span>
            </div>
            {record.eventType == 16 &&
            <div className="pt-s">
                <Input defaultValue={this.state.minute ? this.state.minute : record.minute}
                       onChange={this.onTimeChange}
                       style={{width: 130}}
                       addonBefore="在"
                       addonAfter="分钟"/>
            </div>}
            {currentEvent.dom}
            <div className="center pt-s">
                <span>描述</span>
            </div>
            <div className="center w-full pl-l pr-l pt-s">
                <Input.TextArea rows={2} style={{maxWidth: "350px"}} defaultValue={record.text}
                                onChange={this.onTextChange} className="center"
                                placeholder="请输入描述文字"/>
            </div>
        </div>
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
    onDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    onDelete = () => {
        const id = this.props.record.id;
        deleteTimelineByIds({id: [id]}).then((data) => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    message.success("删除成功");
                    this.props.onSuccess();
                    this.props.onClose();
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    render() {
        const getEventDetail = this.getEventDetail;
        const onDelete = this.onDelete;
        const onDeleteCancel = this.onDeleteCancel;
        const currentEvent = this.props.record.eventType;

        const isMobile = this.props.responsive.data.isMobile;

        return <div className="steps-div">
            <div className="step-delete-item">
                <Button icon="delete" shape="circle" type="danger" onClick={() => {
                    this.setState({deleteVisible: true});
                }}/>
            </div>
            <div
                className="steps-content-large">{getEventDetail()}</div>
            <div className="steps-action center">
                <Button type="primary" icon="check" size="large" shape="circle" onClick={() => {
                    this.submit();
                }}/>
            </div>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={onDelete}
                onCancel={onDeleteCancel}
                zIndex={1001}
            >
                <p className="mb-n"
                   style={{fontSize: 14}}>{currentEvent == START || currentEvent == SECOND_HALF ? "将删除" + eventType[currentEvent].text + "的所有数据，确定?" : "确定要删除吗?"}</p>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchScoreTimeEventModifyDialog);