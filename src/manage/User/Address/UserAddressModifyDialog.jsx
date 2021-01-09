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

class UserAddressModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('userName', {
                            initialValue: record.userName,
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="电话" className="bs-form-item">
                        {getFieldDecorator('telNumber', {
                            initialValue: record.telNumber,
                            rules: [{required: true, message: '请输入电话!'}],
                        })(
                            <Input placeholder='请输入电话!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="省份" className="bs-form-item">
                        {getFieldDecorator('provinceName', {
                            initialValue: record.provinceName,
                            rules: [{required: true, message: '请输入省份!'}],
                        })(
                            <Input placeholder='请输入省份!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="城市" className="bs-form-item">
                        {getFieldDecorator('cityName', {
                            initialValue: record.cityName,
                            rules: [{required: true, message: '请输入城市!'}],
                        })(
                            <Input placeholder='请输入城市!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="区/县/镇" className="bs-form-item">
                        {getFieldDecorator('countyName', {
                            initialValue: record.countyName,
                            rules: [{required: true, message: '请输入区/县/镇!'}],
                        })(
                            <Input placeholder='请输入区/县/镇!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="邮政编码" className="bs-form-item">
                        {getFieldDecorator('postalCode', {
                            initialValue: record.postalCode,
                            rules: [{required: true, message: '请输入邮政编码!'}],
                        })(
                            <Input placeholder='请输入邮政编码!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="国家编码" className="bs-form-item">
                        {getFieldDecorator('nationalCode', {
                            initialValue: record.nationalCode,
                            rules: [{required: true, message: '请输入国家编码!'}],
                        })(
                            <Input placeholder='请输入国家编码!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="详细地址" className="bs-form-item">
                        {getFieldDecorator('detailInfo', {
                            initialValue: record.detailInfo,
                            rules: [{required: true, message: '请输入详细地址!'}],
                        })(
                            <Input placeholder='请输入详细地址!'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserAddressModifyDialog);