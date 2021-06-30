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
    Collapse, Progress, Switch, message, Radio, DatePicker
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {upload} from "../../../axios";
import imgcover from "../../../static/imgcover.jpg";


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

class LeagueRegistrationForm extends React.Component {
    state = {}

    componentDidMount() {
    }

    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploading: true, isupload: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({isupload: false});
            message.success("上传成功", 3);
        }
    }
    onPosterChange = (form, e) => {
        form.setFieldsValue({
            contractPic: e.target.value
        })
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <FormItem {...formItemLayout} label="开启报名" className="bs-form-item">
                        {getFieldDecorator('available', {
                            initialValue: record.available,
                            valuePropName: 'checked',
                            rules: [{required: true, message: '请选择是否开启!'}],
                        })(
                            <Switch/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="主办方密码" className="bs-form-item">
                        {getFieldDecorator('unitPassword', {
                            initialValue: record.unitPassword,
                            rules: [{required: true, message: '请输入密码!'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="结束时间" className="bs-form-item">
                        {getFieldDecorator('dateEnd', {
                            initialValue: record.dateEnd ? moment(record.dateEnd) : null,
                            rules: [{required: true, message: '请输入结束时间!'}],
                        })(
                            <DatePicker showTime
                                        format={'YYYY-MM-DD HH:mm'}/>
                        )}
                    </FormItem>
                    <div className="center w-full">
                        <span className="mb-n mt-m" style={{fontSize: 20}}>免责声明图片</span>
                    </div>
                    <div className="center w-full">
                        <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                            {getFieldDecorator('contractPic', {
                                // initialValue: this.state.currentLeague?this.state.currentLeague.poster:null,
                                getValueFromEvent(e) {
                                    return form.getFieldValue('contractPic')
                                },
                                onChange(e) {
                                    const file = e.file;
                                    if (file.response) {
                                        form.setFieldsValue({
                                            contractPic: file.response.data
                                        })
                                    }
                                    handleAvatarChange(e);
                                }
                            })(
                                <Upload
                                    accept="image/*"
                                    action={upload}
                                    listType="picture-card"
                                    withCredentials={true}
                                    showUploadList={false}
                                    disabled={this.state.uploading}
                                    onChange={this.handleAvatarChange}
                                >
                                    {
                                        <img
                                            src={form.getFieldValue('contractPic') ? form.getFieldValue('contractPic') :
                                                (record.contractPic ? record.contractPic : imgcover)}
                                            alt="poster"
                                            className="form-match-poster-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                    </div>
                    <div className="center mt-m">
                        <Input style={{minWidth: 300, textAlign: "center"}} placeholder='图片地址'
                               onChange={this.onPosterChange.bind(this, form)}
                               value={form.getFieldValue('contractPic') ? form.getFieldValue('contractPic') : record.contractPic}/>
                    </div>
                    {record.id ? <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden/>
                        )}
                    </FormItem> : null}
                    <div className="w-full center mt-l">
                        <FormItem wrapperCol={{span: 12, offset: 6}}>
                            <Button loading={this.props.modifyLoading}
                                    type="primary"
                                    htmlType="submit">
                                确定
                            </Button>
                        </FormItem>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueRegistrationForm);