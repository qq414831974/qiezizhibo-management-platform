import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    InputNumber,
    Icon,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../axios";
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

class ExpModifyDialog extends React.Component {
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
            visible ?
                <Form>
                    <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                        {getFieldDecorator('img', {
                            getValueFromEvent(e) {
                                return form.getFieldValue('img')
                            },
                            onChange(e) {
                                const file = e.file;
                                if (file.response) {
                                    form.setFieldsValue({
                                        img: file.response.data
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
                                        src={form.getFieldValue('img') ? form.getFieldValue('img') :
                                            (record.img ? record.img : logo)}
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
                    <FormItem {...formItemLayout} label="等级" className="bs-form-item">
                        {getFieldDecorator('level', {
                            initialValue: record.level,
                            rules: [{required: true, message: '请输入等级!'}],
                        })(
                            <InputNumber placeholder='请输入等级!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="最小经验" className="bs-form-item">
                        {getFieldDecorator('minExp', {
                            initialValue: record.minExp,
                            rules: [{required: true, message: '请输入最小经验!'}],
                        })(
                            <InputNumber placeholder='请输入最小经验!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="最大经验" className="bs-form-item">
                        {getFieldDecorator('maxExp', {
                            initialValue: record.maxExp,
                            rules: [{required: true, message: '请输入最大经验!'}],
                        })(
                            <InputNumber placeholder='请输入最大经验!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpModifyDialog);