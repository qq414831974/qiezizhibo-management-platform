import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    InputNumber,
    Icon,
    Button,
    Row,
    Col,
    Collapse, DatePicker
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../../../axios";
import logo from '../../../../static/logo.png';
import {message} from "antd/lib/index";
import NP from 'number-precision'


const Option = Select.Option;
const {Panel} = Collapse;

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

class PlayerRegistrationModifyDialog extends React.Component {
    state = {
        growth: [],
        discount: []
    }

    componentDidMount() {
    }

    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                loading: false,
            }));
        }
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                        {getFieldDecorator('headImg', {
                            getValueFromEvent(e) {
                                return form.getFieldValue('headImg')
                            },
                            onChange(e) {
                                const file = e.file;
                                if (file.response) {
                                    form.setFieldsValue({
                                        headImg: file.response.data
                                    })
                                }
                            }
                        })(
                            <Upload
                                accept="image/*"
                                action={uploadimg}
                                listType="picture-card"
                                withCredentials={true}
                                showUploadList={false}
                                onChange={this.handleAvatarChange}
                            >
                                {
                                    <img
                                        src={form.getFieldValue('headImg') ? form.getFieldValue('headImg') :
                                            (record.headImg ? record.headImg : logo)}
                                        alt="avatar"
                                        className="round-img"/>
                                }

                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名字!'}],
                            initialValue: record.name,
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="性别" className="bs-form-item">
                        {getFieldDecorator('gender', {
                            rules: [{required: true, message: '请选择性别!'}],
                            initialValue: record.gender,
                        })(
                            <Select placeholder='请选择性别!'>
                                <Option value={1} key={"gender-1"}>男</Option>
                                <Option value={0} key={"gender-0"}>女</Option>
                                <Option value={2} key={"gender-2"}>其他</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="球衣号码" className="bs-form-item">
                        {getFieldDecorator('shirtNum', {
                            rules: [{required: true, message: '请输入球衣号码'}],
                            initialValue: record.shirtNum,
                        })(
                            <Input placeholder='请输入球衣号码'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="联系人" className="bs-form-item">
                        {getFieldDecorator('contactType', {
                            rules: [{required: true, message: '请选择联系人!'}],
                            initialValue: record.contactType,
                        })(
                            <Select placeholder='请选择联系人!'>
                                <Option value={1} key={"contactType-1"}>爸爸</Option>
                                <Option value={0} key={"contactType-0"}>妈妈</Option>
                                <Option value={2} key={"contactType-2"}>其他</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="手机号" className="bs-form-item">
                        {getFieldDecorator('phoneNumber', {
                            rules: [{required: true, message: '请输入手机号!'}],
                            initialValue: record.phoneNumber,
                        })(
                            <Input placeholder='请输入手机号!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="证件类型" className="bs-form-item">
                        {getFieldDecorator('identityType', {
                            rules: [{required: true, message: '请选择证件类型!'}],
                            initialValue: record.identityType,
                        })(
                            <Select placeholder='请选择证件类型!'>
                                <Option value={0} key={"identityType-0"}>身份证</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="证件号" className="bs-form-item">
                        {getFieldDecorator('identityNumber', {
                            rules: [{required: true, message: '请输入证件号!'}],
                            initialValue: record.identityNumber,
                        })(
                            <Input placeholder='请输入证件号!'/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="审核状态" className="bs-form-item">
                        {getFieldDecorator('verifyStatus', {
                            initialValue: record.verifyStatus,
                        })(
                            <Select placeholder='请选择审核状态!'>
                                <Option value={-1} key={"verifyStatus--1"}>未审核</Option>
                                <Option value={0} key={"verifyStatus-0"}>审核不通过</Option>
                                <Option value={1} key={"verifyStatus-1"}>审核通过</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="审核附加信息" className="bs-form-item">
                        {getFieldDecorator('verifyMessage', {
                            initialValue: record.verifyMessage,
                        })(
                            <Input.TextArea placeholder='审核附加信息'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerRegistrationModifyDialog);