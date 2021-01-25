import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {Row, Col, Card, Tooltip, Tag, List, Button, Modal, Avatar, Select, Spin, Checkbox, Switch} from 'antd';
import {
    getMatchPlayersByTeamId,
    getClipsByMatchId,
    updateClipsByMatchId,
    deleteClips,
    mergeClips,
    getClipCollectionsByMatchId,
    updateClipCollectionsByMatchId,
    deleteClipCollections
} from "../../../../axios";
import {Form, message} from "antd/lib/index";
import {Link} from 'react-router-dom';
import moment from "moment/moment";
import VideoPlayer from "../../../Live/VideoPlayer";
import pic from '../.././../../static/blank.png';
import defultAvatar from '../.././../../static/avatar.jpg';
import MatchClipModifyDialog from "./MatchClipModifyDialog";
import MatchClipCollectionModifyDialog from "./MatchClipCollectionModifyDialog";
import copy from "copy-to-clipboard/index";

const CLIP = 1;
const CLIP_COLLECTION = 2;

const Option = Select.Option;

class MatchClipPanel extends React.Component {
    state = {
        hostdata: [],
        guestdata: [],
        pageLoaded: false,
        autoPreffixChecked: false,
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
            mediaLoading: true,
            clipCollectionLoading: true,
        });
        getClipsByMatchId({matchId: this.props.matchId}).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data,
                    mediaLoading: false,
                });
            } else {
                message.error('获取比赛clip失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getClipCollectionsByMatchId({matchId: this.props.matchId}).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    clipCollectionData: data.data,
                    clipCollectionLoading: false,
                });
            } else {
                message.error('获取比赛clipCollection失败：' + (data ? data.result + "-" + data.message : data), 3);
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
    }
    fetchHostTeam = (params = {}) => {
        this.setState({
            hostloading: true,
        });
        getMatchPlayersByTeamId(null, this.props.match.hostteam.id).then((data) => {
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
        getMatchPlayersByTeamId(null, this.props.match.guestteam.id).then((data) => {
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
    getPlayerInfo = (playerId) => {
        for (let player of this.state.hostdata.concat(this.state.guestdata)) {
            if (player.id == playerId) {
                return player;
            }
        }
    }
    getTeamPlayerDom = (data) => {
        let dom = [];
        data && data.forEach(item => {
            dom.push(<div key={item.id}
                          className="inline-block cell-hover border-radius-10px border-gray pa-xs ml-s cursor-hand">
                <Avatar src={item.headImg ? item.headImg : defultAvatar}/>
                <span>{`${item.name}(${item.shirtNum})`}</span>
            </div>);
        });
        return <div className="inline">{dom}</div>;
    }
    refresh = () => {
        this.fetch();
    }

    handleModifyMediaCancel = () => {
        this.setState({modifyMediaVisible: false});
    }
    handleModifyClipCollectionCancel = () => {
        this.setState({modifyClipCollectionVisible: false});
    }
    saveModifyMeidaDialogRef = (form) => {
        this.modifyMeidaForm = form;
    }
    saveModifyClipCollectionDialogRef = (form) => {
        this.modifyClipCollectionForm = form;
    }
    handleMediaDelete = ({media, type}) => {
        if (type == CLIP) {
            this.setState({deleteVisible: true, currentMedia: media, deleteType: type});
        } else if (type == CLIP_COLLECTION) {
            this.setState({deleteVisible: true, currentClipCollection: media, deleteType: type});
        }
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
            values["timeStart"] = values["timeStart"] ? values["timeStart"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["timeEnd"] = values["timeEnd"] ? values["timeEnd"].format('YYYY/MM/DD HH:mm:ss') : null;
            updateClipsByMatchId(values).then((data) => {
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
    handleModifyClipCollectionOK = () => {
        const form = this.modifyClipCollectionForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // values["timeStart"] = values["timeStart"] ? values["timeStart"].format('YYYY/MM/DD HH:mm:ss') : null;
            // values["timeEnd"] = values["timeEnd"] ? values["timeEnd"].format('YYYY/MM/DD HH:mm:ss') : null;
            // updateClipsByMatchId(values).then((data) => {
            //     if (data && data.code == 200) {
            //         if (data.data) {
            //             this.refresh();
            //             message.success('修改成功', 1);
            //         } else {
            //             message.warn(data.message, 1);
            //         }
            //     } else {
            //         message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
            //     }
            // });
            form.resetFields();
            this.setState({modifyClipCollectionVisible: false});
        });
    }
    onMeidaClick = (record) => {
        this.setState({currentMedia: record, modifyMediaVisible: true});
    }
    onClipCollectionClick = (record) => {
        this.setState({currentClipCollection: record, modifyClipCollectionVisible: true});
    }
    handleDownload = (record) => {
        copy(record.url);
        message.success('下载地址已复制到剪贴板', 1);
    }
    showVideoPlayDialog = (record) => {
        this.setState({
            dialogPlayVisible: true,
            currentPlayerMedia: record
        });
    }
    handleVideoPlayDialogCancel = () => {
        this.setState({
            dialogPlayVisible: false,
        });
    }
    handleDeleteOK = () => {
        if (this.state.deleteType == CLIP) {
            this.state.currentMedia &&
            deleteClips({
                id: this.state.currentMedia.id,
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
                    message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            });
        } else if (this.state.deleteType == CLIP_COLLECTION) {
            this.state.currentClipCollection &&
            deleteClipCollections({
                id: this.state.currentClipCollection.id,
            }).then(data => {
                this.setState({deleteVisible: false, modifyClipCollectionVisible: false});
                if (data && data.code == 200) {
                    if (data.data) {
                        message.success('删除成功', 1);
                        this.refresh();
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            });
        }
    }
    getClipCollectionStatus = (status) => {
        let statusStirng = "生成中";
        switch (status) {
            case "editProcessing":
                statusStirng = "生成中";
                break;
            case "preffixProcessing":
                statusStirng = "片头合成中";
                break;
            case "done":
                statusStirng = "生成成功";
                break;
        }
        return statusStirng;
    }
    onCheckBoxChange = (checkedValues) => {
        this.setState({selectIds: checkedValues})
    }
    mergeClipsConfirm = () => {
        this.setState({mergeOptionVisible: true})
    }
    mergeClipsCancel = () => {
        this.setState({mergeOptionVisible: false, autoPreffixChecked: false, autoPreffixPlayerId: null,})
    }
    mergeClips = () => {
        if (this.props.matchId == null) {
            return;
        }
        if (this.state.selectIds == null || this.state.selectIds.length <= 0) {
            return;
        }
        mergeClips({
            matchId: this.props.matchId,
            teamId: this.state.autoPreffixTeamId,
            playerId: this.state.autoPreffixPlayerId,
            autoPreffix: this.state.autoPreffixChecked,
            clipIds: this.state.selectIds,
        }).then(data => {
            this.setState({mergeOptionVisible: false, selectIds: null});
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('操作成功', 1);
                    this.refresh();
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('操作失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }
    onAutoPreffixChange = (checked) => {
        this.setState({autoPreffixChecked: checked})
    }
    getPlayerOption = () => {
        let dom = [];
        for (let player of this.state.hostdata.concat(this.state.guestdata)) {
            dom.push(<Option key={player.id} value={player.id}>{player.name}</Option>)
        }
        return dom;
    }
    getTeamOption = () => {
        let dom = [];
        const hostteam = this.props.match.hostteam;
        const guestteam = this.props.match.guestteam;
        if (hostteam) {
            dom.push(<Option key={hostteam.id} value={hostteam.id}>{hostteam.name}</Option>)
        }
        if (guestteam) {
            dom.push(<Option key={guestteam.id} value={guestteam.id}>{guestteam.name}</Option>)
        }
        return dom;
    }
    onAutoPreffixPlayerSelect = (value) => {
        this.setState({autoPreffixPlayerId: value})
    }
    onAutoPreffixTeamSelect = (value) => {
        this.setState({autoPreffixTeamId: value})
    }
    toActivityMedia = () => {
        if (this.props.match && this.props.match.activityId) {
            window.open(`https://manage.qiezizhibo.com/manage/live/${this.props.match.activityId}?tab=2`);
        }
    }

    render() {
        const isMobile = this.props.responsive.data.isMobile;

        const videoJsOptions = {
            autoplay: false,
            controls: true,
            width: 468,
            preload: "auto",
            sources: [{
                src: this.state.currentPlayerMedia ? this.state.currentPlayerMedia.url : "",
            }]
        }
        const ModifyMediaDialog = Form.create()(MatchClipModifyDialog);
        const CollectionModifyDialog = Form.create()(MatchClipCollectionModifyDialog);
        return <div className="clear">
            <div className="w-full" style={{minHeight: 32}}>
                <Button className="pull-right" onClick={this.refresh} type="primary" shape="circle" icon="reload"/>
            </div>
            <Row gutter={8}>
                <Col span={12}>
                    <div>
                        <div className="center">
                            <img className="round-img-xs"
                                 src={this.props.match ? this.props.match.hostteam.headImg : defultAvatar}/>
                        </div>
                        <div className="center w-full">
                            <p style={{fontSize: 12}}
                               className="mt-s mb-n">{this.props.match ? this.props.match.hostteam.name : ""}</p>
                        </div>
                        {this.getTeamPlayerDom(this.state.hostdata)}
                    </div>
                </Col>
                <Col span={12}>
                    <div className="center">
                        <img className="round-img-xs"
                             src={this.props.match ? this.props.match.guestteam.headImg : defultAvatar}/>
                    </div>
                    <div className="center w-full">
                        <p style={{fontSize: 12}}
                           className="mt-s mb-n">{this.props.match ? this.props.match.guestteam.name : ""}</p>
                    </div>
                    {this.getTeamPlayerDom(this.state.guestdata)}
                </Col>
            </Row>
            <Card title={<div>自动剪辑视频{this.state.selectIds != null && this.state.selectIds.length > 0 ?
                <Button type="primary" className="ml-l" onClick={this.mergeClipsConfirm}>合并</Button> : null}</div>}
                  className="mt-m" style={{minHeight: 250}}>
                <Checkbox.Group style={{width: '100%'}} onChange={this.onCheckBoxChange}>
                    <List
                        rowKey={record => record.id}
                        grid={{gutter: 16, lg: 3, md: 2, xs: 1}}
                        dataSource={this.state.data ? this.state.data.map(media => {
                            media.player = this.getPlayerInfo(media.playerId);
                            return media;
                        }) : []}
                        loading={this.state.mediaLoading}
                        renderItem={item => (<List.Item key={item.id}>
                            <div className="video-list-item pa-xs" style={{transform: "translate(0px, 0px)"}}>
                                <Checkbox className="video-list-item-checkbox" value={item.id}/>
                                <div className="video-list-item-top-left">
                                    <Avatar
                                        src={item.player ? (item.player.headImg ? item.player.headImg : defultAvatar) : defultAvatar}/>
                                    <span>{`${item.player ? item.player.name : ""}`}</span>
                                </div>
                                <img className="video-list-item-img"
                                     src={pic}/>
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
                                    <p className="video-list-item-bottom-text">{item.planing ? "生成中" : "已生成"}</p>
                                </div>
                            </div>
                        </List.Item>)}
                    />
                </Checkbox.Group>
            </Card>
            <Card title="合并后视频" className="mt-m" style={{minHeight: 250}}>
                <List
                    rowKey={record => record.id}
                    grid={{gutter: 16, lg: 3, md: 2, xs: 1}}
                    dataSource={this.state.clipCollectionData ? this.state.clipCollectionData.map(media => {
                        media.player = this.getPlayerInfo(media.playerId);
                        return media;
                    }) : []}
                    loading={this.state.clipCollectionLoading}
                    renderItem={item => (<List.Item>
                        <div className="video-list-item pa-xs" style={{transform: "translate(0px, 0px)"}}>
                            <div className="video-list-item-top-left">
                                <Avatar
                                    src={item.player ? (item.player.headImg ? item.player.headImg : defultAvatar) : defultAvatar}/>
                                <span>{`${item.player ? item.player.name : ""}`}</span>
                            </div>
                            <img className="video-list-item-img"
                                 src={pic}/>
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
                                        onClick={this.onClipCollectionClick.bind(this, item)}/>
                                {/*<Button shape="circle" icon="delete" className="video-list-item-button"*/}
                                {/*onClick={this.handleMediaDelete.bind(this, item)}/>*/}
                            </div>
                            <div className="video-list-item-bottom center">
                                <p className="video-list-item-bottom-text">{this.getClipCollectionStatus(item.status)}</p>
                            </div>
                        </div>
                    </List.Item>)}
                />
            </Card>
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
                            onClick={this.handleMediaDelete.bind(this, {
                                media: this.state.currentMedia,
                                type: CLIP
                            })}>删除</Button>,
                    <Button key="back" onClick={this.handleModifyMediaCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleModifyMediaOK}>
                        确定
                    </Button>
                ]}
            >
                <ModifyMediaDialog
                    visible={this.state.modifyMediaVisible}
                    record={this.state.currentMedia}
                    playerId={this.state.currentMedia ? this.state.currentMedia.playerId : {}}
                    player={this.state.currentMedia ? this.state.currentMedia.player : {}}
                    ref={this.saveModifyMeidaDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="编辑视频"
                okText="确定"
                visible={this.state.modifyClipCollectionVisible}
                onOk={this.handleModifyClipCollectionOK}
                onCancel={this.handleModifyClipCollectionCancel}
                zIndex={1001}
                destroyOnClose="true"
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleMediaDelete.bind(this, {
                                media: this.state.currentClipCollection,
                                type: CLIP_COLLECTION
                            })}>删除</Button>,
                    <Button key="back" onClick={this.handleModifyClipCollectionCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleModifyClipCollectionOK}>
                        确定
                    </Button>
                ]}
            >
                <CollectionModifyDialog
                    visible={this.state.modifyClipCollectionVisible}
                    record={this.state.currentClipCollection}
                    playerId={this.state.currentClipCollection ? this.state.currentClipCollection.playerId : {}}
                    player={this.state.currentClipCollection ? this.state.currentClipCollection.player : {}}
                    ref={this.saveModifyClipCollectionDialogRef}/>
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
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.handleDeleteOK}
                onCancel={this.handleDeleteCancel}
                zIndex={1001}
            >
                <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="合并视频设置"
                visible={this.state.mergeOptionVisible}
                onOk={this.mergeClips}
                onCancel={this.mergeClipsCancel}
                destroyOnClose
                zIndex={1001}
            >
                <Row>
                    <Col span={6}><span>是否添加片头：</span></Col>
                    <Col span={16}>
                        <Switch onChange={this.onAutoPreffixChange} checked={this.state.autoPreffixChecked}/>
                    </Col>
                </Row>
                <Row className="mt-l">
                    <Col span={6}><span>选择队伍：</span></Col>
                    <Col span={16}>
                        <Select className="w-full" onChange={this.onAutoPreffixTeamSelect}
                                value={this.state.autoPreffixTeamId}>
                            {this.getTeamOption()}
                        </Select>
                    </Col>
                </Row>
                <Row className="mt-l">
                    <Col span={6}><span>选择球员：</span></Col>
                    <Col span={16}>
                        <Select className="w-full" onChange={this.onAutoPreffixPlayerSelect}
                                value={this.state.autoPreffixPlayerId}>
                            {this.getPlayerOption()}
                        </Select>
                    </Col>
                </Row>
                <span onClick={this.toActivityMedia}
                      className="w-full center danger mt-l cursor-hand">请在比赛结束，录播视频生成之后再做合并，否则无效，点击查看</span>
            </Modal>
        </div>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchClipPanel);