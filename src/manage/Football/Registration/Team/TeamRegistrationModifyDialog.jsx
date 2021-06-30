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
    Collapse, DatePicker, Avatar
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
import defultAvatar from "../../../../static/avatar.jpg";


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

class TeamRegistrationModifyDialog extends React.Component {
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
        return (
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
                <FormItem {...formItemLayout} label="手机号" className="bs-form-item">
                    {getFieldDecorator('phoneNumber', {
                        rules: [{required: true, message: '请输入手机号!'}],
                        initialValue: record.phoneNumber,
                    })(
                        <Input placeholder='请输入手机号!'/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="教练名字" className="bs-form-item">
                    {getFieldDecorator('coachName', {
                        rules: [{required: true, message: '请输入教练名字!'}],
                        initialValue: record.coachName,
                    })(
                        <Input placeholder='请输入名字!'/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="教练手机号" className="bs-form-item">
                    {getFieldDecorator('coachPhone', {
                        rules: [{required: true, message: '请输入教练手机号!'}],
                        initialValue: record.coachPhone,
                    })(
                        <Input placeholder='请输入手机号!'/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="审核状态" className="bs-form-item">
                    {getFieldDecorator('verifyStatus', {
                        initialValue: record.verifyStatus,
                    })(
                        <Select placeholder='请选择审核状态!'>
                            <Option value={-2} key={"verifyStatus--2"}>未提交</Option>
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
                <FormItem {...formItemLayout} label="最后修改一次" className="bs-form-item">
                    {getFieldDecorator('lastChance', {
                        initialValue: record.lastChance,
                    })(
                        <Select placeholder='请选择是否!'>
                            <Option value={true} key={"lastChance-true"}>能</Option>
                            <Option value={false} key={"lastChance-false"}>不能</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="登记时间" className="bs-form-item">
                    {getFieldDecorator('registerTime', {
                        initialValue: record.registerTime ? moment(record.registerTime) : null,
                        hidden: true
                    })(
                        <DatePicker disabled showTime
                                    format={'YYYY-MM-DD HH:mm'}/>
                    )}
                </FormItem>
                <FormItem style={{margin: 0}}>
                    {getFieldDecorator('id', {
                        initialValue: record.id,
                    })(
                        <Input hidden={true}/>
                    )}
                </FormItem>
                <Row className="mt-l">
                    <Col xs={24} sm={4}>
                        生成报名文档地址：
                    </Col>
                    <Col xs={24} sm={16}>
                        <a href={record.docUrl} target="_blank">{record.docUrl ? record.docUrl : "暂无"}</a>
                    </Col>
                </Row>
                <Row className="mt-l">
                    <Col xs={24} sm={4}>
                        报名人：
                    </Col>
                    <Col xs={24} sm={16}>
                        <Avatar src={record.user && record.user.avatar ? record.user.avatar : logo}/>
                        <span className="ml-s">{`${record.user ? record.user.name : "未知"}`}</span>
                    </Col>
                </Row>
            </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamRegistrationModifyDialog);