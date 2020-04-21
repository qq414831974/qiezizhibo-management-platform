import React from 'react';
import {
    Form,
    Avatar,
    Button,
    Row,
    Col,
    List,
    Card,
    Modal,
    Progress,
    Upload,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    uploadmedia,
    getPlayerById,
    getMatchById,
    getPlayerMedia,
    addMediaToPlayer,
    modifyMedia,
    deleteMediaToPlayer,
} from "../../../axios/index";
import avatar from '../../../static/avatar.jpg';
import logo from '../../../static/logo.png';
import {Link, Redirect} from 'react-router-dom';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import FootBallPlayerModifyMediaDialog from "./FootBallPlayerModifyMediaDialog";
import {message} from "antd/lib/index";
import VideoPlayer from "../../Live/VideoPlayer";
import nopic from '../../../static/nopic.png';
import copy from 'copy-to-clipboard';
import {getQueryString} from '../../../utils';

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

class FootballPlayerDetailManagement extends React.Component {
    state = {}

    componentDidMount() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return;
        }
        if (this.props.location.search) {
            const matchId = getQueryString(this.props.location.search, "matchId");
            this.setState({matchId});
            getMatchById(matchId).then(data => {
                if (data) {
                    this.setState({match: data});
                }
            });
        }
        this.fetch();
    }

    fetch = () => {
        this.setState({playerLoading: true, mediaLoading: true});
        getPlayerById(this.props.match.params.id).then(data => {
            if (data && data.code == 200) {
                this.setState({player: data.data});
            }
            this.setState({playerLoading: false});
        });
        getPlayerMedia({playerId: this.props.match.params.id}).then(data => {
            if (data && data.code == 200 && data.data.length) {
                this.setState({mediaList: data.data});
            } else {
                this.setState({mediaList: null});
            }
            this.setState({mediaLoading: false});
        });
    }
    refresh = () => {
        this.fetch();
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
                    }else{
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
        deleteMediaToPlayer({
            playerId: this.props.match.params.id,
            mediaId: this.state.currentMedia.id,
        }).then(data => {
            this.setState({deleteVisible: false, modifyMediaVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('删除成功', 1);
                    this.refresh();
                }else{
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
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
            addMediaToPlayer(this.state.matchId ? {
                playerId: this.props.match.params.id,
                mediaId: media.id,
                matchId: this.state.matchId
            } : {
                playerId: this.props.match.params.id,
                mediaId: media.id,
            }).then(data => {
                if (data && data.code == 200 && data.data) {
                    message.success('上传视频成功', 1);
                    this.refresh();
                } else {
                    message.error('上传视频失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            });
        }
    }

    render() {
        const isMobile = this.props.responsive.data.isMobile;
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/football/footballPlayer"/>;
        }
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            width: 468,
            preload: "auto",
            poster: this.state.currentMedia ? this.state.currentMedia.poster : "",
            sources: [{
                type: "video/mp4",
                src: this.state.currentMedia ? this.state.currentMedia.path : "",
            }]
        }
        const ModifyMediaDialog = Form.create()(FootBallPlayerModifyMediaDialog);
        const title = this.state.match ? `${this.state.match.hostteam?this.state.match.hostteam.name:""} VS ${this.state.match.guestteam?this.state.match.guestteam.name:""} ${this.state.player ? this.state.player.name : ""}进球` : "";
        return (
            <div>
                <BreadcrumbCustom first={<Link to={'/football/footballPlayer'}>球员管理</Link>} second="详细设置"/>
                <div className="dark-white pa-s">
                    <div className="w-full center">
                        <Avatar size="large"
                                src={this.state.player ? (this.state.player.headImg ? this.state.player.headImg : avatar) : avatar}/>
                    </div>
                    <div className="w-full center">
                        <span style={{fontSize: 18}}>{this.state.player ? this.state.player.name : "无名"}</span>
                    </div>
                    <div className="w-full center">
                        <Upload accept="video/*"
                                disabled={this.state.player ? false : true}
                                action={uploadmedia + (this.state.player ? ("?name=" + this.state.player.name + "&title=" + title) : "")}
                                showUploadList={false}
                                onChange={this.onUploadStatusChange}>
                            <Button>上传视频</Button>
                        </Upload>
                    </div>
                    <div className="w-full center">
                        {this.state.percent && this.state.percent <= 100 ?
                            <Progress percent={this.state.percent}/> : null}
                    </div>
                    <Card className="mt-m" style={{minHeight: 559}}>
                        <List
                            rowKey={record => record.id}
                            grid={{gutter: 16, lg: 3, md: 2, xs: 1}}
                            dataSource={this.state.mediaList ? this.state.mediaList.map(media=>media.media) : []}
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
                                        <p className="video-list-item-bottom-text">上传时间：{moment(item.createTime).format("MM-DD HH:mm")}</p>
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
                        playerId={this.props.match.params.id}
                        player={this.state.player}
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
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.handleDeleteOK}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
                </Modal>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootballPlayerDetailManagement);