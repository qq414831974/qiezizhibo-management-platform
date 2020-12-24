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

class MatchClipModifyDialog extends React.Component {
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
                                <Input placeholder='视频地址'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="顺序" className="bs-form-item">
                            {getFieldDecorator('sequence', {
                                initialValue: record.sequence,
                                rules: [{required: true, message: '请输入顺序!'}],
                            })(
                                <Input placeholder='顺序'/>
                            )}
                        </FormItem>
                        <FormItem  {...formItemLayout} label="剪辑开始" className="bs-form-item">
                            {getFieldDecorator('timeStart', {
                                rules: [{required: true, message: '请选择开始时间!'}],
                                initialValue: moment(record.timeStart),
                            })(
                                <DatePicker
                                    showTime
                                    format='YYYY-MM-DD HH:mm:ss'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="剪辑结束" className="bs-form-item">
                            {getFieldDecorator('timeEnd', {
                                rules: [{required: true, message: '请选择结束时间!'}],
                                initialValue: moment(record.timeEnd),
                            })(
                                <DatePicker
                                    showTime
                                    format='YYYY-MM-DD HH:mm:ss'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="生成状态">
                            {getFieldDecorator('planing', {
                                initialValue: record.planing,
                            })(
                                <Select>
                                    <Option value={true}>生成中</Option>
                                    <Option value={false}>已生成</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="计划生成" className="bs-form-item">
                            {getFieldDecorator('planTime', {
                                rules: [{required: true, message: '请选择开始时间!'}],
                                initialValue: moment(record.planTime),
                            })(
                                <DatePicker disabled
                                            showTime
                                            format='YYYY-MM-DD HH:mm:ss'/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('timelineId', {
                                initialValue: record.timelineId,
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
                            {getFieldDecorator('matchId', {
                                initialValue: record.matchId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('activityId', {
                                initialValue: record.activityId,
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchClipModifyDialog);