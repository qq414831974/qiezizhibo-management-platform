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
    Collapse
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../../axios";
import logo from '../../../static/logo.png';
import {message} from "antd/lib/index";


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

class GiftAddDialog extends React.Component {
    state = {
        growth: [],
        discount: []
    }

    componentDidMount() {
    }

    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                loading: false,
            }));
        }
    }
    addGrowthRule = () => {
        let growths = this.state.growth;
        growths.push({index: growths.length + 1});
        this.setState({growth: growths})
    }
    removeGrowthRule = (i) => {
        let growths = this.state.growth;
        delete growths[i];
        this.setState({growth: growths})
    }
    getGrowthForm = () => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        let dom = [];
        let growths = this.state.growth;
        dom.push(<div className="w-full center">
            <Button type="dashed" onClick={this.addGrowthRule}>
                <Icon type="plus"/>添加成长规则</Button>
        </div>)
        for (let i = 0; i < growths.length; i++) {
            if (growths[i] == null) {
                continue;
            }
            dom.push(<FormItem {...formItemLayout} label={`成长规则${i + 1}`} className="bs-form-item">
                <Row gutter={10}>
                    <Col span={8}>
                        <FormItem className="bs-form-item">
                            {getFieldDecorator(`growth[${i}].type`, {
                                rules: [{required: true, message: '请选择类型!'}],
                            })(
                                <Select placeholder="请选择类型!">
                                    <Option value={1}>用户经验</Option>
                                    <Option value={2}>球队热度</Option>
                                    <Option value={3}>球员热度</Option>
                                    <Option value={4}>免费竞猜</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem className="bs-form-item">
                            {getFieldDecorator(`growth[${i}].growth`, {
                                rules: [{required: true, message: '请输入成长值!'}],
                            })(
                                <InputNumber className="w-full"
                                             placeholder='请输入成长值!'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <Button type="danger" size="small" shape="circle" onClick={this.removeGrowthRule.bind(this, i)}>
                            <Icon type="minus"/></Button>
                    </Col>
                </Row>
            </FormItem>)
        }
        return dom;
    }
    addDiscountRule = () => {
        let discounts = this.state.discount;
        discounts.push({index: discounts.length + 1});
        this.setState({discount: discounts})
    }
    removeDiscountRule = (i) => {
        let discounts = this.state.discount;
        delete discounts[i];
        this.setState({discount: discounts})
    }
    getDiscountForm = () => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        let dom = [];
        let discounts = this.state.discount;
        dom.push(<div className="w-full center">
            <Button type="dashed" onClick={this.addDiscountRule}>
                <Icon type="plus"/>添加折扣规则</Button>
        </div>)
        for (let i = 0; i < discounts.length; i++) {
            if (discounts[i] == null) {
                continue;
            }
            dom.push(<FormItem {...formItemLayout} label={`折扣规则${i + 1}`} className="bs-form-item">
                <Row gutter={10}>
                    <Col span={8}>
                        <FormItem className="bs-form-item">
                            {getFieldDecorator(`discountInfo[${i}].num`, {
                                rules: [{required: true, message: '请输入数量!'}],
                            })(
                                <InputNumber
                                    formatter={value => `${value}个`}
                                    parser={value => value.replace('个', '')}
                                    className="w-full"
                                    placeholder='请输入数量!'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem className="bs-form-item">
                            {getFieldDecorator(`discountInfo[${i}].discount`, {
                                rules: [{required: true, message: '请输入折扣值!'}],
                            })(
                                <InputNumber
                                    formatter={value => `${value}折`}
                                    parser={value => value.replace('折', '')}
                                    className="w-full"
                                    placeholder='请输入折扣值!'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <Button type="danger" size="small" shape="circle"
                                onClick={this.removeDiscountRule.bind(this, i)}>
                            <Icon type="minus"/></Button>
                    </Col>
                </Row>
            </FormItem>)
        }
        return dom;
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                        {getFieldDecorator('pic', {
                            getValueFromEvent(e) {
                                return form.getFieldValue('pic')
                            },
                            onChange(e) {
                                const file = e.file;
                                if (file.response) {
                                    form.setFieldsValue({
                                        pic: file.response.data
                                    })
                                }
                            }
                        })(
                            <Upload
                                accept="image/*"
                                action={uploadimg}
                                listType="picture-card"
                                withCredentials={true}
                                showUploadList={false}
                                onChange={this.handleAvatarChange}
                            >
                                {
                                    <img
                                        src={form.getFieldValue('pic') ? form.getFieldValue('pic') : logo}
                                        alt="avatar"
                                        className="round-img"/>
                                }

                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否启用" className="bs-form-item">
                        {getFieldDecorator('available', {
                            initialValue: true,
                            rules: [{required: true, message: '请选择!'}],
                        })(
                            <Select placeholder="请选择!">
                                <Option value={true}>启用</Option>
                                <Option value={false}>禁用</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名字!'}],
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: 1,
                            rules: [{required: true, message: '请选择类型!'}],
                        })(
                            <Select placeholder="请选择充值类型!">
                                <Option value={0}>免费</Option>
                                <Option value={1}>收费</Option>
                            </Select>
                        )}
                    </FormItem>
                    {form.getFieldValue("type") == 0 ?
                        <FormItem {...formItemLayout} label="上限" className="bs-form-item">
                            {getFieldDecorator('limited', {
                                rules: [{required: true, message: '请输入上限!'}],
                            })(
                                <InputNumber placeholder='请输入上限!'/>
                            )}
                        </FormItem> : <FormItem {...formItemLayout} hidden className="bs-form-item">
                            {getFieldDecorator('limited', {
                                initialValue: 0,
                                rules: [{required: true, message: '请输入上限!'}],
                            })(
                                <InputNumber hidden placeholder='请输入上限!'/>
                            )}
                        </FormItem>}
                    {form.getFieldValue("type") == 0 ?
                        <FormItem {...formItemLayout} hidden className="bs-form-item">
                            {getFieldDecorator('price', {
                                initialValue: 0,
                                rules: [{required: true, message: '请输入价格!'}],
                            })(
                                <InputNumber hidden/>
                            )}
                        </FormItem> : <FormItem {...formItemLayout} label="价格/元" className="bs-form-item">
                            {getFieldDecorator('price', {
                                rules: [{required: true, message: '请输入价格!'}],
                            })(
                                <InputNumber formatter={value => `${value}元`}
                                             parser={value => value.replace('元', '')}
                                             placeholder='请输入价格!'/>
                            )}
                        </FormItem>}
                    <FormItem {...formItemLayout} label={<Tooltip title="从小到大">排序</Tooltip>} className="bs-form-item">
                        {getFieldDecorator('sortIndex', {
                            // rules: [{required: true, message: '请输入描述!'}],
                        })(
                            <Input placeholder='请输入排序!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述" className="bs-form-item">
                        {getFieldDecorator('description', {
                            // rules: [{required: true, message: '请输入描述!'}],
                        })(
                            <Input placeholder='请输入描述!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述2" className="bs-form-item">
                        {getFieldDecorator('description2', {
                            // rules: [{required: true, message: '请输入描述!'}],
                        })(
                            <Input placeholder='请输入描述!'/>
                        )}
                    </FormItem>
                    <Collapse defaultActiveKey={['1', '2']}>
                        <Panel header="成长规则" key="1">
                            {this.getGrowthForm()}
                        </Panel>
                        {form.getFieldValue("type") == 1 ? <Panel header="折扣规则" key="2">
                            {this.getDiscountForm()}
                        </Panel> : null}
                    </Collapse>
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

export default connect(mapStateToProps, mapDispatchToProps)(GiftAddDialog);