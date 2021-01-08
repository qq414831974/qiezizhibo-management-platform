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
            if (data && data.code == 200 && data.data.records) {
                this.setState({
                    data: data.data.records,
                    loading: false,
                });
            } else {
                message.error('获取权限信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getRoleOption = () => {
        let dom = [];
        this.state.data && this.state.data.forEach((item, index) => {
            dom.push(<Option value={item.id} data={item} key={`role-${item.id}`}>
                <Tooltip placement="rightTop" title={
                    this.getRoleTip(item)
                }>
                    <p className="mb-n">{item.name}</p>
                </Tooltip>
            </Option>)
        });
        return dom;
    }
    getRoleTip = (param) => {
        let dom = [];
        param.permissions && param.permissions.forEach((item, index) => {
            dom.push(<p key={`permission-${item.id}`}>{item.name}</p>);
        });
        return <div>{dom}</div>;
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
                            <Input disabled placeholder='请输入用户名!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="权限" className="bs-form-item-nowrap">
                        {getFieldDecorator('roles', {
                            initialValue: record.roles ? record.roles.flatMap(role=>role.id) : null,
                            rules: [{required: true, message: '请选择权限!'}],
                        })(
                            // <Select onSelect={onRoleSelect} disabled={this.state.loading}>
                            //     {this.state.data ? getRoleOption() : null}
                            // </Select>
                            <Select
                                showSearch
                                placeholder="请选择"
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                notFoundContent={null}
                                mode="multiple"
                                loading={this.state.loading}
                            >
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
                    <FormItem {...formItemLayout} label="手机" className="bs-form-item">
                        {getFieldDecorator('phone', {
                            initialValue: record.phone,
                        })(
                            <Input placeholder='请输入手机!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="邮箱" className="bs-form-item">
                        {getFieldDecorator('email', {
                            initialValue: record.email,
                        })(
                            <Input placeholder='请输入邮箱!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="国家" className="bs-form-item">
                        {getFieldDecorator('country', {
                            initialValue: record.country,
                        })(
                            <Input placeholder='请输入国家!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="省份" className="bs-form-item">
                        {getFieldDecorator('province', {
                            initialValue: record.province,
                        })(
                            <Input placeholder='请输入省份!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="城市" className="bs-form-item">
                        {getFieldDecorator('city', {
                            initialValue: record.city,
                        })(
                            <Input placeholder='请输入城市!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="备注" className="bs-form-item">
                        {getFieldDecorator('remark', {
                            initialValue: record.remark,
                        })(
                            <Input.TextArea placeholder='备注'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户id" className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input disabled/>
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