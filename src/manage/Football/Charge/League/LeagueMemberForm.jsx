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
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <Card hoverable title="联赛会员">
                        <FormItem {...formItemLayout} label="是否开启" className="bs-form-item">
                            {getFieldDecorator('available', {
                                initialValue: record.available != null ? record.available : false,
                                valuePropName: 'checked',
                                rules: [{required: true, message: '请选择是否开启!'}],
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