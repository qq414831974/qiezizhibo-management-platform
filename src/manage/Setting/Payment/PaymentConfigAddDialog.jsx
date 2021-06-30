import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    Icon,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message} from "antd/lib/index";


const Option = Select.Option;
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

class PaymentConfigAddDialog extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="支付" className="bs-form-item">
                        {getFieldDecorator('enablePay', {
                            initialValue: true,
                            rules: [{required: true, message: '请选择支付能力!'}],
                        })(
                            <Select placeholder='请选择!'>
                                <Option value={true} key={"open-ture"}>开启</Option>
                                <Option value={false} key={"open-false"}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="礼物" className="bs-form-item">
                        {getFieldDecorator('enableGift', {
                            initialValue: true,
                            rules: [{required: true, message: '请选择礼物能力!'}],
                        })(
                            <Select placeholder='请选择!'>
                                <Option value={true} key={"gift-ture"}>开启</Option>
                                <Option value={false} key={"gift-false"}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="FC支付" className="bs-form-item mt-l">
                        {getFieldDecorator('enablePayFc', {
                            initialValue: true,
                            rules: [{required: true, message: '请选择支付能力!'}],
                        })(
                            <Select placeholder='请选择!'>
                                <Option value={true} key={"open-ture"}>开启</Option>
                                <Option value={false} key={"open-false"}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="FC礼物" className="bs-form-item">
                        {getFieldDecorator('enableGiftFc', {
                            initialValue: true,
                            rules: [{required: true, message: '请选择礼物能力!'}],
                        })(
                            <Select placeholder='请选择!'>
                                <Option value={true} key={"gift-ture"}>开启</Option>
                                <Option value={false} key={"gift-false"}>关闭</Option>
                            </Select>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentConfigAddDialog);