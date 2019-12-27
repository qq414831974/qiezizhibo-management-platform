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
import {getAllDefaultUser, getAllRoles, uploadimg} from "../../axios";
import logo from '../../static/logo.png';
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

class UserModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
        this.props.visible && this.fetch();
    }

    fetch = () => {
        this.setState({loading: true});
        getAllRoles({pageSize: 100, pageNum: 1,}).then((data) => {
            if (data && data.list) {
                this.setState({
                    data: data.list,
                    loading: false,
                });
            } else {
                message.error('获取权限信息失败：' + (data ? data.code + ":" + data.msg : data), 3);
            }
        });
    }
    getRoleOption = () => {
        let dom = [];
        this.state.data && this.state.data.forEach((item, index) => {
            dom.push(<Option value={item.roleCode} data={item} key={item.roleCode}>
                <Tooltip placement="rightTop" title={
                    this.getRoleTip(item)
                }>
                    <p className="mb-n">{item.roleName}</p>
                </Tooltip>
            </Option>)
        });
        return dom;
    }
    getRoleTip = (param) => {
        let dom = [];
        param.menuList && param.menuList.forEach((item, index) => {
            dom.push(<p key={item.roleCode + item.menuCode}>{item.name}</p>);
        });
        return dom;
    }
    onRoleSelect = (e, op) => {
        this.setState({
            role: op.props.data,
        });
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
                                        avatar: file.response
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
                                        src={form.getFieldValue('avatar') ? form.getFieldValue('avatar') :
                                            (record.avatar ? record.avatar : logo)}
                                        alt="avatar"
                                        className="round-img"/>
                                }

                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('name', {
                            initialValue: record.name,
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户名" className="bs-form-item">
                        {getFieldDecorator('userName', {
                            initialValue: record.userName,
                            rules: [{required: true, message: '请输入用户名!'}],
                        })(
                            <Input placeholder='请输入用户名!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码" className="bs-form-item">
                        {getFieldDecorator('passWord', {
                            initialValue: record.passWord,
                        })(
                            <Input placeholder='请输入密码默认为qiezitv!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="权限" className="bs-form-item-nowrap">
                        {getFieldDecorator('role.roleCode', {
                            initialValue: record.role ? record.role.roleCode : null,
                            rules: [{required: true, message: '请选择权限!'}],
                        })(
                            <Select onSelect={onRoleSelect} disabled={this.state.loading}>
                                {this.state.data ? getRoleOption() : null}
                            </Select>
                        )}
                        <Icon className="ml-s" style={{fontSize: 16}} type="loading" hidden={!this.state.loading}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="部门" className="bs-form-item">
                        {getFieldDecorator('unit', {
                            initialValue: record.unit,
                        })(
                            <Input placeholder='请输入部门!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                        {getFieldDecorator('status', {
                            initialValue: record.status,
                        })(
                            <Select placeholder='请选择状态!'>
                                <Option value={1} key={"status-1"}>启用</Option>
                                <Option value={2} key={"status-2"}>禁用</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注" className="bs-form-item">
                        {getFieldDecorator('remark', {
                            initialValue: record.remark,
                        })(
                            <Input.TextArea placeholder='备注'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            initialValue: record.userNo,
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

export default connect(mapStateToProps, mapDispatchToProps)(UserModifyDialog);