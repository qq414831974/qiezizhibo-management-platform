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

class LeagueUnitSettingForm extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <FormItem {...formItemLayout} label="开启报名" className="bs-form-item">
                        {getFieldDecorator('registrationAvailable', {
                            initialValue: record.registrationAvailable == null ? false : record.registrationAvailable,
                            valuePropName: 'checked',
                            rules: [{required: true, message: '请选择是否开启!'}],
                        })(
                            <Switch/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="开启组委会比赛管理" className="bs-form-item">
                        {getFieldDecorator('matchManagementAvailable', {
                            initialValue: record.matchManagementAvailable == null ? false : record.matchManagementAvailable,
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueUnitSettingForm);