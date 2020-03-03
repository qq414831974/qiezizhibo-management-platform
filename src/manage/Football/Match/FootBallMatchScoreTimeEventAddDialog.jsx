import React from "react";
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Avatar, Button, message, Input, DatePicker} from 'antd';
import {addTimeline} from "../../../axios";
import start from '../../../static/start.svg';
import half_time from '../../../static/half_time.svg';
import injury from '../../../static/injury.svg';
import extra from '../../../static/extra.svg';
import pause from '../../../static/pause.svg';
import penalty from '../../../static/penalty.svg';
import finish from '../../../static/finish.svg';

class FootBallMatchScoreTimeEventAddDialog extends React.Component {
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
        const currentEvent = this.props.event;
        if (currentEvent.key == 16) {
            this.props.onHeightChange(360);
        } else {
            this.props.onHeightChange(300);
        }
    }

    addTimeline = (param) => {
        addTimeline(param).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success("添加成功", 1);
                    this.props.onSuccess();
                    this.props.onClose();
                }else{
                    message.warn(data.message, 1);
                }
            } else {
                message.error('添加失败：' + (data ? data.result + "-" + data.message + "-" + data.data : data), 3);
            }
        });
    }

    submit = () => {
        const currentEvent = this.props.event;
        const key = currentEvent.key;
        const halfDuration = this.props.data.duration != null && this.props.data.duration > 0 ? this.props.data.duration / 2 : 45;
        const eventData = {
            0: {text: "比赛开始", icon: start, show: 0, minute: 0},
            14: {text: "中场", icon: half_time, show: 0, minute: halfDuration},
            15: {text: "下半场", icon: start, show: 0, minute: halfDuration},
            13: {text: "伤停", icon: injury, show: 0, minute: this.props.minute},
            11: {text: "加时", icon: extra, show: 0, minute: this.props.minute},
            12: {text: "点球大战", icon: penalty, show: 0, minute: 120},
            21: {text: "比赛结束", icon: finish, show: 0, minute: 150},
            16: {text: "暂停", icon: pause, show: 0, minute: this.props.minute},
        }
        const params = {
            matchId: this.props.data.id,
            eventType: this.props.event.key,
            minute: this.state.minute ? this.state.minute : eventData[key].minute,
            remark: this.state.remark,
            text: this.state.text,
        }
        this.addTimeline(params);
    }
    setRemark = (data) => {
        this.setState({remark: data});
    }
    getEventDetail = () => {
        const currentEvent = this.props.event;
        if (currentEvent == null) {
            return null;
        }
        const doms = {
            0: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            14: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            15: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            13: <div>
                <span className="mr-s">伤停时间:</span>
                <Input addonAfter="分" onChange={(e) => {
                    this.setRemark(e.target.value);
                }}/>
            </div>,
            11: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            12: <div>
                <span className="mr-s">开始于:</span>
                <DatePicker showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={(value, dateString) => {
                                this.setRemark(dateString);
                            }}/>
            </div>,
            21: "",
            16: <div>
                <span className="mr-s">暂停时间:</span>
                <Input addonAfter="分" onChange={(e) => {
                    this.setRemark(e.target.value);
                }}/>
            </div>,
        };
        currentEvent.dom = doms[currentEvent.key];
        return <div>
            <div>
                <Avatar src={currentEvent.icon}/>
            </div>
            <div className="w-full">
                <span style={{fontSize: 14}}>{currentEvent.text}</span>
            </div>
            {currentEvent.key == 16 &&
            <div className="pt-s">
                <Input defaultValue={this.state.minute ? this.state.minute : this.props.minute}
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
                <Input.TextArea rows={2} style={{maxWidth: "350px"}} onChange={this.onTextChange} className="center"
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

    render() {
        const {data} = this.props;
        const getEventDetail = this.getEventDetail;
        return <div className="steps-div">
            <div
                className="steps-content-large">{getEventDetail()}</div>
            <div className="steps-action center">
                <Button type="primary" icon="check" size="large" shape="circle" onClick={() => {
                    this.submit();
                }}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchScoreTimeEventAddDialog);