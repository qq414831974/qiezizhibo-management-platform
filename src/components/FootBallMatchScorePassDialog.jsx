import React from "react";
import {receiveData} from "../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button, Row, Col, message, Slider} from 'antd';
import {getPassAndPossession, updatePassAndPossession,} from "../axios";
import defultAvatar from '../static/avatar.jpg';

class FootBallMatchScorePassDialog extends React.Component {
    state = {};

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        getPassAndPossession(this.props.data.id).then((data) => {
            if (data) {
                const hostteam = this.props.data.hostteam;
                const guestteam = this.props.data.guestteam;
                const hostData = data[hostteam.id];
                const guestData = data[guestteam.id];
                if (hostData == null || guestData == null) {
                    this.setState({
                        hostPass: 0,
                        hostPoss: 50,
                        guestPass: 0,
                        guestPoss: 50,
                        sliderValue: 50,
                    });
                }
                hostData && guestData && this.setState({
                    hostPass: hostData.pass,
                    hostPoss: hostData.possession,
                    guestPass: guestData.pass,
                    guestPoss: guestData.possession,
                    sliderValue: hostData.possession,
                });
            } else {
                message.error('获取传控信息失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    }

    updateTimeLine = (param) => {
        updatePassAndPossession(param).then((data) => {
            if (data && data.code === 200) {
                if (data.data) {
                    message.success("修改成功");
                    this.props.onSuccess();
                    this.props.onClose();
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    }

    submit = () => {
        const params = [{
            matchid: this.props.data.id,
            teamid: this.props.data.hostteam.id,
            remark: JSON.stringify({pass: this.state.hostPass, possession: this.state.hostPoss}),
        }, {
            matchid: this.props.data.id,
            teamid: this.props.data.guestteam.id,
            remark: JSON.stringify({pass: this.state.guestPass, possession: this.state.guestPoss}),
        }
        ]
        this.updateTimeLine(params);
    }

    render() {
        const hostteam = this.props.data.hostteam;
        const guestteam = this.props.data.guestteam;
        return <div className="steps-div">
            <div className="qz-live-steps-content-large">
                <div className="w-full center">
                    <span className="mt-s mb-s">控球率</span>
                </div>
                <div className="qz-live-slider-wrapper">
                    <div className="anticon left-0">
                        <img className="qz-live-round-img-xs" alt="主队" src={hostteam.headimg ? hostteam.headimg : defultAvatar} />
                        <div className="w-full">
                            <span>{this.state.hostPoss}%</span>
                        </div>
                    </div>
                    <Slider value={this.state.sliderValue} onChange={value => this.setState({
                        sliderValue: value,
                        hostPoss: value,
                        guestPoss: (100 - value)
                    })}
                    />
                    <div className="anticon right-0">
                        <img className="qz-live-round-img-xs"
                             alt="客队"
                             src={guestteam.headimg ? guestteam.headimg : defultAvatar}
                        />
                        <div className="w-full">
                            <span>{this.state.guestPoss}%</span>
                        </div>
                    </div>
                </div>
                <div className="w-full center">
                    <span className="mt-s mb-s">传球准确率</span>
                </div>
                <Row>
                    <Col span={12}>
                        <div style={{width: "90%", paddingLeft: "5%"}}>
                            <Slider value={this.state.hostPass} onChange={value => this.setState({hostPass: value})} />
                        </div>
                        <div>
                            <img className="qz-live-round-img-xs"
                                 alt="主队"
                                 src={hostteam.headimg ? hostteam.headimg : defultAvatar}
                            />
                            <span>{this.state.hostPass}%</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{width: "90%", paddingLeft: "5%"}}>
                            <Slider value={this.state.guestPass}
                                    onChange={value => this.setState({guestPass: value})}
                            />
                        </div>
                        <div>
                            <img className="qz-live-round-img-xs"
                                 alt="客队"
                                 src={guestteam.headimg ? guestteam.headimg : defultAvatar}
                            />
                            <span>{this.state.guestPass}%</span>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="qz-live-steps-action center">
                <Button type="primary" icon="check" size="large" shape="circle" onClick={() => {
                    this.submit();
                }}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchScorePassDialog);