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
import {upload} from "../../../../axios";
import imgcover from "../../../../static/imgcover.jpg";
import NP from 'number-precision'

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
const formItemLayout_small = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
    },
};

class LeagueBetForm extends React.Component {
    state = {
        grades: [],
        gradeAwardRadio: {}
    }

    componentDidMount() {
        const {form, record} = this.props;
        if (record.gradeInfo) {
            const grades = this.state.grades;
            const gradeAwardRadio = this.state.gradeAwardRadio;
            let index = 0;
            record.gradeInfo.forEach(item => {
                grades.push({
                    index: index,
                    price: item.price,
                    freeTime: item.freeTime,
                    award: item.award,
                    awardDeposit: item.awardDeposit
                })
                index = index + 1;
            });
            for (let i = 0; i < grades.length; i++) {
                if (grades[i] == null) {
                    continue;
                }
                gradeAwardRadio[i] = grades[i].award ? "gift" : "money"
            }
            this.setState({grades: grades, gradeAwardRadio: gradeAwardRadio})
        }
    }

    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploading: true, isupload: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({isupload: false});
            message.success("上传成功", 3);
        }
    }
    onPosterChange = (form, e) => {
        form.setFieldsValue({
            awardPic: e.target.value
        })
    }
    addGradeRule = () => {
        let grades = this.state.grades;
        grades.push({index: grades.length + 1});
        this.setState({grades: grades})
    }
    removeGradeRule = (i) => {
        let grades = this.state.grades;
        delete grades[i];
        this.setState({grades: grades})
    }
    getBetGradeForm = () => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        let dom = [];
        let grades = this.state.grades;
        dom.push(<Row className="w-full">
            <Col span={4} className="ant-form-item-label">
                <label className="ant-form-item-required">
                    档位
                </label>
            </Col>
            <Col span={16}>
                <Button type="dashed" onClick={this.addGradeRule}>
                    <Icon type="plus"/>添加档位规则</Button>
            </Col>
        </Row>)
        for (let i = 0; i < grades.length; i++) {
            if (grades[i] == null) {
                continue;
            }
            dom.push(<FormItem {...formItemLayout} label={`档位规则${i + 1}`} className="bs-form-item">
                <Row gutter={10}>
                    <Col span={0}>
                        <FormItem hidden className="bs-form-item">
                            {getFieldDecorator(`gradeInfo[${i}].grade`, {
                                rules: [{required: true, message: '请输入档位!'}],
                                initialValue: i,
                            })(
                                <InputNumber
                                    hidden
                                    formatter={value => `${value}档`}
                                    parser={value => value.replace('档', '')}
                                    className="w-full"
                                    placeholder='请输入档位!'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={9}>
                        <FormItem {...formItemLayout} label="价格：" className="bs-form-item">
                            {getFieldDecorator(`gradeInfo[${i}].price`, {
                                rules: [{required: true, message: '请输入价格!'}],
                                initialValue: grades[i].price ? NP.divide(grades[i].price, 100) : null,
                            })(
                                <Input
                                    addonAfter="元/茄币"
                                    className="w-full"
                                    placeholder='请输入价格!'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout_small} label="消耗免费次数：" className="bs-form-item">
                            {getFieldDecorator(`gradeInfo[${i}].freeTime`, {
                                rules: [{required: true, message: '请输入消耗免费次数!'}],
                                initialValue: grades[i].freeTime,
                            })(
                                <InputNumber
                                    formatter={value => `${value}次`}
                                    parser={value => value.replace('次', '')}
                                    className="w-full"
                                    placeholder='请输入消耗免费次数!'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={9}>
                        <div>
                            <Radio.Group onChange={this.onGradeAwardRadioChange.bind(this, i)}
                                         value={this.state.gradeAwardRadio[i]}>
                                <Radio value={"gift"}>送奖品</Radio>
                                <Radio value={"money"}>送茄币</Radio>
                            </Radio.Group>
                        </div>
                        {this.state.gradeAwardRadio[i] == "money" ?
                            <FormItem {...formItemLayout} label="茄币：" className="bs-form-item">
                                {getFieldDecorator(`gradeInfo[${i}].awardDeposit`, {
                                    rules: [{required: true, message: '请输入茄币!'}],
                                    initialValue: grades[i].awardDeposit ? NP.divide(grades[i].awardDeposit, 100) : null,
                                })(
                                    <Input
                                        addonAfter="元/茄币"
                                        className="w-full"
                                        placeholder='请输入茄币!'/>
                                )}
                            </FormItem> : <FormItem {...formItemLayout} label="奖品：" className="bs-form-item">
                                {getFieldDecorator(`gradeInfo[${i}].award`, {
                                    rules: [{required: true, message: '请输入奖品!'}],
                                    initialValue: grades[i].award,
                                })(
                                    <Input
                                        className="w-full"
                                        placeholder='请输入奖品!'/>
                                )}
                            </FormItem>}

                    </Col>
                    <Col span={6}>
                        <Button type="danger" size="small" shape="circle"
                                onClick={this.removeGradeRule.bind(this, i)}>
                            <Icon type="minus"/></Button>
                    </Col>
                </Row>
            </FormItem>)
        }
        return dom;
    }
    onGradeAwardRadioChange = (i, e) => {
        this.state.gradeAwardRadio[i] = e.target.value
        this.setState({
            gradeAwardRadio: this.state.gradeAwardRadio,
        });
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange

        return (
            visible ?
                <Form onSubmit={this.props.handleSubmit}>
                    <FormItem {...formItemLayout} label="开启" className="bs-form-item">
                        {getFieldDecorator('available', {
                            initialValue: record.available != null ? record.available : false,
                            valuePropName: 'checked',
                            rules: [{required: true, message: '请选择是否开始!'}],
                        })(
                            <Switch/>
                        )}
                    </FormItem>
                    <Tooltip placement="topLeft" trigger="click" title="以比赛开始时间为基准，负数为提前？分钟，正数为延后？分钟">
                        <FormItem {...formItemLayout} label="开始时间/分钟" className="bs-form-item">
                            {getFieldDecorator('startInterval', {
                                initialValue: record.startInterval ? record.startInterval : null,
                                rules: [{required: true, message: '请输入时间!'}],
                            })(
                                <InputNumber hidden placeholder='请输入时间!'/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <Tooltip placement="topLeft" trigger="click" title="以比赛结束时间为基准，负数为提前？分钟，正数为延后？分钟">
                        <FormItem {...formItemLayout} label="结束时间/分钟" className="bs-form-item">
                            {getFieldDecorator('endInterval', {
                                initialValue: record.endInterval ? record.endInterval : null,
                                rules: [{required: true, message: '请输入时间!'}],
                            })(
                                <InputNumber hidden placeholder='请输入时间!'/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <FormItem {...formItemLayout} label="领奖过期时间/天" className="bs-form-item">
                        {getFieldDecorator('settleExpireInterval', {
                            initialValue: record.settleExpireInterval ? record.settleExpireInterval / 24 / 60 : null,
                            rules: [{required: true, message: '请输入时间!'}],
                        })(
                            <InputNumber hidden placeholder='请输入时间!'/>
                        )}
                    </FormItem>
                    {this.getBetGradeForm()}
                    <FormItem {...formItemLayout} label="奖品描述" className="bs-form-item">
                        {getFieldDecorator('award', {
                            initialValue: record.award ? record.award : null,
                            rules: [{required: true, message: '请输入奖品描述!'}],
                        })(
                            <Input placeholder='请输入奖品描述!'/>
                        )}
                    </FormItem>
                    <div className="center w-full">
                        <span className="mb-n mt-m" style={{fontSize: 20}}>奖品图片</span>
                    </div>
                    <div className="center w-full">
                        <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                            {getFieldDecorator('awardPic', {
                                // initialValue: this.state.currentLeague?this.state.currentLeague.poster:null,
                                getValueFromEvent(e) {
                                    return form.getFieldValue('awardPic')
                                },
                                onChange(e) {
                                    const file = e.file;
                                    if (file.response) {
                                        form.setFieldsValue({
                                            awardPic: file.response.data
                                        })
                                    }
                                    handleAvatarChange(e);
                                }
                            })(
                                <Upload
                                    accept="image/*"
                                    action={upload}
                                    listType="picture-card"
                                    withCredentials={true}
                                    showUploadList={false}
                                    disabled={this.state.uploading}
                                    onChange={this.handleAvatarChange}
                                >
                                    {
                                        <img
                                            src={form.getFieldValue('awardPic') ? form.getFieldValue('awardPic') :
                                                (record.awardPic ? record.awardPic : imgcover)}
                                            alt="poster"
                                            className="form-match-poster-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                    </div>
                    <div className="center mt-m">
                        <Input style={{minWidth: 300, textAlign: "center"}} placeholder='图片地址'
                               onChange={this.onPosterChange.bind(this, form)}
                               value={form.getFieldValue('awardPic') ? form.getFieldValue('awardPic') : record.awardPic}/>
                    </div>
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
                                    loading={this.props.betAllLoading}
                                    onClick={this.props.betAll}>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueBetForm);