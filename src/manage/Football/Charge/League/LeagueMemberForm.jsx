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
    Collapse, Progress, Switch, message, Radio, Card
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {upload} from "../../../../axios";
import imgcover from "../../../../static/imgcover.jpg";
import NP from 'number-precision'

const Option = Select.Option;
const {Panel} = Collapse;

moment.locale('zh-cn');

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class LeagueMemberForm extends React.Component {
    state = {
        grades: [],
        gradeAwardRadio: {}
    }

    componentDidMount() {
        const {form, record} = this.props;
        if (record && record.available) {
            this.setState({available: true})
        }
        if (record && record.verifyAvailable) {
            this.setState({verifyAvailable: true})
        }
        if (record && record.contactAvailable) {
            this.setState({contactAvailable: true})
        }
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
            contactQrcode: e.target.value
        })
    }
    getPosterSelector = () => {
        const {form} = this.props;
        return <Select style={{width: 120}} placeholder="默认二维码">
            <Option key={`default`}
                    value="https://qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/images/contact_qrcode/qiezitv.jpeg"
                    onClick={() => {
                        form.setFieldsValue({
                            contactQrcode: "https://qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/images/contact_qrcode/qiezitv.jpeg"
                        })
                    }}>
                默认二维码
            </Option>
        </Select>
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <Card hoverable title="联赛会员">
                        <FormItem {...formItemLayout} label="是否开启购买" className="bs-form-item">
                            {getFieldDecorator('available', {
                                initialValue: record.available != null ? record.available : false,
                                valuePropName: 'checked',
                                onChange: (e) => {
                                    this.setState({available: e})
                                }
                            })(
                                <Switch/>
                            )}
                        </FormItem>
                        {this.state.available ?
                            <div>
                                <FormItem {...formItemLayout} label="价格" className="bs-form-item">
                                    {getFieldDecorator('price', {
                                        initialValue: record.price ? NP.divide(record.price, 100) : null,
                                        rules: [{required: true, message: '请输入价格!'}],
                                    })(
                                        <Input addonBefore="永久" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                            </div> : null}
                        <FormItem {...formItemLayout} label="是否开启球员验证" className="bs-form-item">
                            {getFieldDecorator('verifyAvailable', {
                                initialValue: record.verifyAvailable != null ? record.verifyAvailable : false,
                                valuePropName: 'checked',
                                onChange: (e) => {
                                    this.setState({verifyAvailable: e})
                                }
                            })(
                                <Switch/>
                            )}
                        </FormItem>
                        {this.state.verifyAvailable ?
                            <div>
                                <FormItem {...formItemLayout} label="每个球员验证限制数" className="bs-form-item">
                                    {getFieldDecorator('verifyLimited', {
                                        initialValue: record.verifyLimited,
                                        rules: [{required: true, message: '请输入限制数!'}],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="验证后几个月过期" className="bs-form-item">
                                    {getFieldDecorator('verifyExpireMonths', {
                                        initialValue: record.verifyExpireMonths,
                                        rules: [{required: true, message: '请输入过期时间!'}],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </div> : null}
                        <FormItem {...formItemLayout} label="是否开启联系验证" className="bs-form-item">
                            {getFieldDecorator('contactAvailable', {
                                initialValue: record.contactAvailable != null ? record.contactAvailable : false,
                                valuePropName: 'checked',
                                onChange: (e) => {
                                    this.setState({contactAvailable: e})
                                }
                            })(
                                <Switch/>
                            )}
                        </FormItem>
                        {this.state.contactAvailable ?
                            <div>
                                <FormItem {...formItemLayout} label="验证总人数限制" className="bs-form-item">
                                    {getFieldDecorator('contactLimited', {
                                        initialValue: record.contactLimited,
                                        rules: [{required: true, message: '请输入限制数!'}],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="验证后几个月过期" className="bs-form-item">
                                    {getFieldDecorator('contactExpireMonths', {
                                        initialValue: record.contactExpireMonths,
                                        rules: [{required: true, message: '请输入过期时间!'}],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                                <div className="center w-full">
                                    <span className="mb-n mt-m" style={{fontSize: 20}}>联系人二维码图片</span>
                                </div>
                                <div className="center w-full">
                                    <FormItem {...formItemLayout} className="bs-form-item form-qrcode">
                                        {getFieldDecorator('contactQrcode', {
                                            // initialValue: this.state.currentLeague?this.state.currentLeague.poster:null,
                                            getValueFromEvent(e) {
                                                return form.getFieldValue('contactQrcode')
                                            },
                                            onChange(e) {
                                                const file = e.file;
                                                if (file.response) {
                                                    form.setFieldsValue({
                                                        contactQrcode: file.response.data
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
                                                        src={form.getFieldValue('contactQrcode') ? form.getFieldValue('contactQrcode') :
                                                            (record.contactQrcode ? record.contactQrcode : imgcover)}
                                                        alt="poster"
                                                        className="form-qrcode-img"/>
                                                }

                                            </Upload>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="center mt-m">
                                    <Input
                                        addonBefore={this.getPosterSelector()}
                                        style={{minWidth: 300, textAlign: "center"}}
                                        placeholder='图片地址'
                                        onChange={this.onPosterChange.bind(this, form)}
                                        value={form.getFieldValue('contactQrcode') ? form.getFieldValue('contactQrcode') : record.contactQrcode}/>
                                </div>
                            </div> : null}
                        {record.id ? <FormItem {...formItemLayout} hidden className="bs-form-item">
                            {getFieldDecorator('id', {
                                initialValue: record.id,
                            })(
                                <Input hidden/>
                            )}
                        </FormItem> : null}
                    </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueMemberForm);