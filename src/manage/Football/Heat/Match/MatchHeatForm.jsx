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
    Collapse, Progress, Switch, message, Modal, Card, Tabs
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import MatchHeatRoundInfo from "./MatchHeatRoundInfo";


const Option = Select.Option;
const {Panel} = Collapse;
const TabPane = Tabs.TabPane;

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
        percentMapValue: {},
        type: 2
    }

    componentDidMount() {
        if (this.props.record) {
            this.setState({
                type: this.props.record.type ? this.props.record.type : 2,
                round: this.props.record.round ? this.props.record.round : 1,
            });
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
    getRoundOptions = () => {
        let dom = [];
        for (let i = 1; i <= 5; i++) {
            dom.push(<Option key={i} value={i}>共{i}轮</Option>);
        }
        return dom;
    }
    onRoundChange = (e) => {
        console.log(e)
        this.setState({round: e})
    }
    getRoundInfos = () => {
        const {form, record} = this.props;
        let tabs = [];
        for (let i = 1; i <= this.state.round; i++) {
            tabs.push(<TabPane tab={`第${i}轮`} key={`${i}`} forceRender>
                <MatchHeatRoundInfo record={record} form={form} round={i}/>
            </TabPane>)
        }
        return <Tabs>
            {tabs}
        </Tabs>
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            <div>
                {visible ?
                <Form onSubmit={this.props.handleSubmit}>
                        <Card title="基础设置">
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type ? record.type : 2,
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
                    <FormItem {...formItemLayout} label="热度初始值" className="bs-form-item">
                        <Row gutter={10}>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最小值" className="bs-form-item">
                                    {getFieldDecorator('expand.baseMin', {
                                                initialValue: record.expand != null ? record.expand.baseMin : 0,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                            <InputNumber className="w-full" placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最大值" className="bs-form-item">
                                    {getFieldDecorator('expand.baseMax', {
                                                initialValue: record.expand != null ? record.expand.baseMax : 0,
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
                                                initialValue: record.expand != null ? record.expand.expandMin : 1,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                            <InputNumber className="w-full" placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  {...formItemLayout} label="最大值" className="bs-form-item">
                                    {getFieldDecorator('expand.expandMax', {
                                                initialValue: record.expand != null ? record.expand.expandMax : 1,
                                        rules: [{required: true, message: '请输入数值!'}],
                                    })(
                                        <InputNumber className="w-full" placeholder='请输入数值!'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                            <FormItem {...formItemLayout} label="轮次" className="bs-form-item">
                                {getFieldDecorator('round', {
                                    initialValue: record.round ? record.round : 1,
                                    rules: [{required: true, message: '请选择轮次!'}],
                                })(
                                    <Select placeholder="请选择类型!" onChange={this.onRoundChange}>
                                        {this.getRoundOptions()}
                                    </Select>
                                )}
                            </FormItem>
                        </Card>
                        <Card title="轮次信息设置">
                            {this.getRoundInfos()}
                        </Card>
                        <Card title="提现模式设置">
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
                        </Card>
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