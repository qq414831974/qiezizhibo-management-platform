import React from 'react';
import {
    Form,
    Input,
    Icon,
    TreeSelect, Tooltip, Select,
} from 'antd';
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getPermissionList} from "../../axios";
import {message} from "antd/lib/index";
import {distinctById} from "../../utils"

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

class PermissionModifyDialog extends React.Component {
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
                            initialValue: record.name,
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="url" className="bs-form-item">
                        {getFieldDecorator('url', {
                            rules: [{required: true, message: '请输入url!'}],
                            initialValue: record.url,
                        })(
                            <Input placeholder='请输入url!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序" className="bs-form-item">
                        {getFieldDecorator('sortIndex', {
                            initialValue: record.sortIndex,
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden={true}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PermissionModifyDialog);