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
    Collapse, Progress, Switch, message, Modal, DatePicker
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {upload} from "../../../../axios";
import imgcover from "../../../../static/imgcover.jpg";
import {connect} from "react-redux";

moment.locale('zh-cn');

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

class MatchHeatRoundInfo extends React.Component {
    state = {
        growth: [],
        discount: [],
        numberSelectValue: 1,
        percentMapValue: {},
        type: 2
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
        this.setRoundInfoFieldValue("awardPic", e.target.value);
    }
    getPosterSelector = () => {
        const {form} = this.props;
        if (!form.getFieldValue('cashAvailable')) {
            return null;
        }
        return <Select style={{width: 140}} placeholder="选择默认规则图片">
            <Option key={`opt-all`}
                    value="https://qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/images/cash_rule/all.jpg"
                    onClick={() => {
                        this.setRoundInfoFieldValue("awardPic", "https://qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/images/cash_rule/all.jpg");
                    }}>
                全提现版本
            </Option>
            <Option key={`opt-ten`}
                    value="https://qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/images/cash_rule/ten.jpg"
                    onClick={() => {
                        this.setRoundInfoFieldValue("awardPic", "https://qiezizhibo-1300664818.cos.ap-shanghai.myqcloud.com/images/cash_rule/ten.jpg");
                    }}>
                前十名提现版本
            </Option>
        </Select>
    }
    getRoundInfoItem = (name, defaultValue = null) => {
        const {record, round} = this.props;
        if (record && record.roundInfos) {
            const roundInfo = record.roundInfos[round];
            if (roundInfo) {
                if (name == "startTime" || name == "endTime") {
                    return roundInfo[name] ? moment(roundInfo[name]) : defaultValue;
                } else {
                    return roundInfo[name] ? roundInfo[name] : defaultValue;
                }
            }
        } else {
            return defaultValue;
        }
    }
    getRoundInfoFieldValue = (name, defaultValue = null) => {
        const {form, round} = this.props;
        const value = form.getFieldValue(`roundInfos[${round}].${name}`);
        return value ? value : defaultValue;
    }
    setRoundInfoFieldValue = (name, value) => {
        const {form, round} = this.props;
        form.setFieldsValue({
            [`roundInfos[${round}].${name}`]: value
        })
    }

    render() {
        const {form, record, round} = this.props;
        const {getFieldDecorator} = form;
        const handleAvatarChange = this.handleAvatarChange
        const getRoundInfoFieldValue = this.getRoundInfoFieldValue
        const setRoundInfoFieldValue = this.setRoundInfoFieldValue
        const getRoundInfoItem = this.getRoundInfoItem

        return <div>
            <FormItem {...formItemLayout} label="开始时间/分钟" className="bs-form-item">
                {getFieldDecorator(`roundInfos[${round}].startTime`, {
                    initialValue: getRoundInfoItem("startTime"),
                    rules: [{required: true, message: '请输入时间!'}],
                })(
                    <DatePicker showTime
                                format={'YYYY-MM-DD HH:mm:ss'}/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="结束时间/分钟" className="bs-form-item">
                {getFieldDecorator(`roundInfos[${round}].endTime`, {
                    initialValue: getRoundInfoItem("endTime"),
                    rules: [{required: true, message: '请输入时间!'}],
                })(
                    <DatePicker showTime
                                format={'YYYY-MM-DD HH:mm:ss'}/>
                )}
            </FormItem>
            <div className="center w-full">
                <span className="mb-n mt-m" style={{fontSize: 20}}>奖品/规则图片</span>
            </div>
            <div className="center w-full">
                <FormItem {...formItemLayout} className="bs-form-item form-page">
                    {getFieldDecorator(`roundInfos[${round}].awardPic`, {
                        initialValue: getRoundInfoItem("awardPic"),
                        getValueFromEvent(e) {
                            return getRoundInfoFieldValue('awardPic');
                        },
                        onChange(e) {
                            const file = e.file;
                            if (file.response) {
                                setRoundInfoFieldValue("awardPic", file.response.data);
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
                                    src={getRoundInfoFieldValue('awardPic', getRoundInfoItem("awardPic", imgcover))}
                                    alt="poster"
                                    className="form-page-img"/>
                            }

                        </Upload>
                    )}
                </FormItem>
            </div>
            <div className="center mt-m">
                <Input
                    addonBefore={this.getPosterSelector()}
                    style={{minWidth: 300, textAlign: "center"}}
                    placeholder='图片地址'
                    onChange={this.onPosterChange.bind(this, form)}
                    value={getRoundInfoFieldValue('awardPic', getRoundInfoItem("awardPic"))}/>
            </div>
        </div>
    }
}

export default MatchHeatRoundInfo;