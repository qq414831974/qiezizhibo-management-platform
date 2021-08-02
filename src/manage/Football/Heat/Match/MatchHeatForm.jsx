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
    Collapse, Progress, Switch, message
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {upload} from "../../../../axios";
import imgcover from "../../../../static/imgcover.jpg";


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

class MatchHeatForm extends React.Component {
    state = {
        growth: [],
        discount: []
    }

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
            awardPic: e.target.value
        })
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type ? record.type : 0,
                            rules: [{required: true, message: '请选择类型!'}],
                        })(
                            <Select placeholder="请选择类型!">
                                <Option value={0}>球队热度比拼</Option>
                                <Option value={1}>球员热度比拼</Option>
                                <Option value={2}>联赛球员热度比拼</Option>
                                <Option value={3}>联赛球队热度比拼</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="开启" className="bs-form-item">
                        {getFieldDecorator('available', {
                            initialValue: record.available != null ? record.available : false,
                            valuePropName: 'checked',
                            rules: [{required: true, message: '请选择是否开始!'}],
                        })(
                            <Switch/>
                        )}
                    </FormItem>
                    <Tooltip placement="topLeft" trigger="click" title="以比赛开始时间为基准，负数为提前？分钟，正数为延后？分钟">
                        <FormItem {...formItemLayout} label="开始时间/分钟" className="bs-form-item">
                            {getFieldDecorator('startInterval', {
                                initialValue: record.startInterval ? record.startInterval : null,
                                rules: [{required: true, message: '请输入时间!'}],
                            })(
                                <InputNumber hidden placeholder='请输入时间!'/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <Tooltip placement="topLeft" trigger="click" title="以比赛结束时间为基准，负数为提前？分钟，正数为延后？分钟">
                        <FormItem {...formItemLayout} label="结束时间/分钟" className="bs-form-item">
                            {getFieldDecorator('endInterval', {
                                initialValue: record.endInterval ? record.endInterval : null,
                                rules: [{required: true, message: '请输入时间!'}],
                            })(
                                <InputNumber hidden placeholder='请输入时间!'/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <FormItem {...formItemLayout} label="热度初始值" className="bs-form-item">
                        <Row gutter={10}>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最小值" className="bs-form-item">
                                    {getFieldDecorator('expand.baseMin', {
                                        initialValue: record.expand != null ? record.expand.baseMin : null,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                        <InputNumber className="w-full" hidden placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最大值" className="bs-form-item">
                                    {getFieldDecorator('expand.baseMax', {
                                        initialValue: record.expand != null ? record.expand.baseMax : null,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                        <InputNumber className="w-full" placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem {...formItemLayout} label="热度放大值" className="bs-form-item">
                        <Row gutter={10}>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最小值" className="bs-form-item">
                                    {getFieldDecorator('expand.expandMin', {
                                        initialValue: record.expand != null ? record.expand.expandMin : null,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                        <InputNumber className="w-full" hidden placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最大值" className="bs-form-item">
                                    {getFieldDecorator('expand.expandMax', {
                                        initialValue: record.expand != null ? record.expand.expandMax : null,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                        <InputNumber className="w-full" placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem {...formItemLayout} label="奖品" className="bs-form-item">
                        {getFieldDecorator('award', {
                            initialValue: record.award ? record.award : null,
                            // rules: [{required: true, message: '请输入奖品!'}],
                        })(
                            <Input placeholder='请输入奖品!'/>
                        )}
                    </FormItem>
                    <div className="center w-full">
                        <span className="mb-n mt-m" style={{fontSize: 20}}>奖品图片</span>
                    </div>
                    <div className="center w-full">
                        <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                            {getFieldDecorator('awardPic', {
                                // initialValue: this.state.currentLeague?this.state.currentLeague.poster:null,
                                getValueFromEvent(e) {
                                    return form.getFieldValue('awardPic')
                                },
                                onChange(e) {
                                    const file = e.file;
                                    if (file.response) {
                                        form.setFieldsValue({
                                            awardPic: file.response.data
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
                                            src={form.getFieldValue('awardPic') ? form.getFieldValue('awardPic') :
                                                (record.awardPic ? record.awardPic : imgcover)}
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
                               value={form.getFieldValue('awardPic') ? form.getFieldValue('awardPic') : record.awardPic}/>
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
                            <Button type="primary" htmlType="submit">
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchHeatForm);