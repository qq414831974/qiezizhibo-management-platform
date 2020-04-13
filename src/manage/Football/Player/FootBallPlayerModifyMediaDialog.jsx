import React from 'react';
import {
    Form,
    Input,
    Icon,
    Select,
    DatePicker,
    Col,
    message,
    Upload,
    Avatar,
    Tooltip,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllMatchs, upload, getMatchById, updateMediaInPlayer, getMediaInPlayer} from "../../../axios";
import imgcover from '../../../static/imgcover.jpg';

import defultAvatar from '../../../static/avatar.jpg';

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

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

class FootBallPlayerModifyMediaDialog extends React.Component {
    state = {
        position: undefined,
        data: [],
        match: {}
    }

    componentDidMount() {
        getMediaInPlayer({
            mediaId: this.props.record.id,
            playerId: this.props.playerId
        }).then((data) => {
            if (data && data.code == 200) {
                if (data.data.matchId) {
                    this.fetchMatch(data.data.matchId);
                } else {
                    this.setState({
                        matchLoaded: true,
                    });
                }
            } else {
                message.error('获取关联信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    fetchMatch = (params) => {
        this.setState({
            matchLoaded: false,
        });
        getMatchById(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    matchLoaded: true,
                    match: data.data,
                });
            } else {
                message.error('获取比赛失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    fetch = (searchText, pageNum) => {
        this.setState({
            loading: true,
        });
        getAllMatchs({pageSize: 20, pageNum: pageNum, name: searchText}).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    data: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.data.concat(data.data.records) : []),
                    loading: false,
                    pageNum: data.data.current,
                    pageSize: data.data.size,
                    pageTotal: data.data.total,
                });
            } else {
                message.error('获取比赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    updateMediaInPlayer = (matchId) => {
        updateMediaInPlayer({
            matchId: matchId,
            mediaId: this.props.record.id,
            playerId: this.props.playerId
        }).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.fetchMatch(matchId);
                    message.success('修改关联比赛成功', 1);
                }else{
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改关联比赛失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                loading: false,
            }));
        }
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    onPosterChange = (form, e) => {
        form.setFieldsValue({
            poster: e.target.value
        })
    }
    handleChange = (value) => {
        this.setState({currentMatch: value});
        this.updateMediaInPlayer(value);
        const {form} = this.props;
        this.state.data && this.state.data.forEach(item => {
            if (item.id == value) {
                form.setFieldsValue({title: `${item.hostteam.name} VS ${item.guestteam.name} ${this.props.player.name}进球`})
            }
        });
    }
    handleShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.data.length) {
            this.handleOnLoadMore(e);
        }
    }
    handleOnLoadMore = (e) => {
        let data = this.state.data;
        e.target.scrollTop = data.length * 50;
        if (this.state.loading) {
            return;
        }
        if (data.length > this.state.pageTotal) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetch(this.state.searchText, this.state.pageNum + 1);
    }
    handleSearch = (e) => {
        const value = e.target.value;
        this.setState({searchText: value});
        // setTimeout(()=>{
        if (this.isCompositions) {
            this.fetch(value, 1);
        }
        // },100);
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onInputCompositionStart = () => {
        this.isCompositions = false;
    }
    onInputCompositionEnd = () => {
        this.isCompositions = true;
        this.fetch(this.state.searchText, 1);
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange;
        const currentMatch = this.state.match;
        const options = this.state.data.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.name + "-" + d.startTime}>
                {(d.hostteam == null || d.guestteam == null) ?
                    <span>{d.name}</span>
                    : <div className="center">
                        <Avatar src={d.hostteam ? d.hostteam.headImg : defultAvatar}/>
                        <p className="ml-s">{d.hostteam ? d.hostteam.name : ""}</p>
                        <p className="ml-s mr-s">{d.score}</p>
                        <Avatar src={d.guestteam ? d.guestteam.headImg : defultAvatar}/>
                        <p className="ml-s">{d.guestteam ? d.guestteam.name : ""}</p>
                    </div>}
            </Tooltip>
        </Option>);
        return (
            visible ?
                <div>
                    <Form>
                        <div className="center w-full">
                            <span style={{fontSize: 16, fontWeight: 'bold'}}>关联比赛</span>
                        </div>
                        <Select
                            showSearch
                            style={{minWidth: 300}}
                            placeholder="按名称搜索并选择"
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onChange={this.handleChange}
                            onPopupScroll={this.handleShowMore}
                            notFoundContent={null}
                            // mode="tags"
                            // loading={this.state.loading}
                            getInputElement={() => (
                                <input onInput={this.handleSearch}
                                       onCompositionStart={this.onInputCompositionStart}
                                       onCompositionEnd={this.onInputCompositionEnd}/>)}
                        >
                            {options}
                        </Select>
                        <div className="center w-full">
                            <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                                  hidden={this.state.matchLoaded}/>
                        </div>
                        <div className="center w-full">
                            {(currentMatch.hostteam == null || currentMatch.guestteam == null) ?
                                <Tooltip
                                    title={currentMatch.name + "-" + currentMatch.startTime}><span>{currentMatch.name}</span></Tooltip>
                                : <Tooltip title={currentMatch.name + "-" + currentMatch.startTime}>
                                    <div className="center">
                                        <Avatar
                                            src={currentMatch.hostteam ? currentMatch.hostteam.headImg : defultAvatar}/>
                                        <p className="ml-s">{currentMatch.hostteam ? currentMatch.hostteam.name : ""}</p>
                                        <p className="ml-s mr-s">{currentMatch.score}</p>
                                        <Avatar
                                            src={currentMatch.guestteam ? currentMatch.guestteam.headImg : defultAvatar}/>
                                        <p className="ml-s">{currentMatch.guestteam ? currentMatch.guestteam.name : ""}</p>
                                    </div>
                                </Tooltip>}
                        </div>
                        {currentMatch == null ? <div className="center w-full"><span>暂未关联比赛</span></div> : null}
                        <div className="center w-full">
                            <span style={{fontSize: 16, fontWeight: 'bold'}}>封面图</span>
                        </div>
                        <div className="center w-full">
                            <FormItem {...formItemLayout} className="ts-form-item bs-form-item form-match-poster">
                                {getFieldDecorator('poster', {
                                    // initialValue: logo,
                                    getValueFromEvent(e) {
                                        return form.getFieldValue('poster')
                                    },
                                    onChange(e) {
                                        const file = e.file;
                                        if (file.response) {
                                            form.setFieldsValue({
                                                poster: file.response.data
                                            })
                                        }
                                        handleAvatarChange(e);
                                    }
                                })(
                                    <Upload
                                        accept="image/*"
                                        action={upload}
                                        listType="picture-card"
                                        withCredentials={true}
                                        showUploadList={false}
                                        disabled={this.state.uploading}
                                        onChange={this.handleAvatarChange}
                                    >
                                        {
                                            <img
                                                src={form.getFieldValue('poster') ? form.getFieldValue('poster') :
                                                    (record.poster ? record.poster : imgcover)} alt="poster"
                                                className="form-match-poster-img"/>
                                        }

                                    </Upload>
                                )}
                            </FormItem>
                        </div>
                        <div className="center mt-m">
                            <Input style={{minWidth: 300, textAlign: "center"}} placeholder='封面地址'
                                   onChange={this.onPosterChange.bind(this, form)}
                                   value={form.getFieldValue('poster') ? form.getFieldValue('poster') : record.poster}/>
                        </div>
                        <div className="w-full center mt-s">
                            <span>观看人数：{record.view}</span>
                        </div>
                        <div className="w-full center">
                            <span>实际观看人数：{record.viewreal}</span>
                        </div>
                        <FormItem {...formItemLayout} label="地址" className="bs-form-item">
                            {getFieldDecorator('path', {
                                initialValue: record.path,
                                rules: [{required: true, message: '请输入地址'}],
                            })(
                                <Input.TextArea placeholder='地址'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="标题" className="bs-form-item">
                            {getFieldDecorator('title', {
                                initialValue: record.title,
                            })(
                                <Input.TextArea placeholder='标题'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="基础观看人数" className="bs-form-item">
                            {getFieldDecorator('viewbase', {
                                initialValue: record.viewbase,
                            })(
                                <Input placeholder='基础观看人数'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="人数放大最小" className="bs-form-item">
                            {getFieldDecorator('viewExpendMin', {
                                initialValue: record.viewExpendMin,
                            })(
                                <Input placeholder='人数放大最小'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="人数放大最大" className="bs-form-item">
                            {getFieldDecorator('viewExpendMax', {
                                initialValue: record.viewExpendMax,
                            })(
                                <Input placeholder='人数放大最大'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="点赞数" className="bs-form-item">
                            {getFieldDecorator('nooice', {
                                initialValue: record.nooice,
                            })(
                                <Input placeholder='点赞数'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述" className="bs-form-item">
                            {getFieldDecorator('description', {
                                initialValue: record.description,
                            })(
                                <Input.TextArea placeholder='描述'/>
                            )}
                        </FormItem>
                        <div className="w-full center">
                            <span>创建时间：{record.createTime}</span>
                        </div>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('id', {
                                initialValue: record.id,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                    </Form>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallPlayerModifyMediaDialog);