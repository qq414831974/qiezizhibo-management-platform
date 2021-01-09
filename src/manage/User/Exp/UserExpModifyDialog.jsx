import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    Icon,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message} from "antd/lib/index";


const Option = Select.Option;
moment.locale('zh-cn');

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 5},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
    },
};

class UserExpModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;

        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="经验增加" className="bs-form-item">
                        {getFieldDecorator('exp', {
                            initialValue: 0,
                            rules: [{required: true, message: '请输入经验增加!'}],
                        })(
                            <Input placeholder='请输入经验增加!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="充值金额增加" className="bs-form-item">
                        {getFieldDecorator('coinCount', {
                            initialValue: 0,
                            rules: [{required: true, message: '充值金额增加!'}],
                        })(
                            <Input placeholder='充值金额增加!'/>
                        )}
                    </FormItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserExpModifyDialog);