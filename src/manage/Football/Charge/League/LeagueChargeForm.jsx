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

class LeagueChargeForm extends React.Component {
    state = {
        grades: [],
        gradeAwardRadio: {}
    }

    componentDidMount() {
        const {form, record} = this.props;
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Card hoverable title="直播收费">
                                <FormItem {...formItemLayout} label="直播收费" className="bs-form-item">
                                    {getFieldDecorator('isLiveCharge', {
                                        initialValue: record.isLiveCharge != null ? record.isLiveCharge : false,
                                        valuePropName: 'checked',
                                        rules: [{required: true, message: '请选择是否直播收费开启!'}],
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="永久价格" className="bs-form-item">
                                    {getFieldDecorator('live.price', {
                                        initialValue: record.live ? NP.divide(record.live.price, 100) : null,
                                        rules: [{required: true, message: '请输入永久价格!'}],
                                    })(
                                        <Input addonBefore="永久" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="一个月价格" className="bs-form-item">
                                    {getFieldDecorator('live.priceMonthly', {
                                        initialValue: record.live ? NP.divide(record.live.priceMonthly, 100) : null,
                                        rules: [{required: true, message: '请输入一个月价格价格!'}],
                                    })(
                                        <Input addonBefore="一月" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="送礼看直播" className="bs-form-item">
                                    {getFieldDecorator('live.giftWatchEnable', {
                                        initialValue: record.live ? record.live.giftWatchEnable : false,
                                        valuePropName: 'checked',
                                        rules: [{required: true, message: '请选择是否开启刷礼物看直播!'}],
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card hoverable title="录播收费">
                                <FormItem {...formItemLayout} label="录播收费" className="bs-form-item">
                                    {getFieldDecorator('isRecordCharge', {
                                        initialValue: record.isRecordCharge != null ? record.isRecordCharge : false,
                                        valuePropName: 'checked',
                                        rules: [{required: true, message: '请选择是否录播收费开启!'}],
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="永久价格" className="bs-form-item">
                                    {getFieldDecorator('record.price', {
                                        initialValue: record.record ? NP.divide(record.record.price, 100) : null,
                                        rules: [{required: true, message: '请输入永久价格!'}],
                                    })(
                                        <Input addonBefore="永久" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="一个月价格" className="bs-form-item">
                                    {getFieldDecorator('record.priceMonthly', {
                                        initialValue: record.record ? NP.divide(record.record.priceMonthly, 100) : null,
                                        rules: [{required: true, message: '请输入一个月价格价格!'}],
                                    })(
                                        <Input addonBefore="一月" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="送礼看直播" className="bs-form-item">
                                    {getFieldDecorator('record.giftWatchEnable', {
                                        initialValue: record.record ? NP.divide(record.record.giftWatchEnable, 100) : false,
                                        valuePropName: 'checked',
                                        rules: [{required: true, message: '请选择是否开启刷礼物看直播!'}],
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="送礼永久看直播" className="bs-form-item">
                                    {getFieldDecorator('record.giftWatchPrice', {
                                        initialValue: record.record ? NP.divide(record.record.giftWatchPrice, 100) : null,
                                        rules: [{required: true, message: '请输入永久价格!'}],
                                    })(
                                        <Input addonBefore="永久" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="送礼一月看直播" className="bs-form-item">
                                    {getFieldDecorator('record.giftWatchPriceMonthly', {
                                        initialValue: record.record ? NP.divide(record.record.giftWatchPriceMonthly, 100) : null,
                                        rules: [{required: true, message: '请输入一个月价格价格!'}],
                                    })(
                                        <Input addonBefore="一月" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card hoverable title="买断收费">
                                <FormItem {...formItemLayout} label="买断收费" className="bs-form-item">
                                    {getFieldDecorator('isMonopoly', {
                                        initialValue: record.isMonopoly != null ? record.isMonopoly : false,
                                        valuePropName: 'checked',
                                        rules: [{required: true, message: '请选择是否买断收费开启!'}],
                                    })(
                                        <Switch/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="买断价格" className="bs-form-item">
                                    {getFieldDecorator('monopoly.price', {
                                        initialValue: record.monopoly ? NP.divide(record.monopoly.price, 100) : null,
                                        rules: [{required: true, message: '请输入买断价格!'}],
                                    })(
                                        <Input addonBefore="永久" placeholder='价格' addonAfter="元/茄币"/>
                                    )}
                                </FormItem>
                            </Card>
                        </Col>
                    </Row>
                    <Card hoverable title="人数放大">
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="最小基础值" className="bs-form-item">
                                    {getFieldDecorator('expand.baseMin', {
                                        initialValue: record.expand != null ? record.expand.baseMin : 1,
                                        rules: [{required: true, message: '请输入最小值!'}],
                                    })(
                                        <Input placeholder='请输入最小值'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="最大基础值" className="bs-form-item">
                                    {getFieldDecorator('expand.baseMax', {
                                        initialValue: record.expand != null ? record.expand.baseMax : 10,
                                        rules: [{required: true, message: '请输入最大值!'}],
                                    })(
                                        <Input placeholder='请输入最大值'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="最小放大值" className="bs-form-item">
                                    {getFieldDecorator('expand.expandMin', {
                                        initialValue: record.expand != null ? record.expand.expandMin : 2,
                                        rules: [{required: true, message: '请输入最小值!'}],
                                    })(
                                        <Input placeholder='请输入最小值'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="最大放大值" className="bs-form-item">
                                    {getFieldDecorator('expand.expandMax', {
                                        initialValue: record.expand != null ? record.expand.expandMax : 5,
                                        rules: [{required: true, message: '请输入最大值!'}],
                                    })(
                                        <Input placeholder='请输入最大值'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
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
                        <FormItem wrapperCol={{span: 12, offset: 6}}>
                            <Button type="primary"
                                    loading={this.props.chargeAllLoading}
                                    onClick={this.props.chargeAll}>
                                应用到该联赛下的所有比赛
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueChargeForm);