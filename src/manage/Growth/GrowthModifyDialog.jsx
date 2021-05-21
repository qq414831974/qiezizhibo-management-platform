import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    InputNumber,
    Icon,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../axios";
import logo from '../../static/logo.png';
import {message} from "antd/lib/index";


const Option = Select.Option;
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

class GrowthAddDialog extends React.Component {
    state = {}

    componentDidMount() {
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="充值类型" className="bs-form-item">
                        {getFieldDecorator('chargeType', {
                            initialValue: record.chargeType,
                            rules: [{required: true, message: '请选择充值类型!'}],
                        })(
                            <Select placeholder="请选择充值类型!">
                                <Option value={1}>购买直播</Option>
                                <Option value={2}>购买录播</Option>
                                <Option value={3}>比赛买断</Option>
                                <Option value={7}>联赛会员</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="增长类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type,
                            rules: [{required: true, message: '请选择增长类型!'}],
                        })(
                            <Select placeholder="请选择增长类型!">
                                <Option value={1}>用户经验</Option>
                                {/*<Option value={2}>球队热度</Option>*/}
                                {/*<Option value={3}>球员热度</Option>*/}
                            </Select>
                        )}
                    </FormItem>
                    <Tooltip title="每消费一元增长的数值">
                        <FormItem {...formItemLayout} label="增长/（元）" className="bs-form-item">
                            {getFieldDecorator('growth', {
                                initialValue: record.growth,
                                rules: [{required: true, message: '请输入数值!'}],
                            })(
                                <InputNumber placeholder='请输入数值!'/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden/>
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

export default connect(mapStateToProps, mapDispatchToProps)(GrowthAddDialog);