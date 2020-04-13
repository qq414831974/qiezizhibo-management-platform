import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    Col,
    Button,
    Upload,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../../axios";

import defultAvatar from '../../../static/avatar.jpg';

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
class FootBallTeamModifyDialog extends React.Component {
    state = {
    }

    componentDidMount() {
        //receiveData({record: this.props.record}, 'responsive');
    }

    onSelectChange = (position) => {
        this.setState({position: position});
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
                <div>
                    <Form>
                        <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                            {getFieldDecorator('headImg', {
                                // initialValue: logo,
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
                                                (record.headImg?record.headImg:defultAvatar)}
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
                        <FormItem {...formItemLayout} label="英文名" className="bs-form-item">
                            {getFieldDecorator('englishName', {
                                initialValue: record.englishName,
                            })(
                                <Input placeholder='请输入英文名'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="国籍" className="bs-form-item">
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('country', {
                                        initialValue: record.country,
                                    })(
                                        <Input placeholder='请输入国家'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={1}>
                                <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                                </span>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('city', {
                                        initialValue: record.city,
                                    })(
                                        <Input placeholder='请输入城市'/>
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="所属人/单位" className="bs-form-item">
                            {getFieldDecorator('owner', {
                                initialValue: record.owner,
                            })(
                                <Input placeholder='请输入所属人/单位'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="口号" className="bs-form-item">
                            {getFieldDecorator('slogan', {
                                initialValue: record.slogan,
                            })(
                                <Input placeholder='请输入口号'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="创建日" className="bs-form-item">
                            {getFieldDecorator('birthdate', {
                                initialValue: record.birthdate?moment(record.birthdate):null,
                            })(
                                <DatePicker placeholder='请输入创建日' format={'YYYY-MM-DD'}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="备注" className="bs-form-item">
                            {getFieldDecorator('remark', {
                                initialValue: record.remark,
                            })(
                                <Input.TextArea placeholder='备注'/>
                            )}
                        </FormItem>
                        {this.props.detail ?
                            <FormItem {...formItemLayout}>
                                <Button type="primary" className="ml-l" onClick={this.props.handleSave}>保存配置</Button>
                            </FormItem> : <div/>
                        }
                        <FormItem style={{margin:0}}>
                            {getFieldDecorator('id', {
                                initialValue: record.id,
                            })(
                                <Input hidden={true} />
                            )}
                        </FormItem>
                    </Form>
                </div>
                :
                <div/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallTeamModifyDialog);