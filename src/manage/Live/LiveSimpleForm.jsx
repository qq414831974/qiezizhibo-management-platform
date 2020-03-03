import React from 'react';
import {
    Form,
    Input,
    Icon,
    Row,
    DatePicker,
    Col,
    message,
    Button,
    Radio,
    Popover,
    InputNumber,
    Modal
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import copy from "copy-to-clipboard/index";
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getActivityDetailInfo, getPing} from "../../axios";
import VideoPlayer from "../Live/VideoPlayer";
import imgcover from "../../static/imgcover.jpg";
import play_button from "../../static/play-button.png";
import {flashChecker} from "../../utils/tools.js";

const RadioGroup = Radio.Group;
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
const smallFormItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 9},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
    },
};

class LiveSimpleForm extends React.Component {
    state = {
        peopleShow: false,
        loading: true,
    }

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        getPing(this.props.record.id).then((data) => {
            this.setState({data: data ? data : ""})
        });
        getActivityDetailInfo(this.props.record.id).then((data) => {
            if (data && data.message == null) {
                this.setState({
                    loading: false,
                    cover: data ? data.data.imgCover : imgcover
                });
            } else {
                message.error('获取直播信息失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });
        this.timerID = setInterval(
            () => {
                getPing(this.props.record.id).then((data) => {
                    this.setState({data: data ? data : ""})
                });
            },
            3000
        );
    }

    componentWillUnmount() {
        if (this.timerID) {
            clearInterval(this.timerID);
        }
    }

    hidPopup = () => {
        this.setState({peopleShow: false})
    }
    showPopup = () => {
        this.setState({peopleShow: true})
    }
    handleVideoPlayDialogCancel = () => {
        this.setState({
            dialogPlayVisible: false,
        });
    }
    showVideoPlayDialog = () => {
        const {record} = this.props;
        if(!record.isPushing){
            alert("未在推流，无法播放");
            return;
        }
        const fls = flashChecker();
        if (!fls.f) {
            window.location.href = "http://get.adobe.com/cn/flashplayer/";
        } else {
            this.setState({
                dialogPlayVisible: true,
            });
        }
    }
    replaceName = (name) => {
        return name.replace("qsn-", "")
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const stream = record && visible ? record.stream : "";
        // const authKeys = record && visible ? record.authKeys : null;
        // const m3u8 = authKeys ? authKeys.m3u8 : "";
        const streamUrl = record && visible ? `rtmp://${record.pushDomain}/${record.app}/${stream}` : "";
        const playUrl = record && visible ? `http://${record.pullDomain}/${record.app}/${stream}.m3u8` : "";
        const isMobile = this.props.responsive.data.isMobile;
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            width: 468,
            preload: "auto",
            poster: this.state.cover,
            techOrder: ['html5'],
            sources: [{
                type: "application/x-mpegURL",
                src: playUrl,
            }]
        }
        const content = <div>
            <FormItem {...smallFormItemLayout} className="bs-form-item" label="最小值">
                {getFieldDecorator('fake.increaseMin', {
                    initialValue: record.fake.increaseMin,
                    rules: [{required: true, message: '请输入最小值!'}],
                })(
                    <InputNumber/>
                )}
            </FormItem>
            <FormItem {...smallFormItemLayout} className="bs-form-item" label="最大值">
                {getFieldDecorator('fake.increaseMax', {
                    initialValue: record.fake.increaseMax,
                    rules: [{required: true, message: '请输入最大值!'}],
                })(
                    <InputNumber/>
                )}
            </FormItem>
            <Button className="w-full" type="primary" onClick={this.hidPopup}>确定</Button>
        </div>;

        return (
            visible ?
                <Row>
                    <Col md={16}>
                        <Form>
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('id', {
                                    initialValue: record.id,
                                })(
                                    <p hidden={true}/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                                {getFieldDecorator('name', {
                                    initialValue: this.replaceName(record.name),
                                    rules: [{required: true, message: '请输入直播名称!'}],
                                })(
                                    <Input placeholder={this.replaceName(record.name)}/>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="时间" className="bs-form-item">
                                <div className="inline">
                                    <div className="inline-block">
                                        {isMobile ? <span>开始：</span> : null}
                                        <FormItem className="inline-block">
                                            {getFieldDecorator('startedAt', {
                                                initialValue: moment(record.startedAt),
                                                rules: [{required: true, message: '请选择时间!'}],
                                            })(
                                                <DatePicker showTime
                                                            format={'YYYY-MM-DD HH:mm'}/>
                                            )}
                                        </FormItem>
                                    </div>
                                    {isMobile ? null : <span>-</span>}
                                    <div className="inline-block">
                                        {isMobile ? <span>结束：</span> : null}
                                        <FormItem className="inline-block">
                                            {getFieldDecorator('endedAt', {
                                                initialValue: moment(record.endedAt),
                                                rules: [{required: true, message: '请选择时间!'}],
                                            })(
                                                <DatePicker showTime
                                                            format={'YYYY-MM-DD HH:mm'}/>
                                            )}
                                        </FormItem>
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem {...formItemLayout} label="推流链接" colon={true} className="bs-form-item">
                                <Col span={23}>
                                    <FormItem>
                                        {getFieldDecorator('streamUrl', {
                                            initialValue: streamUrl,
                                        })(
                                            <Input disabled={true} className="cursor-text"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1}>
                                    <Icon type="copy" style={{fontSize: 16}} onClick={() => {
                                        copy(streamUrl);
                                        message.success('推流链接已复制到剪贴板');
                                    }}/>
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayout} label="正在推流" className="bs-form-item">
                                {getFieldDecorator('isPushing', {
                                    initialValue: record.isPushing,
                                })(
                                    <RadioGroup disabled={true}>
                                        <Radio value={true}>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            {/*<FormItem {...formItemLayout} label="启用人数放大" className="bs-form-item">*/}
                            {/*    {getFieldDecorator('isFakeEnabled', {*/}
                            {/*        initialValue: record.isFakeEnabled,*/}
                            {/*    })(*/}
                            {/*        <RadioGroup onChange={(e) => {*/}
                            {/*            this.setState({peopleShow: e.target.value})*/}
                            {/*        }}>*/}
                            {/*            <Popover content={content} title="人数放大" visible={this.state.peopleShow}>*/}
                            {/*                <Radio value={true} onClick={this.showPopup}>是</Radio></Popover>*/}
                            {/*            <Radio value={false}>否</Radio>*/}
                            {/*        </RadioGroup>*/}
                            {/*    )}*/}
                            {/*</FormItem>*/}
                            {/*<FormItem {...formItemLayout} label="基础人数" className="bs-form-item">*/}
                            {/*    {getFieldDecorator('fake.baseCount', {*/}
                            {/*        initialValue: record.fake.baseCount,*/}
                            {/*    })(*/}
                            {/*        <InputNumber style={{maxWidth: 80}}/>*/}
                            {/*    )}*/}
                            {/*</FormItem>*/}
                            {/*<FormItem {...formItemLayout} label="在线人数" className="bs-form-item">*/}
                            {/*    {this.state.data ? this.state.data.online : 0}*/}
                            {/*</FormItem>*/}
                            {this.props.detail ?
                                <div className="center">
                                    <Button type="primary" onClick={this.props.handleSave}>保存配置</Button>
                                </div> : null
                            }
                        </Form>
                    </Col>
                    {
                        <Col md={8}>
                            <div className="center">
                                {this.state.loading ? null :
                                    <div className="w-full" onClick={this.showVideoPlayDialog}>
                                        <img src={this.state.cover} className="w-full"/>
                                        <img className="live-video-play-button" src={play_button}/>
                                    </div>
                                }
                            </div>
                        </Col>
                    }
                    <Modal
                        title="视频播放"
                        visible={this.state.dialogPlayVisible}
                        destroyOnClose="true"
                        zIndex={1001}
                        footer={[
                            <Button key="back" onClick={this.handleVideoPlayDialogCancel}>取消</Button>,
                        ]}
                        onCancel={this.handleVideoPlayDialogCancel}>
                        <VideoPlayer {...videoJsOptions}/>
                    </Modal>
                </Row>
                :
                <div/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveSimpleForm);