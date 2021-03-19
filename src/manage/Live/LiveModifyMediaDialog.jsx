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
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadposter, getActivityMediaList, updateActivityMedia, getActivityMedia, getActivityMediaFileId} from "../../axios";
import imgcover from '../../static/imgcover.jpg';

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

class LiveModifyMediaDialog extends React.Component {
    state = {
        position: undefined,
        data: [],
        match: {}
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        this.setState({mediaLoading: true});
        getActivityMedia(this.props.record.id, {activityId: this.props.activityId}).then(activityMediaData => {
            if (activityMediaData && activityMediaData.code == 200) {
                if (activityMediaData.data) {
                    this.getActivityMediaFileId(this.props.activityId, this.props.record.id);
                    this.setState({
                        activityMediaData: activityMediaData ? activityMediaData.data : {},
                    });
                    getActivityMediaList({activityId: this.props.activityId}).then(data => {
                        if (data && data.code == 200 && data.data.length) {
                            let sequence = 0;
                            data.data.forEach((item) => {
                                if (item.mediaId == this.props.record.id) {
                                    sequence = item.sequence
                                }
                            })
                            this.setState({mediaList: data.data, sequenceValue: sequence});
                        } else {
                            this.setState({mediaList: null});
                        }
                        this.setState({mediaLoading: false});
                    });
                } else {
                    message.warn(activityMediaData.message, 1);
                }
            } else {
                message.error('获取直播信息失败：' + (activityMediaData ? activityMediaData.code + ":" + activityMediaData.message : activityMediaData), 3);
            }
        })
    }
    getActivityMediaFileId = (id, mediaId) => {
        getActivityMediaFileId({id: id, mediaId: mediaId}).then(data => {
            if (data && data.code == 200) {
                this.setState({fileId: data.data});
            } else {
                message.error('获取媒体文件id失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
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
    getSequenceSelector = () => {
        let mediaList = this.state.mediaList;
        let dom = [];
        if (mediaList) {
            const totalSize = mediaList.length;
            for (let i = 0; i < totalSize; i++) {
                dom.push(<Option value={i}>{`第${i + 1}段`}</Option>)
            }
        }
        return dom;
    }
    handleSequenceChange = (value) => {
        updateActivityMedia({
            id: this.state.activityMediaData.id,
            activityId: this.props.activityId,
            mediaId: this.props.record.id,
            sequence: value
        }).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('修改排序成功', 1);
                    this.fetch();
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改排序失败：' + (data ? data.code + "-" + data.message : data), 3);
            }
        })
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange;
        return (
            visible ?
                <div>
                    <Form>
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
                                        action={uploadposter}
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
                        <div className="center w-full">
                            <span style={{fontSize: 16, fontWeight: 'bold'}}>段落</span>
                        </div>
                        <div>
                            <Select loading={this.state.mediaLoading}
                                    disabled={this.state.mediaLoading}
                                    value={this.state.sequenceValue}
                                    onChange={this.handleSequenceChange}>
                                {this.getSequenceSelector()}
                            </Select>
                        </div>
                        <div className="w-full center">
                            <span>媒体文件id：{this.state.fileId}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveModifyMediaDialog);