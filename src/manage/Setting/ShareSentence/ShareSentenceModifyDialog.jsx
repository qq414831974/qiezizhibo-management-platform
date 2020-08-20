import React from 'react';
import {
    Form,
    InputNumber,
    Input,
    Icon, Select,
} from 'antd';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message} from "antd/lib/index";


const FormItem = Form.Item;
const Option = Select.Option;

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

class ShareSentenceModifyDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            rules: [{required: true, message: '请选择类型!'}],
                            initialValue: record.type,
                        })(
                            <Select>
                                <Option value={1}>比赛</Option>
                                <Option value={2}>联赛</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="语句" className="bs-form-item">
                        {getFieldDecorator('sentence', {
                            rules: [{required: true, message: '请输入语句!'}],
                            initialValue: record.sentence,
                        })(
                            <Input placeholder='请输入语句!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="权重" className="bs-form-item">
                        {getFieldDecorator('weight', {
                            initialValue: record.weight,
                        })(
                            <InputNumber placeholder='请输入权重!'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShareSentenceModifyDialog);