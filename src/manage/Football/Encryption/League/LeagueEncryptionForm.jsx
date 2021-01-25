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
    Collapse, Progress, Switch, message, Radio
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


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

class LeagueEncryptionForm extends React.Component {
    state = {
    }

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <FormItem {...formItemLayout} label="开启加密" className="bs-form-item">
                        {getFieldDecorator('isEncryption', {
                            initialValue: record.isEncryption,
                            valuePropName: 'checked',
                            rules: [{required: true, message: '请选择是否开启!'}],
                        })(
                            <Switch/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="开启联赛加密" className="bs-form-item">
                        {getFieldDecorator('isLeagueEncryption', {
                            initialValue: record.isLeagueEncryption,
                            valuePropName: 'checked',
                            rules: [{required: true, message: '请选择是否开启!'}],
                        })(
                            <Switch/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码" className="bs-form-item">
                        {getFieldDecorator('password', {
                            initialValue: record.password,
                            rules: [{required: true, message: '请输入密码'}],
                        })(
                            <Input.Password visibilityToggle={false} placeholder='请输入密码'/>
                        )}
                    </FormItem>
                    <div className="center danger">设置密码后不允许查看，请记牢密码</div>
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
                                    loading={this.props.encryptionAllLoading}
                                    onClick={this.props.encryptionAll}>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueEncryptionForm);