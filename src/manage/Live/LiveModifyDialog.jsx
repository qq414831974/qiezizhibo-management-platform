import React from 'react';
import {
    Form,
    Input,
    DatePicker, Select, Button, message,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    getActivityIngest,
    postActivityIngest,
    putActivityIngest,
    deleteActivityIngest,
    forbiddenActivity
} from "../../axios";
import copy from "copy-to-clipboard/index";


moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    },
};

class LiveModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
        //receiveData({record: this.props.record}, 'responsive');
    }

    getPullStreamUrls = (record) => {
        if(record == null){
            return null;
        }
        return <div>
            <div className="cursor-hand" onClick={this.copy.bind(this,record.rtmp)}>
                <Input addonBefore="rtmp" value={record.rtmp} disabled/>
            </div>
            <div className="cursor-hand" onClick={this.copy.bind(this,record.flv)}>
                <Input addonBefore="flv" value={record.flv} disabled/>
            </div>
            <div className="cursor-hand" onClick={this.copy.bind(this,record.hls)}>
                <Input addonBefore="hls" value={record.hls} disabled/>
            </div>
            <div className="cursor-hand" onClick={this.copy.bind(this,record.udp)}>
                <Input addonBefore="udp" value={record.udp} disabled/>
            </div>
        </div>
    }
    copy = (url)=>{
        copy(url);
        message.success('地址已复制到剪贴板');
    }
    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入名字'}],
                                initialValue: record.name,
                            })(
                                <Input placeholder='请输入名字' style={{maxWidth: 300}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="开始时间" className="bs-form-item">
                            {getFieldDecorator('startTime', {
                                rules: [{required: true, message: '请选择时间!'}],
                                initialValue: record.startTime ? moment(record.startTime) : null,
                                onChange(e) {
                                    form.setFieldsValue({
                                        startTime: e ? e.format('YYYY/MM/DD HH:mm:ss') : null,
                                    })
                                }
                            })(
                                <DatePicker showTime
                                            format={'YYYY/MM/DD HH:mm:ss'}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="结束时间" className="bs-form-item">
                            {getFieldDecorator('endTime', {
                                rules: [{required: true, message: '请选择时间!'}],
                                initialValue: record.endTime ? moment(record.endTime) : null,
                                onChange(e) {
                                    form.setFieldsValue({
                                        endTime: e ? e.format('YYYY/MM/DD HH:mm:ss') : null,
                                    })
                                }
                            })(
                                <DatePicker showTime
                                            format={'YYYY/MM/DD HH:mm:ss'}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                            {getFieldDecorator('status', {
                                initialValue: record.status,
                            })(
                                <Select disabled={true}>
                                    <Option value={0}>可用</Option>
                                    <Option value={1}>推流中</Option>
                                    <Option value={2}>已结束</Option>
                                    <Option value={-1}>禁用</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="推流地址" className="bs-form-item cursor-hand" onClick={this.copy.bind(this,record.pushStreamUrl)}>
                            {getFieldDecorator('pushStreamUrl', {
                                initialValue: record.pushStreamUrl,
                            })(
                                <Input disabled={true}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="拉流地址" className="bs-form-item">
                            {getFieldDecorator('ingestStreamUrl', {
                                initialValue: record.ingestStreamUrl,
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="播放地址" className="bs-form-item">
                            {this.getPullStreamUrls(record.pullStreamUrls)}
                        </FormItem>
                        <FormItem style={{margin:0}}>
                            {getFieldDecorator('id', {
                                initialValue: record.id,
                            })(
                                <Input hidden={true} />
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveModifyDialog);