import React from 'react';
import {Row, Col, Card, Icon, Avatar, Upload, Button, Progress, List, Modal, Input, Tooltip} from 'antd';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import {
    delLiveByIds,
    getActivityInfo,
    getActivityStautsInfo, modifyActivityInfo,
} from "../../axios";
import VideoPlayer from "./VideoPlayer";
import moment from 'moment'
import 'moment/locale/zh-cn';
import copy from "copy-to-clipboard/index";
import LiveModifyDialog from "./LiveModifyDialog";
import LiveQualityEchartsViews from "./LiveQualityEchartsViews";

moment.locale('zh-cn');

const TabPane = Tabs.TabPane;

class LiveStatusManagement extends React.Component {
    state = {
        pageLoading: false,
        data: {},
    };

    componentDidMount() {
        this.setState({
            pageLoading: false,
        });
        this.fetch(this.props.id);
    };

    fetch = (params = {}) => {
        getActivityInfo(params).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({
                        pageLoading: true,
                        data: data ? data.data : {},
                    });
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('获取直播信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
        this.setState({
            streamEventInfoListLoading: true,
        });
        getActivityStautsInfo(params).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({
                        streamEventInfoList: data ? data.data : {},
                        streamEventInfoListLoading: false
                    });
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('获取直播状态信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    refresh = () => {
        this.fetch(this.props.id);
    }
    showVideoPlayDialog = () => {
        this.setState({
            dialogPlayVisible: true,
        });
    }
    handleVideoPlayDialogCancel = () => {
        this.setState({
            dialogPlayVisible: false,
        });
    }
    copy = (url) => {
        if (url == null || url == '') {
            return
        }
        copy(url);
        message.success('地址已复制到剪贴板');
    }

    delete = () => {
        delLiveByIds({id: [this.state.record.id]}).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    };
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showLiveModifyDialog();
    };
    showLiveModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleLiveModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    saveLiveModifyDialogRef = (form) => {
        this.formModify = form;
    };
    handleLiveModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["startTime"] = values["startTime"] ? values["startTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["endTime"] = values["endTime"] ? values["endTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createTime"] = values["createTime"] ? values["createTime"].format('YYYY/MM/DD HH:mm:ss') : null;

            modifyActivityInfo(values).then((data) => {
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
            this.setState({dialogModifyVisible: false});
        });
    };

    render() {
        const isMobile = this.props.responsive.data.isMobile;
        const ModifyDialog = Form.create()(LiveModifyDialog);
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            width: 468,
            preload: "auto",
            sources: [{
                // type: "video/mp4",
                src: this.state.data && this.state.data.pullStreamUrls ? this.state.data.pullStreamUrls.hls : "",
            }]
        }
        return this.props.visible && this.state.pageLoading ? (
            <div>
                <Tooltip title="刷新">
                    <Button type="primary" shape="circle" icon="reload" className="pull-right"
                            loading={this.state.streamEventInfoListLoading}
                            onClick={this.refresh}/>
                </Tooltip>
                <div className="dark-white pa-s">
                    <div className="w-full center">
                        <span style={{fontSize: 18}}>{this.state.data ? this.state.data.name : "未命名"}</span>
                    </div>
                    <div className="w-full center">
                        <span
                            style={{fontSize: 14}}>{this.state.data ? `${this.state.data.startTime} ~ ${this.state.data.endTime}` : ""}</span>
                    </div>
                    <div className="w-full center mt-s">
                        <Button onClick={this.showVideoPlayDialog}
                                disabled={this.state.data && this.state.data.status != 1}>观看直播</Button>
                    </div>
                    <div className="w-full center">
                        <span style={{fontSize: 14}}>
                            {this.state.data && this.state.data.status == 1 ? "直播中" : "未在直播"}
                        </span>
                    </div>
                    <div className="w-full center mt-s">
                        <Button type="primary" onClick={this.onNameClick.bind(this, this.state.data)}>详细信息</Button>
                    </div>
                    <List
                        rowKey={record => record.id}
                        grid={{gutter: 16, lg: 1, md: 1, xs: 1}}
                        dataSource={this.state.streamEventInfoList ? this.state.streamEventInfoList : []}
                        loading={this.state.streamEventInfoListLoading}
                        bordered
                        itemLayout="vertical"
                        className="mt-s"
                        header={
                            <div>
                                <div className="w-full center ma-s">
                                    <span style={{fontSize: 14}}>推流事件查看</span>
                                </div>
                                <Row>
                                    <Col span={4}>ip</Col>
                                    <Col span={3}>时常（秒）</Col>
                                    <Col span={3}>分辨率</Col>
                                    <Col span={6}>停止原因</Col>
                                    <Col span={4}>开始时间</Col>
                                    <Col span={4}>结束时间</Col>
                                </Row>
                            </div>}
                        renderItem={item => (<List.Item className="cell-hover">
                            <Row className="w-full">
                                <Col span={4}>{item.clientIp}</Col>
                                <Col span={3}>{item.duration}</Col>
                                <Col span={3}>{item.resolution}</Col>
                                <Col span={6}>{item.stopReason}</Col>
                                <Col span={4}>{moment(item.streamStartTime).format("YYYY/MM/DD HH:mm:ss")}</Col>
                                <Col span={4}>{moment(item.streamEndTime).format("YYYY/MM/DD HH:mm:ss")}</Col>
                            </Row>
                        </List.Item>)}
                    />
                    <LiveQualityEchartsViews id={this.props.id}/>
                </div>
                <Modal
                    width={600}
                    visible={this.state.dialogModifyVisible}
                    title="编辑直播"
                    okText="确定"
                    onCancel={this.handleLiveModifyCancel}
                    destroyOnClose="true"
                    onOk={this.handleLiveModifyCreate}
                    footer={[
                        <Button key="back" onClick={this.handleLiveModifyCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleLiveModifyCreate}>
                            确定
                        </Button>
                    ]}
                >
                    <ModifyDialog
                        visible={this.state.dialogModifyVisible}
                        ref={this.saveLiveModifyDialogRef}
                        record={this.state.record}/>
                </Modal>
                <Modal
                    title="视频播放"
                    visible={this.state.dialogPlayVisible}
                    destroyOnClose="true"
                    footer={[
                        <Button key="back" onClick={this.handleVideoPlayDialogCancel}>取消</Button>,
                    ]}
                    onCancel={this.handleVideoPlayDialogCancel}>
                    <VideoPlayer {...videoJsOptions}/>
                </Modal>
            </div>
        ) : <div/>;
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveStatusManagement);