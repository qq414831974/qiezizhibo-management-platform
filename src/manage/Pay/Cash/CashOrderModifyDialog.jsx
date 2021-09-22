import React from 'react';
import {
    Form,
    Input,
    Icon,
    TreeSelect, Select, Tooltip,
} from 'antd';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import NP from 'number-precision'


const Option = Select.Option;

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

class CashOrderModifyDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="订单号" className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="金额（元）" className="bs-form-item">
                        {getFieldDecorator('cashOut', {
                            initialValue: NP.divide(record.cashOut, 100),
                        })(
                            <Input disabled addonAfter="元"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户id" className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            initialValue: record.userNo,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户openid" className="bs-form-item">
                        {getFieldDecorator('openId', {
                            initialValue: record.openId,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户实名" className="bs-form-item">
                        {getFieldDecorator('userRealName', {
                            initialValue: record.userRealName,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户身份证" className="bs-form-item">
                        {getFieldDecorator('userRealIdcard', {
                            initialValue: record.userRealIdcard,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                        {getFieldDecorator('cashStatus', {
                            initialValue: record.cashStatus,
                        })(
                            <Select disabled>
                                <Option value={-1}>已创建</Option>
                                <Option value={0}>处理中</Option>
                                <Option value={1}>成功</Option>
                                <Option value={2}>重试中</Option>
                                <Option value={3}>失败</Option>
                                <Option value={4}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="创建时间" className="bs-form-item">
                        {getFieldDecorator('cashOutCreateTime', {
                            initialValue: record.cashOutCreateTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="确认时间" className="bs-form-item">
                        {getFieldDecorator('cashOutConfirmTime', {
                            initialValue: record.cashOutConfirmTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="错误码" className="bs-form-item">
                        {getFieldDecorator('cashErrorCode', {
                            initialValue: record.cashErrorCode,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="重试次数" className="bs-form-item">
                        {getFieldDecorator('retry', {
                            initialValue: record.retry,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="下次重试时间" className="bs-form-item">
                        {getFieldDecorator('nextRetryTime', {
                            initialValue: record.nextRetryTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden={true}/>
                        )}
                    </FormItem>
                </Form>
                :
                null
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

export default connect(mapStateToProps, mapDispatchToProps)(CashOrderModifyDialog);