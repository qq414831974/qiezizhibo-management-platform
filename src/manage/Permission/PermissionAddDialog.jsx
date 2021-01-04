import React from 'react';
import {
    Form,
    Input,
    Icon,
    TreeSelect, Select, Tooltip,
} from 'antd';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getPermissionList} from "../../axios";
import {message} from "antd/lib/index";
import moment from "moment";


const Option = Select.Option;

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

class PermissionAddDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="url" className="bs-form-item">
                        {getFieldDecorator('url', {
                            rules: [{required: true, message: '请输入url!'}],
                        })(
                            <Input placeholder='请输入url!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序" className="bs-form-item">
                        {getFieldDecorator('sortIndex', {})(
                            <Input placeholder='请输入排序!'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PermissionAddDialog);