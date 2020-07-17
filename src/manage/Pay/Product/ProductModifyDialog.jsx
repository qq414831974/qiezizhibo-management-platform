import React from 'react';
import {
    Form,
    Input,
    Icon,
    TreeSelect, Select, Tooltip,
} from 'antd';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
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

class ProductModifyDialog extends React.Component {
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
                            initialValue: record.name,
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="价格（分）" className="bs-form-item">
                        {getFieldDecorator('price', {
                            initialValue: record.price,
                            rules: [{required: true, message: '请输入价格!'}],
                        })(
                            <Input placeholder='请输入价格!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="第二价格（分）" className="bs-form-item">
                        {getFieldDecorator('secondPrice', {
                            initialValue: record.secondPrice,
                            rules: [{required: true, message: '请输入价格!'}],
                        })(
                            <Input placeholder='请输入价格!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type,
                            rules: [{required: true, message: '请选择类型!'}],
                        })(
                            <Select placeholder="请选择类型!">
                                <Option value={0}>普通商品</Option>
                                <Option value={1}>比赛</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述" className="bs-form-item">
                        {getFieldDecorator('description', {
                            initialValue: record.description,
                        })(
                            <Input placeholder='请输入描述!'/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductModifyDialog);