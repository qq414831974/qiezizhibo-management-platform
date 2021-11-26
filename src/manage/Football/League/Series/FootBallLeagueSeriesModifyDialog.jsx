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
    Tooltip, InputNumber, message, TreeSelect
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAreasList, uploadimg} from "../../../../axios";

import defultAvatar from '../../../../static/avatar.jpg';
import {randomNum, toChinesNum} from "../../../../utils";
import {uploadposter} from "../../../../axios";
import imgcover from '../../../../static/imgcover.jpg';

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
const typeData = [
    {
        title: '时间轴',
        value: 1,
    }, {
        title: '技术统计',
        value: 2,
    }, {
        title: '球员名单',
        value: 3,
    }, {
        title: '聊天室',
        value: 4,
    }, {
        title: '集锦',
        value: 5,
    }
];

class FootBallLeagueSeriesModifyDialog extends React.Component {
    state = {}

    componentDidMount() {
        this.setState({loading: true});
        getAreasList().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    areas: data.data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
        selectChildren.push(<OptGroup
            label={<div><span>正常轮</span><span className="danger">（适用于联赛）</span></div>}>
            {normalRound}
        </OptGroup>);
        selectChildren.push(<OptGroup
            label={<div><span>小组赛</span><span className="danger">（适用于杯赛）杯赛积分榜只统计小组赛积分</span></div>}>
            {groupRound}
        </OptGroup>);
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
        const {visible, form, record, leagueData} = this.props;
        const {getFieldDecorator} = form;
        const isMobile = this.props.responsive.data.isMobile;
        const handlePosterChange = this.handlePosterChange;
        const isLiveCharge = this.state.isLiveCharge != null ? this.state.isLiveCharge : (record && record.isLiveCharge);
        const isRecordCharge = this.state.isRecordCharge != null ? this.state.isRecordCharge : (record && record.isRecordCharge);
        const isMonopolyCharge = this.state.isMonopolyCharge != null ? this.state.isMonopolyCharge : (record && record.isMonopolyCharge);
        const giftWatchRecordEnable = this.state.giftWatchRecordEnable != null ? this.state.giftWatchRecordEnable : (record && record.giftWatchRecordEnable);
        return (
            visible ?
                <div>
                    <Form>
                        <div className="w-full center">
                            <div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                                <span>系列赛：</span>
                                <Avatar src={leagueData.headImg ? leagueData.headImg : defultAvatar}/>
                                <span
                                    className="ml-s">{leagueData.name}{leagueData.shortName ? "(" + leagueData.shortName + ")" : ""}</span>
                            </div>
                        </div>
                        <FormItem {...formItemLayout} className="bs-form-item round-div ml-l mb-s">
                            {getFieldDecorator('headImg', {
                                initialValue: record.headImg,
                                getValueFromEvent(e) {
                                    return form.getFieldValue('headImg')
                                },
                                onChange(e) {
                                    const file = e.file;
                                    if (file.response) {
                                        form.setFieldsValue({
                                            headImg: file.response.data
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
                                            src={form.getFieldValue('headImg') ? form.getFieldValue('headImg') :
                                                (record.headImg ? record.headImg : defultAvatar)}
                                            alt="avatar"
                                            className="round-img"/>
                                    }

                                </Upload>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="微信类型" className="bs-form-item">
                            {getFieldDecorator('wechatType', {
                                rules: [{required: true, message: '请选择类型'}],
                                initialValue: record.wechatType
                            })(
                                <RadioGroup>
                                    <Radio value={0}>茄子TV</Radio>
                                </RadioGroup>
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
                        <FormItem {...formItemLayout} label="名称" className="bs-form-item">
                            {getFieldDecorator('name', {
                                initialValue: record.name,
                                rules: [{required: true, message: '请输入名字'}],
                            })(
                                <Input placeholder='请输入名字'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="简称" className="bs-form-item">
                            {getFieldDecorator('shortName', {
                                initialValue: record.shortName,
                            })(
                                <Input placeholder='请输入简称'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="英文名" className="bs-form-item">
                            {getFieldDecorator('englishName', {
                                initialValue: record.englishName,
                            })(
                                <Input placeholder='请输入英文名'/>
                            )}
                        </FormItem>
                         <FormItem {...formItemLayout} label="组别" className="bs-form-item">
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
                        </FormItem>
                        {this.getRoundDom(record)}
                        <FormItem {...formItemLayout} label='场地'
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
                        </FormItem>
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
                        <FormItem {...formItemLayout} label="比赛时长" className="bs-form-item">
                            {getFieldDecorator('regulations.duration', {
                                initialValue: record.regulations ? record.regulations.duration : null,
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
                        <FormItem {...formItemLayout} label="比赛菜单" className="bs-form-item">
                            {getFieldDecorator('matchType', {
                                initialValue: record.matchType ? record.matchType : [],
                            })(
                                <TreeSelect treeData={typeData}
                                            style={{minWidth: 300, maxWidth: 300, textAlign: "center"}}
                                            placeholder="请选择"
                                            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                            onChange={this.onTypeSelectChange}
                                            allowClear
                                            multiple
                                            filterTreeNode={(inputValue, treeNode) => {
                                                return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value == inputValue;
                                            }}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="主办方" className="bs-form-item">
                            {getFieldDecorator('majorSponsor', {
                                initialValue: record.majorSponsor,
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
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('country', {
                                initialValue: record.country,
                            })(
                                <Input hidden={true}/>
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
                                <FormItem>
                                    {getFieldDecorator('city', {
                                        initialValue: record.city,
                                        rules: [{required: true, message: '请输入城市'}],
                                    })(
                                        <Input placeholder='请输入城市'/>
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="时间" className="bs-form-item">
                            <div className="inline">
                                <div className="inline-block">
                                    {isMobile ? <span>开始：</span> : null}
                                    <FormItem>
                                        {getFieldDecorator('dateBegin', {
                                            rules: [{required: true, message: '请选择开始时间!'}],
                                            initialValue: record.dateBegin ? moment(record.dateBegin) : null,
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
                                        {getFieldDecorator('dateEnd', {
                                            rules: [{required: true, message: '请选择结束时间!'}],
                                            initialValue: record.dateEnd ? moment(record.dateEnd) : null,
                                        })(
                                            <DatePicker showTime
                                                        format={'YYYY-MM-DD HH:mm'}/>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label="联系电话" className="bs-form-item">
                            {getFieldDecorator('phoneNumber', {
                                initialValue: record.phoneNumber,
                            })(
                                <Input placeholder='请输入联系电话'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="排序" className="bs-form-item">
                            {getFieldDecorator('sortIndex', {
                                initialValue: record.sortIndex,
                            })(
                                <Input.TextArea placeholder='备注'/>
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
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('parentId', {
                                initialValue: record.parentId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item">
                            {getFieldDecorator('areaType', {
                                initialValue: record.areaType,
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
                                                poster: file.response.data
                                            })
                                        }
                                        handlePosterChange(e);
                                    }
                                })(
                                    <Upload
                                        accept="image/*"
                                        action={uploadposter}
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueSeriesModifyDialog);