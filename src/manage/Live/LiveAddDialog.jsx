import React from 'react';
import {
    Form,
    Input,
    DatePicker,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

moment.locale('zh-cn');

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    },
};

class LiveAddDialog extends React.Component {
    state = {}

    componentDidMount() {
        //receiveData({record: this.props.record}, 'responsive');
    }

    render() {
        const {visible, form} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入名字'}],
                            })(
                                <Input placeholder='请输入名字' style={{maxWidth: 300}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="开始时间" className="bs-form-item">
                            {getFieldDecorator('startTime', {
                                rules: [{required: true, message: '请选择时间!'}],
                                onChange(e) {
                                    form.setFieldsValue({
                                        startTime: e ? e.format('YYYY/MM/DD HH:mm:ss') : null,
                                    })
                                }
                            })(
                                <DatePicker showTime
                                            format={'YYYY/MM/DD HH:mm:ss'}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="结束时间" className="bs-form-item">
                            {getFieldDecorator('endTime', {
                                rules: [{required: true, message: '请选择时间!'}],
                                onChange(e) {
                                    form.setFieldsValue({
                                        endTime: e ? e.format('YYYY/MM/DD HH:mm:ss') : null,
                                    })
                                }
                            })(
                                <DatePicker showTime
                                            format={'YYYY/MM/DD HH:mm:ss'}/>
                            )}
                        </FormItem>
                    </Form>
                </div>
                :
                <div/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveAddDialog);