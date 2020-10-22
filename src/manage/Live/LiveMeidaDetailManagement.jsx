import React from 'react';
import {Row, Col, Card, Icon, Avatar, Upload, Button, Progress, List, Modal, Tooltip, Input} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {receiveData} from "../../action";
import {uuid} from "../../utils";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import {
    createActivityMedia,
    getActivityMediaList,
    getActivityInfo,
    deleteActivityMedia,
    updateActivityMedia,
    uploadmedia, modifyMedia,
    createMedia
} from "../../axios";
import avatar from "../../static/avatar.jpg";
import nopic from "../../static/nopic.png";
import moment from "moment";
import VideoPlayer from "./VideoPlayer";
import copy from "copy-to-clipboard";
import LiveModifyMediaDialog from "../Live/LiveModifyMediaDialog";

const TabPane = Tabs.TabPane;


class LiveMeidaDetailManagement extends React.Component {
    state = {
        pageLoading: false,
        currentTab: "1",
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
            mediaLoading: true,
        });
        getActivityMediaList({activityId: this.props.id}).then(data => {
            if (data && data.code == 200 && data.data.length) {
                this.setState({mediaList: data.data});
            } else {
                this.setState({mediaList: null});
            }
            this.setState({mediaLoading: false});
        });

    }
    refresh = () => {
        this.fetch(this.props.id);
        this.setState({percent: null});
    }
    handleModifyMediaCancel = () => {
        this.setState({modifyMediaVisible: false});
    }
    saveModifyMeidaDialogRef = (form) => {
        this.modifyMeidaForm = form;
    }
    handleMediaDelete = (record) => {
        this.setState({deleteVisible: true, currentMedia: record});
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    handleModifyMediaOK = () => {
        const form = this.modifyMeidaForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            modifyMedia(values).then((data) => {
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
            this.setState({modifyMediaVisible: false});
        });
    }
    onMeidaClick = (record) => {
        this.setState({currentMedia: record, modifyMediaVisible: true});
    }
    handleDownload = (record) => {
        copy(record.path);
        message.success('下载地址已复制到剪贴板', 1);
    }
    showVideoPlayDialog = (record) => {
        this.setState({
            dialogPlayVisible: true,
            currentMedia: record
        });
    }
    handleVideoPlayDialogCancel = () => {
        this.setState({
            dialogPlayVisible: false,
        });
    }
    handleDeleteOK = () => {
        this.state.currentMedia &&
        deleteActivityMedia({
            activityId: this.props.id,
            mediaId: this.state.currentMedia.id,
        }).then(data => {
            this.setState({deleteVisible: false, modifyMediaVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('删除成功', 1);
                    this.refresh();
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + "-" + data.message : data), 3);
            }
        });
    }
    onUploadStatusChange = (e) => {
        if (e.event && e.event.percent) {
            this.setState({percent: e.event.percent});
        }
        if (e.file.status == "done") {
            this.setState({percent: 100});
            const media = e.file.response.data;
            createActivityMedia({
                activityId: this.props.id,
                mediaId: media.id,
            }).then(data => {
                if (data && data.code == 200 && data.data) {
                    message.success('上传视频成功', 1);
                    this.refresh();
                } else {
                    message.error('上传视频失败：' + (data ? data.code + "-" + data.message : data), 3);
                }
            });
        }
    }

    onImportVideoClick = () => {
        this.setState({importVisible: true})
    }
    handleImportCancel = () => {
        this.setState({importVisible: false})
    }
    handleImportOK = () => {
        const id = uuid();
        createMedia({
            id: id,
            title: this.state.data.name,
            path: this.state.importVideoUrl,
            view: 0,
            viewbase: 0,
            viewExpendMin: 0,
            viewExpendMax: 0,
            viewreal: 0,
            nooice: 0,
            createtime: moment().format('YYYY/MM/DD HH:mm:ss')
        }).then(data => {
            if (data && data.code == 200 && data.data) {
                createActivityMedia({
                    activityId: this.props.id,
                    mediaId: id,
                }).then(data => {
                    if (data && data.code == 200 && data.data) {
                        this.setState({importVisible: false, importVideoUrl: null})
                        message.success('导入视频成功', 1);
                        this.refresh();
                    } else {
                        message.error('导入视频失败：' + (data ? data.code + "-" + data.message : data), 3);
                    }
                });
            } else {
                message.error('添加视频失败：' + (data ? data.code + "-" + data.message : data), 3);
            }
        })
    }
    onImportVideoInputChange = (e) => {
        this.setState({importVideoUrl: e.target.value})
    }

    render() {
        const isMobile = this.props.responsive.data.isMobile;
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            width: 468,
            preload: "auto",
            poster: this.state.currentMedia ? this.state.currentMedia.poster : "",
            sources: [{
                // type: "video/mp4",
                src: this.state.currentMedia ? this.state.currentMedia.path : "",
            }]
        }
        const ModifyMediaDialog = Form.create()(LiveModifyMediaDialog);
        return this.props.visible && this.state.pageLoading ? (
                <div>
                    <Tooltip title="刷新">
                        <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                loading={this.state.mediaLoading}
                                onClick={this.refresh}/>
                    </Tooltip>
                    <div className="dark-white pa-s">
                        <div className="w-full center">
                            <span style={{fontSize: 18}}>{this.state.data ? this.state.data.name : "未命名"}</span>
                        </div>
                        <div className="w-full center">
                            <Upload accept="video/*"
                                    disabled={this.state.data ? false : true}
                                    action={uploadmedia + (this.state.data ? ("?title=" + this.state.data.name) : "")}
                                    showUploadList={false}
                                    onChange={this.onUploadStatusChange}>
                                <Button>上传视频</Button>
                            </Upload>
                        </div>
                        <div className="w-full center">
                            <Button onClick={this.onImportVideoClick}>导入视频</Button>
                        </div>
                        <div className="w-full center">
                            {this.state.percent && this.state.percent <= 100 ?
                                <Progress percent={this.state.percent}/> : null}
                        </div>
                        <Card className="mt-m" style={{minHeight: 559}}>
                            <List
                                rowKey={record => record.id}
                                grid={{gutter: 16, lg: 3, md: 2, xs: 1}}
                                dataSource={this.state.mediaList ? this.state.mediaList.map(media => media.media) : []}
                                loading={this.state.mediaLoading}
                                renderItem={item => (<List.Item>
                                    <div className="video-list-item pa-xs" style={{transform: "translate(0px, 0px)"}}>
                                        <img className="video-list-item-img"
                                             src={item.poster ? item.poster : nopic}/>
                                        <div className="video-list-item-buttons center h-full">
                                            <Button shape="circle" icon="download"
                                                    className="video-list-item-button"
                                                    onClick={this.handleDownload.bind(this, item)}/>
                                            <Button shape="circle"
                                                    icon="play-circle"
                                                    className="video-list-item-button"
                                                    onClick={this.showVideoPlayDialog.bind(this, item)}/>
                                            <Button shape="circle" icon="bars"
                                                    className="video-list-item-button"
                                                    onClick={this.onMeidaClick.bind(this, item)}/>
                                            {/*<Button shape="circle" icon="delete" className="video-list-item-button"*/}
                                            {/*onClick={this.handleMediaDelete.bind(this, item)}/>*/}
                                        </div>
                                        <div className="video-list-item-bottom center">
                                            <p className="video-list-item-bottom-text">上传时间：{item.createTime ? moment(item.createTime).format("MM-DD HH:mm") : "未知"}</p>
                                        </div>
                                    </div>
                                </List.Item>)}
                            />
                        </Card>
                    </div>
                    <Modal
                        className={isMobile ? "top-n" : ""}
                        title="编辑视频"
                        okText="确定"
                        visible={this.state.modifyMediaVisible}
                        onOk={this.handleModifyMediaOK}
                        onCancel={this.handleModifyMediaCancel}
                        zIndex={1001}
                        destroyOnClose="true"
                        footer={[
                            <Button key="delete" type="danger" className="pull-left"
                                    onClick={this.handleMediaDelete.bind(this, this.state.currentMedia)}>删除</Button>,
                            <Button key="back" onClick={this.handleModifyMediaCancel}>取消</Button>,
                            <Button key="submit" type="primary" onClick={this.handleModifyMediaOK}>
                                确定
                            </Button>
                        ]}
                    >
                        <ModifyMediaDialog
                            visible={this.state.modifyMediaVisible}
                            record={this.state.currentMedia}
                            activityId={this.props.id}
                            activity={this.state.data}
                            ref={this.saveModifyMeidaDialogRef}/>
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
                    <Modal
                        className={isMobile ? "top-n" : ""}
                        title="输入地址"
                        visible={this.state.importVisible}
                        onOk={this.handleImportOK}
                        onCancel={this.handleImportCancel}
                        zIndex={1001}
                    >
                        <Input value={this.state.importVideoUrl}
                               placeholder="输入视频地址"
                               onChange={this.onImportVideoInputChange}/>
                    </Modal>
                    <Modal
                        className={isMobile ? "top-n" : ""}
                        title="确认删除"
                        visible={this.state.deleteVisible}
                        onOk={this.handleDeleteOK}
                        onCancel={this.handleDeleteCancel}
                        zIndex={1001}
                    >
                        <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
                    </Modal>
                </div>
            ) :
            <div/>
            ;
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveMeidaDetailManagement);