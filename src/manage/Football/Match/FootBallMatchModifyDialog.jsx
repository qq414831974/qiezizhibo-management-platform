import React from 'react';
import {
    Modal,
    Form,
    Input,
    Avatar,
    Select,
    DatePicker,
    Col,
    Button,
    Row,
    Divider,
    List,
    Icon,
    Upload,
    Progress,
    TreeSelect,
    Tooltip,
    Checkbox,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {getJueSaiRankRound, getRound, parseTimeStringWithOutYear, randomNum, trim} from '../../../utils';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defultAvatar from '../../../static/avatar.jpg';
import imgcover from '../../../static/imgcover.jpg';
import vs from '../../../static/vs.png';
import {Link} from 'react-router-dom';
import {
    getAllTeams,
    createActivity,
    getActivityInfoList,
    getActivityInfo,
    getAllLeagueMatchs,
    upload,
    getTeamInLeague,
} from "../../../axios";
import {message} from "antd/lib/index";
import {toChinesNum} from '../../../utils/index';

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
const day = ["日", "一", "二", "三", "四", "五", "六"]
const typeData = [
    {
        title: '时间轴',
        value: 1,
    }, {
        title: '技术统计',
        value: 2,
    },
    {
        title: '球员名单',
        value: 3,
    }, {
        title: '聊天室',
        value: 4,
    }, {
        title: '推荐赛事',
        value: 5,
    },
];

class FootBallMatchModifyDialog extends React.Component {
    state = {
        liveloading: false,
        plusHide: true
    }

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.fetch();
        this.setState({
            hostTeam: this.props.record.hostteam,
            guestTeam: this.props.record.guestteam
        });
        this.setState({currentLeague: this.props.record.league})
    };

    fetch = (param) => {
        this.setState({
            leagueloading: true,
            teamloading: true,
            currentliveloading: true,
        });
        if (param || this.state.league) {
            const league = param || this.state.league
            getTeamInLeague(league.id).then(res => {
                if (res && res.code == 200) {
                    this.setState({
                        data: res.data,
                        teamloading: false
                    });
                }
            })
        } else {
            getAllTeams({
                pageSize: 300,
                pageNum: 1,
                sortField: "id",
                sortOrder: "desc"
            }).then((data) => {
                if (data && data.code == 200) {
                    this.setState({
                        data: data.data ? data.data.records : "",
                        teamloading: false,
                    });
                } else {
                    message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            });
        }
        getAllLeagueMatchs({
            pageSize: 300,
            pageNum: 1,
        }).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    leaguedata: data.data ? data.data.records : "",
                    leagueloading: false,
                });
            } else {
                message.error('获取联赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        this.getLiveInfo(this.props.record.activityId ? this.props.record.activityId : this.props.record.activityOld)
    }
    getLiveInfoList = (params) => {
        this.setState({
            listloading: true,
        });
        getActivityInfoList({sortField: "createdAt", sortOrder: "desc", ...params}).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.onChange = this.handleLiveListChange;
                pagination.size = "small";
                pagination.simple = true;
                this.setState({
                    livedata: data.data ? data.data.records : {},
                    listloading: false,
                    pagination,
                });
            } else {
                message.error('获取直播列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getLiveInfo = (params) => {
        if (params == null) {
            this.setState({
                currentLiveData: {name: "未选择直播间"},
                currentliveloading: false,
            });
            return;
        }
        getActivityInfo(params).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({
                        currentLiveData: data.data,
                        currentliveloading: false,
                    });
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('获取直播信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    createLive = () => {
        if (this.state.createLivename == null) {
            alert("请输入直播名")
            return;
        }
        if (this.state.liveStartTime == null) {
            alert("请选择直播开始时间")
            return;
        }
        if (this.state.liveEndTime == null) {
            alert("请选择直播结束时间")
            return;
        }
        let data = {}
        data.startedAt = this.state.liveStartTime
        data.endedAt = this.state.liveEndTime
        data.name = this.state.createLivename
        data.areatype = 0
        data.startedAt = data.startedAt ? moment(data.startedAt).format('YYYY/MM/DD HH:mm:ss') : null;
        data.endedAt = data.endedAt ? moment(data.endedAt).format('YYYY/MM/DD HH:mm:ss') : null;
        this.setState({
            liveloading: true,
        });
        createActivity(data).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({
                        liveloading: false,
                    });
                    this.getLiveInfoList({
                        pageSize: 10,
                        pageNum: 5,
                    });
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('创建失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    onHostSelect = (e, op) => {
        this.setState({
            hostTeam: op.props.data,
        });
    }
    onGuestSelect = (e, op) => {
        this.setState({
            guestTeam: op.props.data,
        });
    }
    onLeagueSelect = (e, op) => {
        this.setState({
            league: op.props.data,
        });
        this.fetch(op.props.data);
    }

    showLiveCreatePop = () => {
        this.getLiveInfoList({
            pageSize: 5,
            pageNum: 1,
        });
        this.setState({livecreatepopvisible: true});
    }
    handleLiveCreatePopCancel = () => {
        this.setState({livecreatepopvisible: false});
    }
    getTeamOption = () => {
        let dom = [];
        dom.push(<Option value={null} data={null} key={"team-none"}>{<p
            className="ml-s mt-n mb-n">无</p>}</Option>);
        this.state.data.forEach((item, index) => {
            dom.push(<Option value={item.id} data={item} key={"team" + item.id}>{<Tooltip title={item.remark}>
                <div className="inline-p"><Avatar
                    src={item.headImg}/><p
                    className="ml-s mt-n mb-n">{item.name}</p></div>
            </Tooltip>}</Option>)
        });
        return dom;
    }
    getLeagueOption = () => {
        let dom = [];
        dom.push(<Option onClick={() => {
            this.setState({currentLeague: null})
        }} value={null} data={null} key={"league-none"}>{<p
            className="ml-s mt-n mb-n">无联赛</p>}</Option>);
        this.state.leaguedata.forEach((item, index) => {
            dom.push(<Option value={item.id} data={item} key={"league" + item.id}>{<div className="inline-p"><Avatar
                src={item.headImg}/><p
                className="ml-s mt-n mb-n">{item.name}</p></div>}</Option>)
        });
        return dom;
    }
    handleLiveListChange = (page, pageSize) => {
        const pager = {...this.state.pagination};
        pager.current = page;
        pager.pageSize = pageSize;
        this.setState({
            pagination: pager,
        });
        this.getLiveInfoList({
            pageSize: pager.pageSize,
            pageNum: pager.current,
        });
    }
    onLivelistClick = (form, item) => {
        const playUrl = item.pullStreamUrls ? `${item.pullStreamUrls.hls}` : `${item.pullDomain}/${item.app}/${item.stream}.m3u8`;
        form.setFieldsValue({
            activityId: item.id,
            playPath: playUrl,
        })
        this.setState({
            livecreatepopvisible: false,
            currentLiveData: item,
        });
    }
    onCreateLiveStartChange = (date, dateString) => {
        this.setState({
            liveStartTime: dateString
        });
    }
    onCreateLiveEndChange = (date, dateString) => {
        this.setState({
            liveEndTime: dateString
        });
    }
    onCreateLiveNameChange = (e) => {
        this.setState({
            createLivename: e.target.value
        });
    }
    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploading: true, isupload: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, avatarUrl => this.setState({
                avatarUrl,
                uploading: false,
            }));
            setTimeout(() => {
                this.setState({isupload: false});
            }, 2000)
        }
    }
    onTypeSelectChange = (type) => {
        this.setState({type: type});
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    onPosterChange = (form, e) => {
        form.setFieldsValue({
            poster: e.target.value
        })
    }
    getRoundOption = () => {
        let options = [];
        if (this.state.currentLeague && this.state.currentLeague.round && this.state.currentLeague.round.rounds) {
            this.state.currentLeague.round.rounds.forEach((item, index) => {
                let group = [];
                if (item == 'open') {
                    options.push(<Option key={index} value="开幕式">开幕式</Option>);
                } else if (item == 'close') {
                    options.push(<Option key={index} value="闭幕式">闭幕式</Option>);
                } else if (item.startsWith('z-')) {
                    const num = item.split("-")[1]
                    group.push(this.getListOption(getRound(num, ""), "z"))
                    options.push(group)
                } else if (item.startsWith('x-')) {
                    const num = item.split("-")[1]
                    group.push(this.getListOption(getRound(num, "小组赛"), "x"))
                    options.push(group)
                } else if (item.startsWith('t-')) {
                    const num = item.split("-")[1]
                    group.push(this.getListOption(getRound(num, "淘汰赛"), "t"))
                    options.push(group)
                } else if (item.startsWith('j-')) {
                    const num = item.split("-")[1]
                    group.push(this.getListOption(getJueSaiRankRound(num), "j"))
                    options.push(group)
                } else {
                    options.push(<Option key={index} value={item}>{item}</Option>);
                }
            });
        }
        return options;
    }
    getListOption = (list, prefix) => {
        let dom = []
        list.forEach((item, index) => {
            dom.push(<Option key={prefix + index} value={item}>{item}</Option>)
        });
        return dom;
    }
    onRoundChange = (e) => {
        this.setState({round: e.target.value})
    }

    getGroupOption = () => {
        let options = [];
        let hasDefault = false;
        if (this.state.currentLeague && this.state.currentLeague.subgroup && this.state.currentLeague.subgroup.groups) {
            this.state.currentLeague.subgroup.groups.forEach((item, index) => {
                options.push(<Option key={index} value={item}>{item}</Option>);
                if (item === 'default') {
                    hasDefault = true;
                }
            });
        }
        !hasDefault && options.push(<Option key="no" value="default">default</Option>);
        return options;
    }

    onGroupChange = (e) => {
        this.setState({group: e.target.value})
    }

    onTeamClick = () => {
        this.fetch();
    }
    onActivityCheckedChange = (e) => {
        const {form} = this.props;
        this.setState({activityChecked: e.target.checked})
        if (e.target.checked) {
            form.setFieldsValue({activityId: null, activityOld: form.getFieldValue("activityId")})
        } else {
            form.setFieldsValue({activityId: form.getFieldValue("activityOld"), activityOld: null})
        }
    }
    getPlaceSelecter = () => {
        const league = this.state.league || (this.props.record ? this.props.record.league : null)
        let dom = []
        if (league && league.place) {
            league.place.forEach((item, index) => {
                dom.push(<Option key={`opt-${index}`} value={item}
                                 onClick={this.onPlaceSelect.bind(this, item)}>
                    <Tooltip title={item}>{item}</Tooltip>
                </Option>)
            })
        }
        return dom;
    }
    onPlaceSelect = (item) => {
        const {form} = this.props;
        form.setFieldsValue({
            place: item
        })
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const onHostSelect = this.onHostSelect
        const onGuestSelect = this.onGuestSelect
        const onLeagueSelect = this.onLeagueSelect
        const getLeagueOption = this.getLeagueOption
        const getTeamOption = this.getTeamOption
        const onLivelistClick = this.onLivelistClick
        const onLiveCreateClick = this.createLive
        const onCreateLiveStartChange = this.onCreateLiveStartChange
        const onCreateLiveEndChange = this.onCreateLiveEndChange
        const onCreateLiveNameChange = this.onCreateLiveNameChange
        const handleAvatarChange = this.handleAvatarChange
        const isMobile = this.props.responsive.data.isMobile;
        const isLiveCharge = this.state.isLiveCharge != null ? this.state.isLiveCharge : (record && record.isLiveCharge);
        const isRecordCharge = this.state.isRecordCharge != null ? this.state.isRecordCharge : (record && record.isRecordCharge);
        const isMonopolyCharge = this.state.isMonopolyCharge != null ? this.state.isMonopolyCharge : (record && record.isMonopolyCharge);

        const content_create = <div>
            <Divider className="mb-n" orientation="right">
                <div className="center">
                    <Button icon={this.state.plusHide ? "plus" : "minus"}
                            shape="circle"
                            onClick={() => {
                                this.setState({plusHide: !this.state.plusHide});
                            }}
                            type="primary">
                    </Button>
                </div>
            </Divider>
            <div hidden={this.state.plusHide}>
                <div className="center w-full">
                    <p style={{fontSize: 20}} className="mb-n">创建</p>
                </div>
                <div className="center">
                    <Input value={this.state.createLivename} style={{textAlign: "center", maxWidth: 250}}
                           placeholder="输入直播名"
                           onChange={onCreateLiveNameChange}/>
                </div>
                <div className="center w-full mt-m">
                    <DatePicker onChange={onCreateLiveStartChange} format="YYYY/MM/DD HH:mm:ss" placeholder="选择开始时间"
                                showTime/>
                    <p className={"ml-l mr-l"}>-</p>
                    <DatePicker onChange={onCreateLiveEndChange} format="YYYY/MM/DD HH:mm:ss" placeholder="选择结束时间"
                                showTime/>
                </div>
                <div className="center">
                    <Button type="primary"
                            loading={this.state.liveloading}
                            onClick={onLiveCreateClick}>
                        创建
                    </Button>
                </div>
                <Divider className="mb-n"/>
            </div>
            <div className="center w-full">
                <p style={{fontSize: 20}} className="mb-n">选择</p>
            </div>
            <div>
                <List
                    rowKey={record => record.id}
                    style={{minHeight: 300}}
                    className="list-pading-s"
                    dataSource={this.state.livedata}
                    pagination={this.state.pagination}
                    loading={this.state.listloading}
                    renderItem={item => (
                        <List.Item>
                            <div className="cursor-hand" onClick={onLivelistClick.bind(this, form, item)}>
                                <p style={{fontSize: 14}}>{item.name}</p>
                                <p className="mb-n"
                                   style={{fontSize: 10}}>{parseTimeStringWithOutYear(item.startedAt)}~{parseTimeStringWithOutYear(item.endedAt)}</p>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
        const placeSelecter = <Select value={null} style={{width: 80}}>
            {this.getPlaceSelecter()}
        </Select>
        return (
            visible ?
                <div>
                    <Form>
                        <div className="center w-full mb-m">
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('leaguematchId', {
                                    // rules: [{required: true, message: '请选择联赛!'}],
                                    initialValue: record.league ? record.league.id : null,
                                })(
                                    <Select size="large" style={{minWidth: 300}} onSelect={onLeagueSelect}
                                            disabled={this.state.leagueloading}>
                                        {this.state.leaguedata ? getLeagueOption() : null}
                                    </Select>
                                )}
                            </FormItem>
                            <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                                  hidden={!this.state.leagueloading}/>
                        </div>
                        <Row gutter={2}>
                            <Col span={8}>
                                <div className="center">
                                    <FormItem {...formItemLayout} className="bs-form-item">
                                        {getFieldDecorator('hostTeamId', {
                                            // rules: [{required: true, message: '请选择主队!'}],
                                            initialValue: record.hostteam ? record.hostteam.id : null,
                                        })(
                                            <Select size="large" style={{minWidth: 150}}
                                                    onSelect={onHostSelect}
                                                    disabled={this.state.teamloading}>
                                                {this.state.data ? getTeamOption() : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                                          hidden={!this.state.teamloading}/>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="center">
                                    {isMobile ? null : <FormItem className="bs-form-item">
                                        {getFieldDecorator('startTime', {
                                            rules: [{required: true, message: '请选择开始时间!'}],
                                            initialValue: moment(record.startTime),
                                        })(
                                            <DatePicker showTime
                                                        format='YYYY-MM-DD HH:mm'/>
                                        )}
                                    </FormItem>}
                                </div>
                                <div className="center">
                                    {isMobile ? null : <FormItem className="bs-form-item">
                                        {getFieldDecorator('duration', {
                                            rules: [{required: true, message: '请输入比赛时长!'}],
                                            initialValue: record.duration,
                                        })(
                                            <Input className="input-text-align-center"
                                                   prefix={<Tooltip title="比赛开始后请勿随意修改"><Icon
                                                       type="clock-circle"/></Tooltip>} suffix={<span>分钟</span>}
                                                   placeholder="比赛时长"/>
                                        )}
                                    </FormItem>}
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="center">
                                    <FormItem {...formItemLayout} className="bs-form-item">
                                        {getFieldDecorator('guestTeamId', {
                                            // rules: [{required: true, message: '请选择客队!'}],
                                            initialValue: record.guestteam ? record.guestteam.id : null,
                                        })(
                                            <Select size="large" style={{minWidth: 150}}
                                                    onSelect={onGuestSelect}
                                                    disabled={this.state.teamloading}>
                                                {this.state.data ? getTeamOption() : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                                          hidden={!this.state.teamloading}/>
                                </div>
                            </Col>
                        </Row>
                        {isMobile ? <div className="center">
                            <FormItem className="bs-form-item">
                                {getFieldDecorator('startTime', {
                                    rules: [{required: true, message: '请选择开始时间!'}],
                                    initialValue: moment(record.startTime),
                                })(
                                    <DatePicker showTime
                                                format={'YYYY-MM-DD HH:mm'}/>
                                )}
                            </FormItem>
                        </div> : null}
                        {isMobile ? <div className="center">
                            <FormItem className="bs-form-item">
                                {getFieldDecorator('duration', {
                                    rules: [{required: true, message: '请输入比赛时长!'}],
                                    initialValue: record.duration,
                                })(
                                    <Input className="input-text-align-center"
                                           prefix={<Tooltip title="比赛开始后请勿随意修改"><Icon type="clock-circle"/></Tooltip>}
                                           suffix={<span>分钟</span>} placeholder="比赛时长"/>
                                )}
                            </FormItem>
                        </div> : null}
                        <Row gutter={2} className="mt-m">
                            <Col span={8}>
                                <div className="center">
                                    <img className="round-img"
                                         src={this.state.hostTeam ? this.state.hostTeam.headImg : defultAvatar}/>
                                </div>
                                <div className="center w-full mt-m">
                                    <p style={{fontSize: 22}}>{this.state.hostTeam ? this.state.hostTeam.name : ""}</p>
                                </div>
                                <div className="center w-full mt-m">
                                    <FormItem {...formItemLayout} className="bs-form-item center">
                                        {getFieldDecorator('hostnooice', {
                                            initialValue: record.hostnooice,
                                        })(
                                            <Input placeholder="点赞数"
                                                   disabled={this.state.hostTeam == null || this.state.guestTeam == null}
                                                   prefix={<Icon type="like"/>}/>
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="center w-full">
                                    <img style={{height: 90, width: 90}} src={vs}/>
                                </div>
                                <div className="center w-full">
                                    <p>{form.getFieldValue('startTime') ? form.getFieldValue('startTime').format('MM-DD HH:mm') : ""}</p>
                                </div>
                                <div className="center w-full">
                                    <p>{form.getFieldValue('startTime') ? "星期" + day[form.getFieldValue('startTime').format('d')] : ""}</p>
                                </div>
                                <div className="center w-full">
                                    <p className="mb-n" style={{fontWeight: "bold"}}>分组</p>
                                </div>
                                <div className="center w-full">
                                    {this.state.currentLeague ?
                                        <FormItem className="bs-form-item">
                                            {getFieldDecorator('subgroup', {
                                                initialValue: record.subgroup,
                                            })(
                                                <Select size="large" style={{minWidth: 150}}
                                                        onSelect={this.onGroupSelect}
                                                        disabled={this.state.leagueloading}>
                                                    {this.getGroupOption()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        :
                                        <FormItem className="bs-form-item">
                                            {getFieldDecorator('subgroup', {
                                                initialValue: record.subgroup,
                                            })(
                                                <Input style={{minWidth: 100, textAlign: "center"}} placeholder='分组'
                                                       onChange={this.onGroupChange}/>
                                            )}
                                        </FormItem>
                                    }
                                </div>
                                <div className="center w-full">
                                    <p className="mb-n" style={{fontWeight: "bold"}}>轮次</p>
                                </div>
                                <div className="center w-full">
                                    {this.state.currentLeague ?
                                        <FormItem className="bs-form-item">
                                            {getFieldDecorator('round', {
                                                initialValue: record.round,
                                            })(
                                                <Select size="large" style={{minWidth: 150}}
                                                        onSelect={this.onRoundSelect}
                                                        disabled={this.state.leagueloading}>
                                                    {this.getRoundOption()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        :
                                        <FormItem className="bs-form-item">
                                            {getFieldDecorator('round', {
                                                initialValue: record.round,
                                            })(
                                                <Input style={{minWidth: 100, textAlign: "center"}} placeholder='轮次'
                                                       onChange={this.onRoundChange}/>
                                            )}
                                        </FormItem>
                                    }
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="center">
                                    <img className="round-img"
                                         src={this.state.guestTeam ? this.state.guestTeam.headImg : defultAvatar}/>
                                </div>
                                <div className="center w-full mt-m">
                                    <p style={{fontSize: 22}}>{this.state.guestTeam ? this.state.guestTeam.name : ""}</p>
                                </div>
                                <div className="center w-full mt-m">
                                    <FormItem {...formItemLayout} className="bs-form-item center">
                                        {getFieldDecorator('guestnooice', {
                                            initialValue: record.guestnooice,
                                        })(
                                            <Input placeholder="点赞数"
                                                   disabled={this.state.hostTeam == null || this.state.guestTeam == null}
                                                   prefix={<Icon type="like"/>}/>
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>
                        <div className="center w-full">
                            <p className="mb-n mt-m" style={{fontSize: 20}}>比赛名</p>
                        </div>
                        <div className="center w-full">
                            <FormItem className="bs-form-item">
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入比赛名!'}],
                                    initialValue: record.name,
                                })(
                                    <Input style={{minWidth: 300, textAlign: "center"}} placeholder='请输入名字'/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <p className="mb-n mt-m" style={{fontSize: 20}}>比赛地点</p>
                        </div>
                        <div className="center w-full">
                            <FormItem className="bs-form-item">
                                {getFieldDecorator('place', {
                                    initialValue: record.place ? record.place : null,
                                })(
                                    <Input addonBefore={placeSelecter} style={{minWidth: 300, textAlign: "center"}}
                                           placeholder='请输入地点'/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('playPath', {
                                    initialValue: record.playPath,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('activityId', {
                                    initialValue: record.activityId,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('activityOld', {
                                    initialValue: record.activityOld,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('id', {
                                    initialValue: record.id,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <p className="mt-m" style={{fontSize: 22}}>直播间</p>
                            <span>是否关闭：</span>
                            <Checkbox
                                checked={this.state.activityChecked ? this.state.activityChecked : (form.getFieldValue("activityOld") != null)}
                                onChange={this.onActivityCheckedChange}/>
                        </div>
                        <div className="center w-full">
                            {this.state.currentLiveData ?
                                <Link to={`/live/${this.state.currentLiveData.id}`}>
                                    <p className="cursor-hand">{this.state.currentLiveData.name}</p>
                                </Link>
                                :
                                <div/>
                            }
                        </div>
                        <div className="center w-full">
                            <Modal
                                title="选择直播间"
                                className={isMobile ? "top-n" : ""}
                                visible={this.state.livecreatepopvisible}
                                footer={[
                                    <Button key="back" onClick={this.handleLiveCreatePopCancel}>取消</Button>,
                                ]}
                                onCancel={this.handleLiveCreatePopCancel}>
                                {content_create}
                            </Modal>
                            <Button type="primary" loading={this.state.currentliveloading}
                                    onClick={this.showLiveCreatePop}>选择直播间</Button>
                        </div>
                        {/*<div className="center w-full">*/}
                        {/*<div>*/}
                        {/*<p className="mt-m mb-n inline-block" style={{fontSize: 22}}>直播地址</p>*/}
                        {/*<Tooltip title="正常情况请勿修改，如遇直播无法播放再做修改！">*/}
                        {/*<Icon className="inline-block" type="question-circle"/>*/}
                        {/*</Tooltip>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="center w-full">*/}
                        {/*<FormItem style={{margin: 0}}>*/}
                        {/*{getFieldDecorator('playPath', {*/}
                        {/*initialValue: record.playPath,*/}
                        {/*})(*/}
                        {/*<Input style={{minWidth: 300, textAlign: "center"}}/>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</div>*/}
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>收费设置</span>
                        </div>
                        <div className="center w-full">
                            <span>直播收费：</span>
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('isLiveCharge', {
                                    initialValue: record ? record.isLiveCharge : false,
                                    valuePropName: 'checked',
                                    onChange: (e) => {
                                        this.setState({isLiveCharge: e.target.checked})
                                    }
                                })(
                                    <Checkbox/>
                                )}
                            </FormItem>
                            {isLiveCharge ? <FormItem {...formItemLayout}
                                                      className="bs-form-item">
                                {getFieldDecorator('livePrice', {
                                    initialValue: record ? record.livePrice : null,
                                    rules: [{required: true, message: '请输入价格'}],
                                })(
                                    <Input addonBefore="永久" addonAfter="分" placeholder='请输入价格'/>
                                )}
                            </FormItem> : null}
                            {isLiveCharge ? <FormItem {...formItemLayout}
                                                      className="bs-form-item">
                                {getFieldDecorator('liveMonthPrice', {
                                    initialValue: record ? record.liveMonthPrice : null,
                                    rules: [{required: true, message: '请输入价格'}],
                                })(
                                    <Input addonBefore="一月" addonAfter="分" placeholder='请输入价格'/>
                                )}
                            </FormItem> : null}
                        </div>
                        <div className="center w-full">
                            <span>录播收费：</span>
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('isRecordCharge', {
                                    initialValue: record ? record.isRecordCharge : false,
                                    valuePropName: 'checked',
                                    onChange: (e) => {
                                        this.setState({isRecordCharge: e.target.checked})
                                    }
                                })(
                                    <Checkbox/>
                                )}
                            </FormItem>
                            {isRecordCharge ? <FormItem {...formItemLayout}
                                                        className="bs-form-item">
                                {getFieldDecorator('recordPrice', {
                                    initialValue: record ? record.recordPrice : null,
                                    rules: [{required: true, message: '请输入价格'}],
                                })(
                                    <Input addonBefore="永久" addonAfter="分" placeholder='请输入价格'/>
                                )}
                            </FormItem> : null}
                            {isRecordCharge ? <FormItem {...formItemLayout}
                                                        className="bs-form-item">
                                {getFieldDecorator('recordMonthPrice', {
                                    initialValue: record ? record.recordMonthPrice : null,
                                    rules: [{required: true, message: '请输入价格'}],
                                })(
                                    <Input addonBefore="一月" addonAfter="分" placeholder='请输入价格'/>
                                )}
                            </FormItem> : null}
                        </div>
                        {isLiveCharge || isRecordCharge ?
                            <div className="center w-full" style={{fontWeight: 'bold'}}>付费人数放大</div> : null}
                        {isLiveCharge || isRecordCharge ? <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.base', {
                                    initialValue: record && record.expand ? record.expand.base : randomNum(1, 10),
                                    rules: [{required: true, message: '请输入'}],
                                })(
                                    <Input addonBefore="初始值" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="初始值"/>
                                )}
                            </FormItem>
                            <span className="ml-s mr-s"> </span>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.expandMin', {
                                    initialValue: record && record.expand ? record.expand.expandMin : 2,
                                    rules: [{required: true, message: '请输入'}],
                                })(
                                    <Input addonBefore="放大最小" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="最小值"/>
                                )}
                            </FormItem>
                            <span className="ml-s mr-s">-</span>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.expandMax', {
                                    initialValue: record && record.expand ? record.expand.expandMax : 5,
                                    rules: [{required: true, message: '请输入'}],
                                })(
                                    <Input addonBefore="放大最大" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="最大值"/>
                                )}
                            </FormItem>
                        </div> : null}
                        <div className="center w-full">
                            <span>开启买断：</span>
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('isMonopolyCharge', {
                                    initialValue: record ? record.isMonopolyCharge : false,
                                    valuePropName: 'checked',
                                    onChange: (e) => {
                                        this.setState({isMonopolyCharge: e.target.checked})
                                    }
                                })(
                                    <Checkbox/>
                                )}
                            </FormItem>
                            {isMonopolyCharge ? <FormItem {...formItemLayout}
                                                    className="bs-form-item">
                                {getFieldDecorator('monopolyPrice', {
                                    initialValue: record ? record.monopolyPrice : null,
                                    rules: [{required: true, message: '请输入价格'}],
                                })(
                                    <Input addonAfter="分" placeholder='请输入价格'/>
                                )}
                            </FormItem> : null}
                        </div>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>菜单设置</span>
                        </div>
                        <div className="center w-full">
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('type', {
                                    initialValue: record.type ? record.type : [],
                                })(
                                    <TreeSelect treeData={typeData}
                                                style={{minWidth: 300, maxWidth: 300, textAlign: "center"}}
                                                placeholder="请选择"
                                                dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                                onChange={this.onTypeSelectChange}
                                                allowClear
                                                multiple
                                                filterTreeNode={(inputValue, treeNode) => {
                                                    return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value.indexOf(inputValue) != -1;
                                                }}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>人数放大</span>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('onlinebase', {
                                    initialValue: record.onlinebase,
                                })(
                                    <Input addonBefore="初始值" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="初始值"/>
                                )}
                            </FormItem>
                            <span className="ml-s mr-s"></span>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('onlineExpendMin', {
                                    initialValue: record.onlineExpendMin,
                                })(
                                    <Input addonBefore="最小" style={{width: 120, textAlign: "center"}}
                                           placeholder="最小值"/>
                                )}
                            </FormItem>
                            <span className="ml-s mr-s">-</span>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('onlineExpendMax', {
                                    initialValue: record.onlineExpendMax,
                                })(
                                    <Input addonBefore="最大" style={{width: 120, textAlign: "center"}}
                                           placeholder="最大值"/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>预览封面</span>
                        </div>
                        <div className="center w-full">
                            <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                                {getFieldDecorator('poster', {
                                    // initialValue: logo,
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
                        {this.state.isupload ? <div className="center w-full">
                            <Progress style={{width: 160}} percent={this.state.uploading ? 0 : 100}/>
                        </div> : null}
                        {this.props.detail ?
                            <div className="center">
                                <Button type="primary" className="center mt-l"
                                        onClick={this.props.handleSave}>保存配置</Button>
                                <Button type="danger" className="center mt-l"
                                        onClick={this.props.handleDelete}>删除</Button>
                                <Button type="primary" className="center mt-l"><Link to={
                                    `/match/comment/${record.id}`
                                }>评论管理</Link></Button>
                            </div> : <div/>
                        }
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchModifyDialog);