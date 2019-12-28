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
    Tooltip,
    InputNumber,
    message,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {uploadimg} from "../../../axios/index";

import defultAvatar from '../../../static/avatar.jpg';
import {toChinesNum} from "../../../utils";
import {getAreasList, upload} from "../../../axios";
import imgcover from '../../../static/imgcover.jpg';

moment.locale('zh-cn');

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

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

class FootBallLeagueMatchModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
        this.setState({loading: true});
        getAreasList().then((data) => {
            if (data) {
                this.setState({
                    loading: false,
                    areas: data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.msg : data), 3);
            }
        });
    }

    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                loading: false,
            }));
        }
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

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
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
        const {form, record} = this.props;
        const {getFieldDecorator} = form;
        const selectChildren = [];
        const openclose = [];
        const normalRound = [];
        const groupRound = [];
        const knockRound = [];
        const finalRound = [];
        openclose.push(<Option key={'open'} value={'open'}>开幕式</Option>);
        openclose.push(<Option key={'close'} value={'close'}>闭幕式</Option>);
        for (let i = 1; i <= 20; i++) {
            normalRound.push(<Option key={`z-${i}`} value={`z-${i}`}>正常轮次共{i}轮</Option>);
        }
        for (let i = 1; i <= 20; i++) {
            groupRound.push(<Option key={`x-${i}`} value={`x-${i}`}>小组赛共{i}轮</Option>);
        }
        for (let i = 1; i <= 20; i++) {
            knockRound.push(<Option key={`t-${i}`} value={`t-${i}`}>淘汰赛共{i}轮</Option>);
        }
        for (let i = 1; i <= 10; i++) {
            finalRound.push(<Option key={`t-${i}`} value={`j-${i}`}>
                <Tooltip title={this.getJueSaiRank(i)}
                         placement="right">决赛共{i * 2}个名次
                </Tooltip>
            </Option>);
        }
        selectChildren.push(<OptGroup label="开、闭幕">{openclose}</OptGroup>);
        selectChildren.push(<OptGroup label="正常轮">{normalRound}</OptGroup>);
        selectChildren.push(<OptGroup label="小组赛">{groupRound}</OptGroup>);
        selectChildren.push(<OptGroup label="淘汰赛">{knockRound}</OptGroup>);
        selectChildren.push(<OptGroup label="决赛">{finalRound}</OptGroup>);

        return <FormItem {...formItemLayout} key='round' label='轮次'
                         className="bs-form-item">
            {getFieldDecorator('round.rounds', {
                initialValue: record.round ? record.round.rounds : [],
                rules: [{required: true, message: '请选择轮次'}],
            })(
                <Select
                    placeholder="请选择轮次"
                    mode="tags"
                    style={{width: '100%'}}
                    tokenSeparators={[',', '，']}
                >
                    {selectChildren}
                </Select>
            )}
        </FormItem>
    }
    getJueSaiRank = (num) => {
        let rank = "包含："
        for (let i = 1; i <= num; i++) {
            if (i == 1) {
                rank = rank + "决赛";
            } else {
                rank = rank + `${toChinesNum(i * 2 - 1)}、${toChinesNum(i * 2)}名决赛`;
            }
            if (i < num) {
                rank = rank + "，";
            }
        }
        return rank;
    }
    getAreasOption = () => {
        let dom = [];
        this.state.areas.forEach((item) => {
            dom.push(<Option value={item.province} data={item.province}
                             key={`area-${item.id}`}>{item.province}</Option>);
        })
        return dom;
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const isMobile = this.props.responsive.data.isMobile;
        const handlePosterChange = this.handlePosterChange;
        const isSeries = this.state.isSeries != null ? this.state.isSeries : (record && record.isparent);
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                            {getFieldDecorator('headimg', {
                                initialValue: record.headimg,
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
                                            src={form.getFieldValue('headimg') ? form.getFieldValue('headimg') :
                                                (record.headimg ? record.headimg : defultAvatar)}
                                            alt="avatar"
                                            className="round-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="系列赛" className="bs-form-item">
                            {getFieldDecorator('isparent', {
                                initialValue: record.isparent,
                                valuePropName: 'checked',
                                onChange: (e) => {
                                    this.setState({isSeries: e.target.checked})
                                }
                            })(
                                <Checkbox/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                            {getFieldDecorator('type', {
                                rules: [{required: true, message: '请选择类型'}],
                                initialValue: record.type
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
                                initialValue: record.name,
                                rules: [{required: true, message: '请输入名字'}],
                            })(
                                <Input placeholder='请输入名字'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="简称" className="bs-form-item">
                            {getFieldDecorator('shortname', {
                                initialValue: record.shortname,
                            })(
                                <Input placeholder='请输入简称'/>
                            )}
                        </FormItem>
                        {isSeries ? null : <FormItem {...formItemLayout} label='场地'
                                                     className="bs-form-item">
                            {getFieldDecorator('place', {
                                initialValue: record.place ? record.place : [],
                            })(
                                <Select
                                    placeholder="请选择比赛场地"
                                    mode="tags"
                                    style={{width: '100%'}}
                                    tokenSeparators={[',', '，']}
                                >
                                </Select>
                            )}
                        </FormItem>}
                        {isSeries ? null : <FormItem {...formItemLayout} label="组别" className="bs-form-item">
                            {getFieldDecorator('subgroup.groups', {
                                rules: [{required: true, message: '请选择组别'}],
                                initialValue: record.subgroup ? record.subgroup.groups : [],
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
                        </FormItem>}
                        {isSeries ? null : this.getRoundDom(record)}
                        <FormItem {...formItemLayout} label="几人制" className="bs-form-item">
                            {getFieldDecorator('regulations.population', {
                                initialValue: record.regulations ? record.regulations.population : null,
                                getValueFromEvent(e) {
                                    if (e == null) {
                                        return null
                                    }
                                    if (typeof (e) === 'string') {
                                        return e.replace(/[^\d]/g, '')
                                    }
                                    return e
                                },
                            })(
                                <InputNumber placeholder='请输入'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="英文名" className="bs-form-item">
                            {getFieldDecorator('englishname', {
                                initialValue: record.englishname,
                            })(
                                <Input placeholder='请输入英文名'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="主办方" className="bs-form-item">
                            {getFieldDecorator('majorsponsor', {
                                initialValue: record.majorsponsor,
                            })(
                                <Input placeholder='请输入主办方'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="赞助商" className="bs-form-item">
                            {getFieldDecorator('sponsor', {
                                initialValue: record.sponsor,
                            })(
                                <Input placeholder='请输入赞助商'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="地区" className="bs-form-item">
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('province', {
                                        initialValue: record.province,
                                        rules: [{required: true, message: '请选择省份'}],
                                    })(
                                        <Select disabled={this.state.loading}>
                                            {this.state.areas ? this.getAreasOption() : null}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={1}>
                                <span style={{display: 'inline-block', width: '100%', textAlign: 'center'}}>
                                </span>
                            </Col>
                            <Col span={12}>
                                <FormItem hidden={true}>
                                    {getFieldDecorator('city', {
                                        initialValue: record.city,
                                    })(
                                        <Input hidden={true} placeholder='请输入城市'/>
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        {isSeries ? null : <FormItem {...formItemLayout} label="时间" className="bs-form-item">
                            <div className="inline">
                                <div className="inline-block">
                                    {isMobile ? <span>开始：</span> : null}
                                    <FormItem>
                                        {getFieldDecorator('datebegin', {
                                            rules: [{required: true, message: '请选择开始时间!'}],
                                            initialValue: record.datebegin ? moment(record.datebegin) : null,
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
                                            initialValue: record.dateend ? moment(record.dateend) : null,
                                        })(
                                            <DatePicker showTime
                                                        format={'YYYY-MM-DD HH:mm'}/>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                        </FormItem>}
                        <FormItem {...formItemLayout} label="联系电话" className="bs-form-item">
                            {getFieldDecorator('phonenumber', {
                                initialValue: record.phonenumber,
                            })(
                                <Input placeholder='请输入联系电话'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="排序" className="bs-form-item">
                            {getFieldDecorator('remark', {
                                initialValue: record.remark,
                            })(
                                <Input.TextArea placeholder='排序'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述" className="bs-form-item">
                            {getFieldDecorator('description', {
                                initialValue: record.description,
                            })(
                                <Input.TextArea placeholder='描述'/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('id', {
                                initialValue: record.id,
                            })(
                                <Input hidden={true}/>
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
                                                src={form.getFieldValue('poster') ? form.getFieldValue('poster') :
                                                    (record.poster ? record.poster : imgcover)}
                                                alt="poster"
                                                className="form-match-poster-img"/>
                                        }

                                    </Upload>
                                )}
                            </FormItem>
                        </div>
                        <div className="center mt-m">
                            <Input style={{minWidth: 300, textAlign: "center"}} placeholder='封面地址'
                                   onChange={this.onPosterChange.bind(this, form)}
                                   value={form.getFieldValue('poster') ? form.getFieldValue('poster') : record.poster}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchModifyDialog);