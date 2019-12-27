import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {createMedia, preUpload, getTransProgress, getMediaList, deleteMedia, bulkMedia, upload} from "../../axios";
import {Row, Col, Card, Button, Icon, Upload, Progress, List, Modal, Checkbox, message, Input, Tabs} from 'antd';
import axios from "axios";
import VideoPlayer from "../Live/VideoPlayer";
import moment from 'moment'
import nopic from '../../static/nopic.png'
import blank from '../../static/blank.png'
import copy from 'copy-to-clipboard';
import Draggable from 'react-draggable';

const TabPane = Tabs.TabPane;

class LiveMediaSetting extends React.Component {
    state = {
        progress: 0,
        loading: false,
        uploadList: [],
        taskList: {},
        dialogPlayVisible: false,
    };

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.fetch();
    };

    componentWillUnmount() {
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null
        }
    }

    updateUploadList = () => {
        this.setState({
            uploadList: this.state.uploadList,
        });
    }
    fetch = () => {
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null
        }
        getMediaList(this.props.id).then((data) => {
            if (data && data.message == null) {
                this.setState({
                    mediaList: data ? data : [],
                });
                this.initVideoList();
                this.timerID = setInterval(
                    () => {
                        this.updateTransProgress();
                    },
                    1000
                );
            } else {
                message.error('获取媒体信息失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });
    }
    fetchItem = () => {
        getMediaList(this.props.id).then((data) => {
            if (data && data.message == null) {
                this.setState({
                    mediaList: data ? data : [],
                });
                this.initVideoList();
            } else {
                message.error('获取媒体信息失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });
    }

    updateTransProgress = () => {
        let tasksId = ""
        const fetchItem = this.fetchItem;
        this.state.mediaList.forEach((item, index) => {
            if (item && item.taskId != null && item.taskId != "") {
                tasksId = tasksId == "" ? item.taskId : tasksId + "," + item.taskId
            }
        });
        if (tasksId == "" || tasksId == null) {
            if (this.timerID) {
                clearInterval(this.timerID);
                this.timerID = null
            }
            return;
        }
        let flag = false;
        getTransProgress(this.props.id, tasksId).then((data) => {
            if (data) {
                let list = {};
                data.forEach((item, index) => {
                    list[item.taskId] = item.progress;
                    if (item.progress != 100) {
                        flag = true;
                    } else {
                        if (this.state.taskList[item.taskId] != null && this.state.taskList[item.taskId] <= 99 && item.progress == 100) {
                            fetchItem();
                        }
                    }
                });
                this.setState({
                    taskList: list,
                });
            }
            if ((Object.keys(this.state.taskList).length == 0) || (!flag)) {
                if (this.timerID) {
                    clearInterval(this.timerID);
                    this.timerID = null
                }
            }
        });
    }
    getUploadList = () => {
        let dom = [];
        if (this.state.uploadList) {
            this.state.uploadList.forEach((item, index) => {
                if (!item.complete) {
                    let progress = <Progress percent={Math.ceil(item.uploadProgress * 100)}
                                             className="inline-block pr-l"/>
                    if (item.complete) {
                        progress = <p>上传完成</p>
                    }
                    dom.push(<div key={item.fileName + "-" + index}>
                        <div className="w-full"><p>{item.fileName}</p></div>
                        <div className="w-full inline">
                            <Icon type="play-circle" className="inline-block"/>
                            {progress}
                        </div>
                    </div>);
                }
            });
        }
        return dom;
    }
    handleVideoPlayDialogCancel = () => {
        this.setState({
            dialogPlayVisible: false,
        });
    }
    showVideoPlayDialog = (video) => {
        this.setState({
            dialogPlayVisible: true,
            currentVideo: video
        });
    }
    showDeleteConfirm = (item) => {
        this.setState({
            deleteVisible: true,
            deleteItem: item,
        });
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false,
            deleteItem: null,
        });
    }
    handleDeleteOK = () => {
        deleteMedia(this.state.deleteItem.id).then((data) => {
            if (data && data.result) {
                message.error('删除成功', 1);
                this.setState({
                    deleteVisible: false,
                });
                this.fetch();
            } else {
                message.error('删除失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });

    }
    showDownLoadDialog = (item) => {
        this.setState({
            downloadVisible: true,
            downloadItem: item,
        });
    }
    handleDownLoadCancel = () => {
        this.setState({
            downloadVisible: false,
            downloadItem: null,
        });
    }
    getVideoList = (type) => {
        let dom = [];
        let index = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                dom.push(<div className="video-card" key={"pic-" + i + "-" + j}>
                    <div className="video-card-item center">
                        <p className="video-card-content center"
                           style={{fontSize: 20}}>{index + 1}</p>
                        <img src={blank} className="video-card-content-img"
                             index={index}
                             type={type}
                             item={null}
                             flag="false"
                             onClick={(e) => {
                                 e.target.src = blank;
                                 e.target.flag = false;
                             }}/>
                    </div>
                </div>);
                index = index + 1;
            }
        }
        return dom;
    }
    onStart = (e) => {
        this.setState({dragFakeVisible: false});
    };
    onStop = (e) => {
        if (e.target.className == "video-card-content-img") {
            e.target.src = this.state.targetItem ? this.state.targetItem.src : "";
            // e.target.attributes.path = this.state.targetItem ? this.state.targetItem.attributes.path : null;
            e.target.path = this.state.targetItem ? this.state.targetItem.attributes.path.value : null;
            e.target.id = this.state.targetItem ? this.state.targetItem.attributes.id.value : null;
            e.target.flag = true;
        }
        this.setState({dragFakeVisible: false});
    };
    handleDrag = (e, ui) => {
        // const {x, y} = this.state.deltaPosition;
        // this.setState({
        //     deltaPosition: {
        //         x: x + ui.deltaX,
        //         y: y + ui.deltaY,
        //     },
        //     dragFake:1,
        // });
        this.setState({
            dragFakeVisible: true,
            dragFakeX: e.clientX - 80,
            dragFakeY: e.clientY - 45
        });
        ui.node.childNodes.forEach((item, index) => {
            if (item.className == "video-list-item-img") {
                this.setState({targetItem: item});
            }
        });
    };
    getUrl = (url) => {
        if(url == null){
            return null;
        }
        if(url.startsWith("//")){
            url = "https:" + url;
        }
        return url.replace(".jpg", "1.jpg");
    }
    getPathUrl = (url)=> {
        if(url == null){
            return null;
        }
        if(url.startsWith("//")){
            url = "https:" + url;
        }
        return url;
    }
    initVideoList = () => {
        if (this.state.mediaList) {
            let doms = document.getElementsByClassName("video-card-content-img");
            this.state.mediaList.forEach((item, index) => {
                if (item.isPrologue) {
                    doms[item.prologueIndex].path = item.path;
                    doms[item.prologueIndex].src = item.thumbnailPath ? this.getUrl(item.thumbnailPath) : nopic;
                    doms[item.prologueIndex].flag = true;
                    doms[item.prologueIndex].item = item;
                    doms[item.prologueIndex].id = item.id;
                }
                if (item.isEpilogue) {
                    doms[item.epilogueIndex + 8].path = item.path;
                    doms[item.epilogueIndex + 8].src = item.thumbnailPath ? this.getUrl(item.thumbnailPath) : nopic;
                    doms[item.epilogueIndex + 8].flag = true;
                    doms[item.epilogueIndex + 8].item = item;
                    doms[item.epilogueIndex + 8].id = item.id;
                }
            });
        }
    }
    onSaveClick = (e) => {
        let doms = document.getElementsByClassName("video-card-content-img");
        let collections = [];
        for (let i = 0; i < doms.length; i++) {
            let flag = doms[i].flag;
            if (doms[i].id != null && doms[i].id != "") {
                if (doms[i].attributes.type.value == 2) {
                    collections.push({
                        id: doms[i].id ? parseInt(doms[i].id) : "",
                        epilogueIndex: parseInt(doms[i].attributes.index.value),
                        isEpilogue: flag,
                        path: doms[i].path ? doms[i].path : ""
                    });
                } else if (doms[i].attributes.type.value == 1) {
                    collections.push({
                        id: doms[i].id ? parseInt(doms[i].id) : "",
                        prologueIndex: parseInt(doms[i].attributes.index.value),
                        isPrologue: flag,
                        path: doms[i].path ? doms[i].path : ""
                    });
                }
            }
        }
        bulkMedia(this.props.id, collections).then((data) => {
            if (data && data.result) {
                message.success('修改成功', 1);
                this.fetchItem();
            } else {
                message.error('修改失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        })
    }

    render() {
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        const fetch = this.fetch;
        const getUrl = this.getUrl;
        const getPathUrl = this.getPathUrl;
        const getVideoList = this.getVideoList;
        const updateUploadList = this.updateUploadList;
        const showVideoPlayDialog = this.showVideoPlayDialog;
        const showDeleteConfirm = this.showDeleteConfirm;
        const showDownLoadDialog = this.showDownLoadDialog;
        const currentVideo = this.state.currentVideo;
        const path = currentVideo ? currentVideo.playlistPath : "";
        const realPath = currentVideo ? path.toString().replace("//", "https://") : "";
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            width: 468,
            preload: "auto",
            sources: [{
                type: "application/x-mpegURL",
                src: realPath,
            }]
        }
        return <div className="no-select">
            <img draggable={false} style={{
                pointerEvents: "none",
                width: 160,
                height: 90,
                zIndex: 100,
                display: this.state.dragFakeVisible ? "flex" : "none",
                position: "fixed",
                left: this.state.dragFakeX ? this.state.dragFakeX : 0,
                top: this.state.dragFakeY ? this.state.dragFakeY : 0
            }}
                 src={this.state.targetItem ? this.state.targetItem.src : ""}/>
            <Row gutter={16}>
                <Col md={15} style={{zIndex: 10}}>
                    <Card style={{minHeight: 559}} title={<div style={{height: 50}}>
                        <Upload accept="video/*"
                                action={upload}
                                showUploadList={false}
                                beforeUpload={(file, fileList) => {
                                    let upload = {}
                                    this.state.uploadList.push(upload);
                                    upload.loading = true
                                    updateUploadList();
                                    preUpload(file.name, file.size).then((data) => {
                                        if (data == null || (data && data.message != null)) {
                                            message.error('获取上传地址失败：' + (data ? data.name + "-" + data.message : data), 3);
                                            return;
                                        }
                                        upload.absolutePath = data.absolutePath
                                        const absolutePath = data.absolutePath
                                        let formData = new FormData();
                                        formData.append('policy', data.policy);
                                        formData.append('signature', data.signature);
                                        formData.append('file', file);
                                        axios({
                                            method: 'post',
                                            url: data.action,
                                            anync: true,
                                            contentType: false,
                                            processData: false,
                                            withCredentials: false,
                                            onUploadProgress: (progressEvent) => {
                                                if (progressEvent.lengthComputable) {
                                                    // this.setState({
                                                    //     progress: progressEvent.loaded / progressEvent.total,
                                                    // });
                                                    upload.uploadProgress = progressEvent.loaded / progressEvent.total;
                                                    updateUploadList();
                                                }
                                            },
                                            data: formData
                                        }).then((data) => {
                                            if (data == null || (data && data.status != 200 && data.statusText != "OK")) {
                                                message.error('上传失败：' + (data ? data.name + "-" + data.message : data), 3);
                                                return;
                                            }
                                            let param = {};
                                            param.path = absolutePath;
                                            upload.fileName = file.name;
                                            updateUploadList();
                                            createMedia(this.props.id, param).then((data) => {
                                                if (data && data.result) {
                                                    upload.complete = true;
                                                    upload.loading = false;
                                                    updateUploadList();
                                                    message.success('上传' + file.name + '成功', 1);
                                                    fetch();
                                                } else {
                                                    message.error('上传失败：' + (data ? data.name + "-" + data.message : data), 3);
                                                }
                                            });
                                        });
                                    });
                                    return false;
                                }}
                        >
                            <Button>Upload</Button>
                        </Upload>
                        {this.getUploadList()}
                    </div>
                    }>
                        <List
                            rowKey={record => record.id}
                            grid={{gutter: 16, lg: 3, md: 2, xs: 1}}
                            dataSource={this.state.mediaList}
                            renderItem={item => (
                                <List.Item>
                                    <Draggable axis="none" handle=".handle" onDrag={this.handleDrag} {...dragHandlers}>
                                        <div className="video-list-item pa-xs">
                                            {/*<Icon type="plus-square" className="video-list-item-draggable"/>*/}
                                            <Checkbox className="video-list-item-checkbox"/>
                                            {item.playlistPath ? null : <div className="video-list-item-top center">
                                                <p className="video-list-item-bottom-text">转码中</p>
                                            </div>}
                                            <img className="video-list-item-img" draggable={false}
                                                 src={item.thumbnailPath ? getUrl(item.thumbnailPath) : nopic}
                                                 id={item.id}
                                                 path={getPathUrl(item.path)}/>
                                            <div className="video-list-item-buttons center handle h-full">
                                                <Button shape="circle" icon="download"
                                                        className="video-list-item-button"
                                                        onClick={showDownLoadDialog.bind(this, item)}/>
                                                {item.playlistPath ? <Button shape="circle"
                                                                             icon="play-circle"
                                                                             className="video-list-item-button"
                                                                             onClick={showVideoPlayDialog.bind(this, item)}/>
                                                    :
                                                    <Progress type="circle"
                                                              className="video-list-item-progress"
                                                              percent={this.state.taskList[item.taskId]}
                                                              width={32}
                                                              format={percent => `${percent}%`}/>}
                                                <Button shape="circle" icon="delete" className="video-list-item-button"
                                                        onClick={showDeleteConfirm.bind(this, item)}/>
                                            </div>
                                            <div className="video-list-item-bottom center">
                                                <p className="video-list-item-bottom-text">上传时间：{moment(item.createdAt).format("MM-DD HH:mm")}</p>
                                            </div>
                                        </div>
                                    </Draggable>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col md={9} style={{zIndex: 9}}>
                    <Card className="card-pt-m" title={<div style={{height: 50}}>
                        <p className="pull-left">播放列表</p>
                        <Button type="primary" className="pull-right mt-xs" onClick={this.onSaveClick}>保存配置</Button>
                    </div>}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="预设视频" key="1" forceRender={true}>
                                <div className="inline">
                                    {getVideoList(1)}
                                </div>
                            </TabPane>
                            <TabPane tab="录制回看" key="2" forceRender={true}>
                                <div className="inline">
                                    {getVideoList(2)}
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
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
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.handleDeleteOK}
                onCancel={this.handleDeleteCancel}
            >
                <p className="mb-n">是否确认删除视频文件？</p>
            </Modal>
            <Modal
                title="视频下载"
                visible={this.state.downloadVisible}
                footer={null}
                onCancel={this.handleDownLoadCancel}
            >
                <p>视频下载地址</p>
                <div>
                    <Input style={{width: "80%"}} disabled
                           value={this.state.downloadItem ? "https:" + this.state.downloadItem.playlistPath : ""}/>
                    <Button style={{width: "18%", marginLeft: "2%"}} type="primary"
                            onClick={() => {
                                copy(this.state.downloadItem ? this.state.downloadItem.playlistPath : "");
                                message.success('地址已复制到剪贴板');
                            }}>复制地址</Button>
                </div>
                <p className="mt-l">视频下载工具</p>
                <Button type="primary"
                        href="http://shangzhibo-img.b0.upaiyun.com/system/software/m3u8-downloader-win-0.1.3.exe"
                        target="_blank">Windows版</Button>
                <Button type="primary"
                        href="http://shangzhibo-img.b0.upaiyun.com/system/software/m3u8-downloader-mac-0.1.3.dmg"
                        target="_blank">Mac版</Button>
            </Modal>
        </div>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({receiveData: bindActionCreators(receiveData, dispatch)});

export default connect(mapStateToProps, mapDispatchToProps)(LiveMediaSetting);