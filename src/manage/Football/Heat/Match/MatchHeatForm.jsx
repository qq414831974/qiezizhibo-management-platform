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
    Collapse, Progress, Switch, message, Modal
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
        discount: [],
        numberSelectValue: 1,
        percentMapValue: {}
    }

    componentDidMount() {
        if (this.props.record) {
            this.setState({type: this.props.record.type})
            if (this.props.record.cashPercentMap) {
                this.setState({
                    percentMapValue: this.props.record.cashPercentMap,
                    numberSelectValue: Object.keys(this.props.record.cashPercentMap).length,
                })
                this.getCashPercentMapValue(this.props.record.cashPercentMap);
            }
        }
    }

    getCashPercentMapValue = (cashPercentMap) => {
        let mapString = "";
        const keys = Object.keys(cashPercentMap);
        let index = 0;
        for (let key of keys) {
            index++;
            mapString += `第${key}名:${cashPercentMap[key]}%`
            if (index != keys.length) {
                mapString += "，\r\n"
            }
        }
        this.setState({cashPercentMapValue: mapString})
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
    onCashPercentMapInputClick = () => {
        this.setState({mapModalVisible: true})
    }
    handleMapConfirm = () => {
        const {form} = this.props;
        let cashPercentMap = {};
        let number = this.state.numberSelectValue;
        if (number == null) {
            number = 1;
        }
        for (let key of Object.keys(this.state.percentMapValue)) {
            if (key != null && this.state.percentMapValue[key] != null && key <= number) {
                cashPercentMap[key] = this.state.percentMapValue[key];
            }
        }
        this.getCashPercentMapValue(cashPercentMap);
        form.setFieldsValue({cashPercentMap: cashPercentMap});
        this.setState({mapModalVisible: false})
    }
    handleMapCancel = () => {
        this.setState({mapModalVisible: false})
    }
    getNumSelectOption = () => {
        let dom = [];
        for (let i = 1; i <= 10; i++) {
            dom.push(<Option value={i}>共{i}个名次</Option>)
        }
        return dom;
    }
    onNumSelectChange = (e) => {
        this.setState({numberSelectValue: e})
    }
    getPercentMapInput = () => {
        let dom = [];
        for (let i = 1; i <= this.state.numberSelectValue; i++) {
            dom.push(<Row className="center flex-important mt-s">
                <Col xs={24} sm={4} style={{textAlign: "end"}}>
                    第{i}名：
                </Col>
                <Col xs={24} sm={16}>
                    <InputNumber
                        value={this.state.percentMapValue[i]}
                        onChange={this.onPercentMapValueChange.bind(this, i)}
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                    />
                </Col>
            </Row>)
        }
        return dom;
    }
    onPercentMapValueChange = (index, value) => {
        let percentMapValue = this.state.percentMapValue;
        if (percentMapValue == null) {
            percentMapValue = {};
        }
        percentMapValue[index] = value;
        this.setState({percentMapValue})
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange

        return (
            <div>
                {visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type ? record.type : 0,
                            rules: [{required: true, message: '请选择类型!'}],
                                onChange: (e) => {
                                    this.setState({type: e})
                                }
                        })(
                            <Select placeholder="请选择类型!">
                                    {/*<Option value={0}>球队热度比拼</Option>*/}
                                    {/*<Option value={1}>球员热度比拼</Option>*/}
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
                                    <InputNumber placeholder='请输入时间!'/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <Tooltip placement="topLeft" trigger="click" title="以比赛结束时间为基准，负数为提前？分钟，正数为延后？分钟">
                        <FormItem {...formItemLayout} label="结束时间/分钟" className="bs-form-item">
                            {getFieldDecorator('endInterval', {
                                initialValue: record.endInterval ? record.endInterval : null,
                                rules: [{required: true, message: '请输入时间!'}],
                            })(
                                    <InputNumber placeholder='请输入时间!'/>
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
                                            <InputNumber className="w-full" placeholder='请输入数值!'/>
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
                                            <InputNumber className="w-full" placeholder='请输入数值!'/>
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
                        {this.state.type == 2 ?
                            <div>
                                <FormItem {...formItemLayout} label="开启提现模式" className="bs-form-item">
                                    {getFieldDecorator('cashAvailable', {
                                        initialValue: record.cashAvailable != null ? record.cashAvailable : false,
                                        valuePropName: 'checked',
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="开启全员预提现" className="bs-form-item">
                                    {getFieldDecorator('preCashAvailable', {
                                        initialValue: record.preCashAvailable != null ? record.preCashAvailable : false,
                                        valuePropName: 'checked',
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="全员预提现百分比" className="bs-form-item">
                                    {getFieldDecorator('preCashPercent', {
                                        initialValue: record.preCashPercent != null ? record.preCashPercent : null,
                                    })(
                                        <InputNumber formatter={value => `${value}%`}
                                                     parser={value => value.replace('%', '')}
                                                     placeholder='请输入百分比!'/>
                                    )}
                                </FormItem>
                                <Row onClick={this.onCashPercentMapInputClick}>
                                    <Col xs={24} sm={4} style={{textAlign: "end", color: "rgba(0, 0, 0, 0.85)"}}>
                                        <span>点击修改提现规则：</span>
                                    </Col>
                                    <Col xs={24} sm={16}>
                                        <Input.TextArea
                                            autoSize={{minRows: 3, maxRows: 11}}
                                            className="cursor-hand"
                                            value={this.state.cashPercentMapValue}
                                            disabled/>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="提现规则" hidden className="bs-form-item">
                                    {getFieldDecorator('cashPercentMap', {
                                        initialValue: record.cashPercentMap != null ? record.cashPercentMap : null,
                                    })(
                                        <Input hidden disabled/>
                                    )}
                                </FormItem>
                                <Tooltip placement="topLeft" trigger="click" title="热度pk结束时间为基准？天后不验证则提现失效">
                                    <FormItem {...formItemLayout} label="提现验证过期时间/天" className="bs-form-item">
                                        {getFieldDecorator('cashVerifyExpireDays', {
                                            initialValue: record.cashVerifyExpireDays ? record.cashVerifyExpireDays : null,
                                        })(
                                            <InputNumber formatter={value => `${value}天`}
                                                         parser={value => value.replace('天', '')}
                                                         placeholder='请输入时间!'/>
                                        )}
                                    </FormItem>
                                </Tooltip>
                            </div> : null}
                        <FormItem {...formItemLayout} label="奖品/规则" className="bs-form-item">
                        {getFieldDecorator('award', {
                            initialValue: record.award ? record.award : null,
                            // rules: [{required: true, message: '请输入奖品!'}],
                        })(
                            <Input placeholder='请输入奖品!'/>
                        )}
                    </FormItem>
                    <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>奖品/规则图片</span>
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
                        <FormItem {...formItemLayout} hidden className="bs-form-item">
                            {getFieldDecorator('numberSelectValue', {
                                initialValue: this.state.numberSelectValue,
                            })(
                                <Input hidden/>
                            )}
                        </FormItem>
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
                    null}
                <Modal
                    title="请添加"
                    visible={this.state.mapModalVisible}
                    footer={[
                        <Button key="back" onClick={this.handleMapCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleMapConfirm}>确定</Button>,
                    ]}
                    onCancel={this.handleMapCancel}>
                    <div className="w-full center">
                        <Select
                            className="mb-s"
                            value={this.state.numberSelectValue}
                            style={{width: 120}}
                            onChange={this.onNumSelectChange}>
                            {this.getNumSelectOption()}
                        </Select>
                    </div>
                    <div>
                        {this.getPercentMapInput()}
                    </div>
                </Modal>
            </div>
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