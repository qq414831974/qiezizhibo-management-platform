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
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllMatchs, upload, getMatchById, updateMediaInPlayer, getMediaInPlayer} from "../../../../axios";

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

class MatchClipCollectionModifyDialog extends React.Component {
    state = {
        position: undefined,
        data: [],
        match: {}
    }

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} label="视频地址" className="bs-form-item">
                            {getFieldDecorator('url', {
                                initialValue: record.url,
                                rules: [{required: true, message: '请输入视频地址!'}],
                            })(
                                <Input disabled placeholder='视频地址'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="未加片头fileId" className="bs-form-item">
                            {getFieldDecorator('fileId', {
                                initialValue: record.fileId,
                                rules: [{required: true, message: '请输入视频地址!'}],
                            })(
                                <Input disabled placeholder='未加片头fileId'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="加片头后fileId" className="bs-form-item">
                            {getFieldDecorator('preffixOnFileId', {
                                initialValue: record.preffixOnFileId,
                                rules: [{required: true, message: '请输入视频地址!'}],
                            })(
                                <Input disabled placeholder='加片头后fileId'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="生成状态">
                            {getFieldDecorator('status', {
                                initialValue: record.status,
                            })(
                                <Select disabled>
                                    <Option value="editProcessing">编辑视频中</Option>
                                    <Option value="preffixProcessing">片头编辑中</Option>
                                    <Option value="done">编辑视频完成</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="自动剪辑">
                            {getFieldDecorator('autoPreffix', {
                                initialValue: record.autoPreffix,
                            })(
                                <Select disabled>
                                    <Option value={true}>开启</Option>
                                    <Option value={false}>关闭</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('preffixOnTaskId', {
                                initialValue: record.preffixOnTaskId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('taskId', {
                                initialValue: record.taskId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('playerId', {
                                initialValue: record.playerId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('teamId', {
                                initialValue: record.teamId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('matchId', {
                                initialValue: record.matchId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchClipCollectionModifyDialog);