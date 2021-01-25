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
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllRoles, uploadimg} from "../../axios";
import logo from '../../static/logo.png';
import {message} from "antd/lib/index";

moment.locale('zh-cn');

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

class UserAddDialog extends React.Component {
    state = {}

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
        const getRoleOption = this.getRoleOption;
        const onRoleSelect = this.onRoleSelect;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                        {getFieldDecorator('avatar', {
                            getValueFromEvent(e) {
                                return form.getFieldValue('avatar')
                            },
                            onChange(e) {
                                const file = e.file;
                                if (file.response) {
                                    form.setFieldsValue({
                                        avatar: file.response.data
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
                                        src={form.getFieldValue('avatar') ? form.getFieldValue('avatar') : logo}
                                        alt="avatar"
                                        className="round-img"/>
                                }

                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户名" className="bs-form-item">
                        {getFieldDecorator('userName', {
                        })(
                            <Input placeholder='请输入用户名!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码" className="bs-form-item">
                        {getFieldDecorator('password', {})(
                            <Input placeholder='请输入密码'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="性别" className="bs-form-item">
                        {getFieldDecorator('gender', {
                        })(
                            <Select placeholder='请选择性别!'>
                                <Option value={1} key={"gender-2"}>男</Option>
                                <Option value={0} key={"gender-1"}>女</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                        {getFieldDecorator('status', {
                            initialValue: 1,
                        })(
                            <Select placeholder='请选择状态!'>
                                <Option value={1} key={"status-1"}>启用</Option>
                                <Option value={2} key={"status-2"}>禁用</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="微信类型" className="bs-form-item">
                        {getFieldDecorator('wechatType', {
                            initialValue: 0,
                        })(
                            <Select placeholder='请选择微信类型!'>
                                <Option value={0} key={"wechatType-0"}>茄子TV</Option>
                                <Option value={1} key={"wechatType-1"}>青少年</Option>
                                <Option value={2} key={"wechatType-2"}>茄子FC</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="openid" className="bs-form-item">
                        {getFieldDecorator('wechatOpenid', {})(
                            <Input placeholder='请输入openid!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="手机号" className="bs-form-item">
                        {getFieldDecorator('phone', {})(
                            <Input placeholder='请输入手机号!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="邮箱" className="bs-form-item">
                        {getFieldDecorator('email', {})(
                            <Input placeholder='请输入邮箱!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="国家" className="bs-form-item">
                        {getFieldDecorator('country', {})(
                            <Input placeholder='请输入国家!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="省份" className="bs-form-item">
                        {getFieldDecorator('province', {})(
                            <Input placeholder='请输入省份!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="城市" className="bs-form-item">
                        {getFieldDecorator('city', {})(
                            <Input placeholder='请输入城市!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注" className="bs-form-item">
                        {getFieldDecorator('remark', {})(
                            <Input.TextArea placeholder='备注'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserAddDialog);