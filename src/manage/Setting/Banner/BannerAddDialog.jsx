import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    Tooltip,
    Icon, Checkbox, Radio,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllRoles, uploadposter} from "../../../axios";
import logo from '../../../static/blank.png';
import {message} from "antd/lib/index";


const Option = Select.Option;
const RadioGroup = Radio.Group;

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

class BannerAddDialog extends React.Component {
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
    onPosterChange = (form, e) => {
        form.setFieldsValue({
            img: e.target.value
        })
    }
    getAreasOption = (areas) => {
        let dom = [];
        dom.push(<Option value={null} data={null} key={`area-none`}>不选</Option>);
        areas.forEach((item) => {
            dom.push(<Option value={item.province} data={item.province}
                             key={`area-${item.id}`}>{item.province}</Option>);
        })
        return dom;
    }
    render() {
        const {visible, form, record, areas = []} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <div className="center w-full">
                        <FormItem className="bs-form-item form-match-poster">
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
                                    action={uploadposter}
                                    listType="picture-card"
                                    withCredentials={true}
                                    showUploadList={false}
                                    onChange={this.handleAvatarChange}
                                >
                                    {
                                        <img
                                            src={form.getFieldValue('img') ? form.getFieldValue('img') : logo}
                                            alt="img"
                                            className="form-match-poster-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                    </div>
                    <Input style={{minWidth: 300, textAlign: "center"}} placeholder='轮播图地址'
                           onChange={this.onPosterChange.bind(this, form)}
                           value={form.getFieldValue('img')}/>
                    <FormItem {...formItemLayout} label="跳转地址" className="bs-form-item">
                        {getFieldDecorator('url', {
                            rules: [{required: true, message: '请输入跳转地址!'}],
                        })(
                            <Input placeholder='请输入跳转地址!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序位置" className="bs-form-item">
                        {getFieldDecorator('position', {})(
                            <InputNumber placeholder='请输入排序位置!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="省份" className="bs-form-item">
                        {getFieldDecorator('province', {})(
                            <Select placeholder='请选择省份!'>
                                {this.getAreasOption(areas)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="地区" className="bs-form-item">
                        {getFieldDecorator('areaType', {
                            initialValue: 0
                        })(
                            <RadioGroup>
                                <Radio value={0}>默认</Radio>
                                <Radio value={1}>全国</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="小程序" className="bs-form-item">
                        {getFieldDecorator('wechatType', {
                            initialValue: 0
                        })(
                            <RadioGroup>
                                <Radio value={0}>茄子tv</Radio>
                                <Radio value={1}>青少年</Radio>
                            </RadioGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(BannerAddDialog);