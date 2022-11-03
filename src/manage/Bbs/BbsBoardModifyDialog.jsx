import React from 'react';
import {
    Form,
    Input,
    Select,
    Avatar,
    Tooltip,
    Icon, Upload,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllDefaultUser, uploadimg} from "../../axios";
import {message} from "antd/lib/index";
import defultAvatar from "../../static/avatar.jpg";


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

class BbsBoardModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
    }

    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                loading: false,
            }));
        }
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                        {getFieldDecorator('headImg', {
                            initialValue: record.headImg,
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
                                            (record.headImg ? record.headImg : defultAvatar)}
                                        alt="avatar"
                                        className="round-img"/>
                                }

                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                        {getFieldDecorator('name', {
                            initialValue: record.name,
                            rules: [{required: true, message: '请输入名字'}],
                        })(
                            <Input placeholder='请输入名字'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="简称" className="bs-form-item">
                        {getFieldDecorator('shortName', {
                            initialValue: record.shortName,
                            rules: [{required: true, message: '请输入简称'}],
                        })(
                            <Input placeholder='请输入简称'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(BbsBoardModifyDialog);