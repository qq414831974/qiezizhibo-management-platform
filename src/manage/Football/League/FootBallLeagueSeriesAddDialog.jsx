import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    Col,
    Upload,
    Radio,
    Select,
    Progress,
    Checkbox,
    Avatar,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../../axios/index";
import avatar from '../../../static/avatar.jpg';
import {toChinesNum} from '../../../utils/index';
import {upload} from "../../../axios";
import imgcover from '../../../static/imgcover.jpg';
import defultAvatar from '../../../static/avatar.jpg';

moment.locale('zh-cn');

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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

class FootBallLeagueSeriesAddDialog extends React.Component {
    state = {}

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

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handlePosterChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({posterloading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, posterUrl => this.setState({
                posterUrl,
                posterloading: false,
            }));
            setTimeout(() => {
                this.setState({isposterupload: false});
            }, 2000)
        }
    }
    onPosterChange = (form, e) => {
        form.setFieldsValue({
            poster: e.target.value
        })
    }
    // getNormalRound = (num) => {
    //     let value = [];
    //     for (let i = 1; i <= num; i++) {
    //         value.push(`第${toChinesNum(i)}轮`);
    //     }
    //     return value.toString();
    // }
    // getTaoTaiRound = (num) => {
    //     let value = [];
    //     for (let i = 1; i <= num; i++) {
    //         value.push(`淘汰赛第${toChinesNum(i)}轮`);
    //     }
    //     return value.toString();
    // }
    getRoundDom = () => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const selectChildren = [];
        selectChildren.push(<Option key={'open'} value={'open'}>开幕式</Option>);
        selectChildren.push(<Option key={'close'} value={'close'}>闭幕式</Option>);
        for (let i = 1; i <= 20; i++) {
            selectChildren.push(<Option key={`z${i}`} value={`z-${i}`}>正常轮次共{i}轮</Option>);
        }
        for (let i = 1; i <= 20; i++) {
            selectChildren.push(<Option key={`x${i}`} value={`x-${i}`}>小组赛共{i}轮</Option>);
        }
        for (let i = 1; i <= 20; i++) {
            selectChildren.push(<Option key={`t${i}`} value={`t-${i}`}>淘汰赛共{i}轮</Option>);
        }
        return <FormItem {...formItemLayout} key='round' label='轮次'
                         className="bs-form-item">
            {getFieldDecorator('round.rounds', {
                rules: [{required: true, message: '请选择轮次'}],
            })(
                <Select
                    mode="tags"
                    style={{width: '100%'}}
                    tokenSeparators={[',', '，']}
                >
                    {selectChildren}
                </Select>
            )}
        </FormItem>
    }

    render() {
        const {visible, form, leagueData} = this.props;

        const isMobile = this.props.responsive.data.isMobile;
        const handlePosterChange = this.handlePosterChange;

        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
                        <div className="w-full center">
                            <div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                <span>系列赛：</span>
                                <Avatar src={leagueData.headimg ? leagueData.headimg : defultAvatar}/>
                                <span className="ml-s">{leagueData.name}{leagueData.englishname ? "(" + leagueData.englishname + ")" : ""}</span>
                            </div>
                        </div>
                        <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                            {getFieldDecorator('headimg', {
                                // initialValue: logo,
                                getValueFromEvent(e) {
                                    return form.getFieldValue('headimg')
                                },
                                onChange(e) {
                                    const file = e.file;
                                    if (file.response) {
                                        form.setFieldsValue({
                                            headimg: file.response
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
                                            src={form.getFieldValue('headimg') ? form.getFieldValue('headimg') : avatar}
                                            alt="avatar"
                                            className="round-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                            {getFieldDecorator('type', {
                                rules: [{required: true, message: '请选择类型'}],
                                initialValue: 1
                            })(
                                <RadioGroup>
                                    <Radio value={1}>杯赛</Radio>
                                    <Radio value={2}>联赛</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} hidden={true} label="地区类型" className="bs-form-item">
                            {getFieldDecorator('areatype', {
                                rules: [{required: true, message: '请选择类型'}],
                                initialValue: 2
                            })(
                                <RadioGroup hidden={true}>
                                    <Radio value={0}>默认</Radio>
                                    <Radio value={1}>全国</Radio>
                                    <Radio value={2}>全国青少年</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入名字'}],
                                // onChange(e) {
                                //     form.setFieldsValue({
                                //         shortname: e.target.value
                                //     })
                                // }
                            })(
                                <Input placeholder='请输入名字'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="简称" className="bs-form-item">
                            {getFieldDecorator('shortname', {})(
                                <Input placeholder='请输入简称'/>
                            )}
                        </FormItem>
                        {this.state.isSeries ? null :
                            <FormItem {...formItemLayout} label="组别" className="bs-form-item">
                                {getFieldDecorator('subgroup.groups', {
                                    rules: [{required: true, message: '请选择组别'}],
                                    initialValue: ["default"],
                                    getValueFromEvent: (e) => {
                                        if (e.indexOf("default") > -1) {
                                            return ["default"]
                                        }
                                        return e;
                                    }
                                })(
                                    <Select
                                        mode="tags"
                                        style={{width: '100%'}}
                                        tokenSeparators={[',', '，']}
                                    >
                                        <Option key={`default`} value={`default`}>无分组</Option>
                                    </Select>
                                )}
                            </FormItem>
                        }
                        {this.state.isSeries ? null : this.getRoundDom()}
                        <FormItem {...formItemLayout} label="英文名" className="bs-form-item">
                            {getFieldDecorator('englishname', {
                                // initialValue: record.englishname,
                            })(
                                <Input placeholder='请输入英文名'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="主办方" className="bs-form-item">
                            {getFieldDecorator('majorsponsor', {})(
                                <Input placeholder='请输入主办方'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="赞助商" className="bs-form-item">
                            {getFieldDecorator('sponsor', {})(
                                <Input placeholder='请输入赞助商'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="国家" className="bs-form-item">
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('country', {
                                        initialValue: "中国",
                                    })(
                                        <Input placeholder='请输入国家'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={1}>
                                <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                                </span>
                            </Col>
                            <Col span={12}>
                                <FormItem>
                                    {getFieldDecorator('city', {
                                        // initialValue: record.city,
                                        rules: [{required: true, message: '请选择'}],
                                    })(
                                        <Input placeholder='请输入城市'/>
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        {this.state.isSeries ? null : <FormItem {...formItemLayout} label="时间" className="bs-form-item">
                            <div className="inline">
                                <div className="inline-block">
                                    {isMobile ? <span>开始：</span> : null}
                                    <FormItem>
                                        {getFieldDecorator('datebegin', {
                                            rules: [{required: true, message: '请选择开始时间!'}],
                                        })(
                                            <DatePicker showTime
                                                        format={'YYYY-MM-DD HH:mm'}/>
                                        )}
                                    </FormItem>
                                </div>
                                {isMobile ? null : <span>-</span>}
                                <div className="inline-block">
                                    {isMobile ? <span>结束：</span> : null}
                                    <FormItem>
                                        {getFieldDecorator('dateend', {
                                            rules: [{required: true, message: '请选择结束时间!'}],
                                        })(
                                            <DatePicker showTime
                                                        format={'YYYY-MM-DD HH:mm'}/>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                        </FormItem>
                        }
                        <FormItem {...formItemLayout} label="联系电话" className="bs-form-item">
                            {getFieldDecorator('phonenumber', {})(
                                <Input placeholder='请输入联系电话'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="备注" className="bs-form-item">
                            {getFieldDecorator('remark', {})(
                                <Input.TextArea placeholder='备注'/>
                            )}
                        </FormItem>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>预览封面</span>
                        </div>
                        <div className="center w-full">
                            <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                                {getFieldDecorator('poster', {
                                    initialValue: this.state.leaguedata ? this.state.leaguedata.poster : null,
                                    getValueFromEvent(e) {
                                        return form.getFieldValue('poster')
                                    },
                                    onChange(e) {
                                        const file = e.file;
                                        if (file.response) {
                                            form.setFieldsValue({
                                                poster: file.response
                                            })
                                        }
                                        handlePosterChange(e);
                                    }
                                })(
                                    <Upload
                                        accept="image/*"
                                        action={upload}
                                        listType="picture-card"
                                        withCredentials={true}
                                        showUploadList={false}
                                        disabled={this.state.posterloading}
                                        onChange={this.handlePosterChange}
                                    >
                                        {
                                            <img
                                                src={form.getFieldValue('poster') ? form.getFieldValue('poster') : imgcover}
                                                alt="poster"
                                                className="form-match-poster-img"/>
                                        }

                                    </Upload>
                                )}
                            </FormItem>
                        </div>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('parentid', {
                                initialValue: leagueData.id,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <div className="center mt-m">
                            <Input style={{minWidth: 300, textAlign: "center"}} placeholder='封面地址'
                                   onChange={this.onPosterChange.bind(this, form)}
                                   value={form.getFieldValue('poster')}/>
                        </div>
                        {this.state.isposterupload ? <div className="center w-full">
                            <Progress style={{width: 160}} percent={this.state.posterloading ? 0 : 100}/>
                        </div> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueSeriesAddDialog);