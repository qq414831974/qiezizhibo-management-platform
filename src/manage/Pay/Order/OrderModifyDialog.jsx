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

class OrderModifyDialog extends React.Component {
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
                    <FormItem {...formItemLayout} label="价格（分）" className="bs-form-item">
                        {getFieldDecorator('orderPrice', {
                            initialValue: record.orderPrice,
                        })(
                            <Input disabled/>
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
                    <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                        {getFieldDecorator('orderStatus', {
                            initialValue: record.orderStatus,
                        })(
                            <Select disabled>
                                <Option value={0}>未支付</Option>
                                <Option value={1}>已取消</Option>
                                <Option value={2}>已付款</Option>
                                <Option value={3}>退款中</Option>
                                <Option value={4}>已退款</Option>
                                <Option value={5}>退款失败</Option>
                                <Option value={6}>退款关闭</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="创建时间" className="bs-form-item">
                        {getFieldDecorator('createTime', {
                            initialValue: record.createTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="过期时间" className="bs-form-item">
                        {getFieldDecorator('expireTime', {
                            initialValue: record.expireTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="确认时间" className="bs-form-item">
                        {getFieldDecorator('confirmTime', {
                            initialValue: record.confirmTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="支付时间" className="bs-form-item">
                        {getFieldDecorator('payTime', {
                            initialValue: record.payTime,
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述" className="bs-form-item">
                        {getFieldDecorator('description', {
                            initialValue: record.description,
                        })(
                            <Input disabled placeholder='请输入描述!'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderModifyDialog);