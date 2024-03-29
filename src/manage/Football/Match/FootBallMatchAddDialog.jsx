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
    Tooltip, Checkbox,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {parseTimeStringWithOutYear, randomNum} from '../../../utils';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defultAvatar from '../../../static/avatar.jpg';
import imgcover from '../../../static/imgcover.jpg';
import vs from '../../../static/vs.png';
import {
    getAllTeams,
    createActivity,
    getActivityInfoList,
    getAllLeagueMatchs,
    uploadposter,
    getTeamInLeague, getLeagueMatchById, getLeagueTeam,
} from "../../../axios";
import {message} from "antd/lib/index";
import {getRound, getJueSaiRankRound} from '../../../utils/index';

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
        title: '集锦',
        value: 5,
    }
];

class FootBallMatchAddDialog extends React.Component {
    state = {
        liveloading: false,
        leagueloading: false,
        plusHide: true
    }
    isLeagueCompositions = true;

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        if (this.props.leagueId != null) {
            getLeagueMatchById(this.props.leagueId).then(data => {
                if (data && data.code == 200 && data.data) {
                    this.setState({
                        leaguedata: [data.data],
                        currentLeague: data.data,
                    }, () => {
                        this.props.form.setFieldsValue({leagueId: Number(this.props.leagueId)})
                    });
                    this.fetch(data.data);
                }
            })
        } else {
            this.fetchLeagues(null, 1);
            this.fetch();
        }
    };

    fetch = (param) => {
        this.setState({
            teamloading: true,
        });
        if (param || this.state.currentLeague) {
            const league = param || this.state.currentLeague
            getTeamInLeague(league.id).then(res => {
                if (res && res.code == 200) {
                    this.setState({
                        data: res.data.records,
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
    }
    fetchLeagues = (searchText, pageNum) => {
        this.setState({
            leagueloading: true,
        });
        if (pageNum == 1) {
            this.setState({
                leaguedata: [],
            });
        }
        getAllLeagueMatchs({
            pageSize: 20,
            pageNum: pageNum,
            sortField: "createTime",
            sortOrder: "desc",
            name: searchText
        }).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    leaguedata: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.leaguedata.concat(data.data.records) : []),
                    leagueloading: false,
                    leaguePageNum: data.data.current,
                    leaguePageSize: data.data.size,
                    leaguePageTotal: data.data.total,
                });
            } else {
                message.error('获取联赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleLeagueChange = (value, op) => {
        this.setState({currentLeague: op.props.data});
        this.fetch(op.props.data);
        const {form} = this.props;
        this.state.leaguedata && this.state.leaguedata.forEach(item => {
            if (item.id == value) {
                form.setFieldsValue({leagueId: item.id})
            }
        });
    }
    handleLeagueShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50) + 1;
        if (num + 5 >= this.state.leaguedata.length) {
            this.handleLeagueOnLoadMore(e);
        }
    }
    handleLeagueOnLoadMore = (e) => {
        let data = this.state.leaguedata;
        e.target.scrollTop = data.length * 50;
        if (this.state.leagueloading) {
            return;
        }
        if (data.length > this.state.leaguePageTotal) {
            this.setState({
                leagueHasMore: false,
                leagueloading: false,
            });
            return;
        }
        this.fetchLeagues(this.state.leagueSearchText, this.state.leaguePageNum + 1);
    }
    handleLeagueSearch = (e) => {
        const value = e.target.value;
        this.setState({leagueSearchText: value});
        // setTimeout(()=>{
        if (this.isLeagueCompositions) {
            this.fetchLeagues(value, 1);
        }
        // },100);
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onLeagueInputCompositionStart = () => {
        this.isLeagueCompositions = false;
    }
    onLeagueInputCompositionEnd = () => {
        this.isLeagueCompositions = true;
        this.fetchLeagues(this.state.leagueSearchText, 1);
    }

    getLiveInfoList = (params) => {
        this.setState({
            listloading: true,
        });
        getActivityInfoList({sortField: "createTime", sortOrder: "desc", ...params}).then((data) => {
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
        })
    }
    createLive = () => {
        if (this.state.createLivename == null) {
            alert("请输入直播名")
            return;
        }
        // if (this.state.liveStartTime == null) {
        //     alert("请选择直播开始时间")
        //     return;
        // }
        // if (this.state.liveEndTime == null) {
        //     alert("请选择直播结束时间")
        //     return;
        // }
        const startTime = moment(this.props.form.getFieldValue('startTime')).subtract(30, "m");
        const endTime = moment(this.props.form.getFieldValue('startTime')).add(210, "m");
        let data = {}
        data.startTime = this.state.liveStartTime ? this.state.liveStartTime : startTime;
        data.endTime = this.state.liveEndTime ? this.state.liveEndTime : endTime;
        data.name = this.state.createLivename ? this.state.createLivename : this.props.form.getFieldValue('name');
        data.areaType = 0;
        data.startTime = data.startTime ? moment(data.startTime).format('YYYY/MM/DD HH:mm:ss') : null;
        data.endTime = data.endTime ? moment(data.endTime).format('YYYY/MM/DD HH:mm:ss') : null;

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
                        pageSize: 5,
                        pageNum: 1,
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

    showLiveCreatePop = () => {
        this.getLiveInfoList({
            pageSize: 5,
            pageNum: 1,
        });

        this.setState({livecreatepopvisible: true, createLivename: this.props.form.getFieldValue('name')});
    }
    handleLiveCreatePopCancel = () => {
        this.setState({livecreatepopvisible: false});
    }
    getTeamOption = () => {
        let dom = [];
        dom.push(<Option value={null} data={null} key={"team-none"}>{<p
            className="ml-s mt-n mb-n">无</p>}</Option>);
        this.state.data && this.state.data.forEach((item, index) => {
            dom.push(<Option value={item.id} data={item} key={"team" + item.id}>{<Tooltip title={item.remark}>
                <div className="inline-p"><Avatar
                    src={item.headImg}/><p
                    className="ml-s">{item.name}</p></div>
            </Tooltip>}</Option>)
        });
        return dom;
    }
    getLeagueOption = () => {
        let dom = [];
        dom.push(<Option style={{height: 50}} onClick={() => {
            this.setState({currentLeague: null})
        }} value={null} data={null} key={"league-none"}>{<p
            className="ml-s mt-n mb-n">无联赛</p>}</Option>);
        this.state.leaguedata.forEach((item, index) => {
            dom.push(<Option style={{height: 50}} onClick={() => {
                this.setState({currentLeague: item})
            }} value={item.id} data={item} key={"league" + item.id}>{<div className="inline-p"><Avatar
                src={item.headImg}/><p
                className="ml-s">{item.name}</p></div>}</Option>);
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
            liveStartTime: dateString,
            liveStartTimeDate: date
        });
    }
    onCreateLiveEndChange = (date, dateString) => {
        this.setState({
            liveEndTime: dateString,
            liveEndTimeDate: date
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
    onRoundSelect = (value) => {
        this.setState({round: value})
    }
    onGroupSelect = (value) => {
        this.setState({group: value})
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
    getPlaceSelecter = () => {
        let dom = []
        if (this.state.currentLeague && this.state.currentLeague.place) {
            this.state.currentLeague.place.forEach((item, index) => {
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
    getMatchType = () => {
        if(this.state.currentLeague && this.state.currentLeague.matchType){
            return this.state.currentLeague.matchType;
        }
        return this.state.statisticsRule && this.state.statisticsRule.available ? [1, 2, 3] : [2, 3];
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const onHostSelect = this.onHostSelect
        const onGuestSelect = this.onGuestSelect
        const getLeagueOption = this.getLeagueOption
        const getTeamOption = this.getTeamOption
        const onLivelistClick = this.onLivelistClick
        const onLiveCreateClick = this.createLive
        const onCreateLiveStartChange = this.onCreateLiveStartChange
        const onCreateLiveEndChange = this.onCreateLiveEndChange
        const onCreateLiveNameChange = this.onCreateLiveNameChange
        const handleAvatarChange = this.handleAvatarChange
        const isMobile = this.props.responsive.data.isMobile;
        const startTime = form.getFieldValue('startTime') ? moment(form.getFieldValue('startTime')) : null;
        const endTime = form.getFieldValue('startTime') ? moment(form.getFieldValue('startTime')) : null;
        const isLiveCharge = this.state.isLiveCharge != null ? this.state.isLiveCharge : (this.state.currentLeague && this.state.currentLeague.isLiveCharge);
        const isRecordCharge = this.state.isRecordCharge != null ? this.state.isRecordCharge : (this.state.currentLeague && this.state.currentLeague.isRecordCharge);
        const isMonopolyCharge = this.state.isMonopolyCharge != null ? this.state.isMonopolyCharge : (this.state.currentLeague && this.state.currentLeague.isMonopolyCharge);
        const giftWatchRecordEnable = this.state.giftWatchRecordEnable != null ? this.state.giftWatchRecordEnable : (this.state.currentLeague && this.state.currentLeague.giftWatchRecordEnable);

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
                    <DatePicker
                        value={this.state.liveStartTimeDate ? this.state.liveStartTimeDate : (startTime ? startTime.subtract(30, "m") : null)}
                        onChange={onCreateLiveStartChange}
                        format="YYYY/MM/DD HH:mm:ss"
                        placeholder="选择开始时间"
                        showTime/>
                    <p className={"ml-l mr-l"}>-</p>
                    <DatePicker
                        value={this.state.liveEndTimeDate ? this.state.liveEndTimeDate : (endTime ? endTime.add(210, "m") : null)}
                        onChange={onCreateLiveEndChange}
                        format="YYYY/MM/DD HH:mm:ss"
                        placeholder="选择结束时间"
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
                                   style={{fontSize: 10}}>{parseTimeStringWithOutYear(item.startTime)}~{parseTimeStringWithOutYear(item.endTime)}</p>
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
                                {getFieldDecorator('leagueId', {
                                    // rules: [{required: true, message: '请选择联赛!'}],
                                })(
                                    <Select showSearch
                                            placeholder="按名称搜索并选择联赛"
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            style={{minWidth: 300}}
                                            onSelect={this.handleLeagueChange}
                                            onPopupScroll={this.handleLeagueShowMore}
                                            notFoundContent={null}
                                        // mode="tags"
                                            loading={this.state.leagueloading}
                                            getInputElement={() => (
                                                <input onInput={this.handleLeagueSearch}
                                                       onCompositionStart={this.onLeagueInputCompositionStart}
                                                       onCompositionEnd={this.onLeagueInputCompositionEnd}/>)}
                                    >
                                        {this.state.leaguedata ? getLeagueOption() : null}
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                        <Row gutter={2}>
                            <Col span={8}>
                                <div className="center">
                                    <FormItem {...formItemLayout} className="bs-form-item">
                                        {getFieldDecorator('hostTeamId', {
                                            // rules: [{required: true, message: '请选择主队!'}],
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
                                        })(
                                            <DatePicker showTime
                                                        format={'YYYY-MM-DD HH:mm'}/>
                                        )}
                                    </FormItem>}
                                </div>
                                <div className="center">
                                    {isMobile ? null : <FormItem className="bs-form-item">
                                        {getFieldDecorator('duration', {
                                            initialValue: this.state.currentLeague && this.state.currentLeague.regulations ? this.state.currentLeague.regulations.duration : 90,
                                            rules: [{required: true, message: '请输入比赛时长!'}],
                                        })(
                                            <Input className="input-text-align-center"
                                                   prefix={<Icon type="clock-circle"/>} suffix={<span>分钟</span>}
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
                                })(
                                    <DatePicker placeholder="选择时间"
                                                showTime
                                                format={'YYYY-MM-DD HH:mm'}/>
                                )}
                            </FormItem>
                        </div> : null}
                        {isMobile ? <div className="center">
                            <FormItem className="bs-form-item">
                                {getFieldDecorator('duration', {
                                    initialValue: this.state.currentLeague && this.state.currentLeague.regulations ? this.state.currentLeague.regulations.duration : 90,
                                    rules: [{required: true, message: '请输入比赛时长!'}],
                                })(
                                    <Input className="input-text-align-center" prefix={<Icon type="clock-circle"/>}
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
                                        {getFieldDecorator('hostNooice', {
                                            initialValue: (this.state.hostTeam != null && this.state.guestTeam != null) ? randomNum(100, 999) : null
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
                                                initialValue: this.state.hostTeam ? this.state.hostTeam.subgroup : "default",
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
                                                initialValue: "无分组",
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
                                            {getFieldDecorator('round', {})(
                                                <Select size="large" style={{minWidth: 150}}
                                                        onSelect={this.onRoundSelect}
                                                        disabled={this.state.leagueloading}>
                                                    {this.getRoundOption()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        :
                                        <FormItem className="bs-form-item">
                                            {getFieldDecorator('round', {})(
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
                                        {getFieldDecorator('guestNooice', {
                                            initialValue: (this.state.hostTeam != null && this.state.guestTeam != null) ? randomNum(100, 999) : null
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
                                    initialValue: this.state.currentLeague && this.state.guestTeam && this.state.hostTeam ? `${this.state.currentLeague.name} ${this.state.round ? this.state.round : ""} ${this.state.hostTeam.name}VS${this.state.guestTeam.name}` : "",
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
                                {getFieldDecorator('place', {})(
                                    <Input addonBefore={placeSelecter} style={{minWidth: 300, textAlign: "center"}}
                                           placeholder='请输入地点'/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <p className="mt-m" style={{fontSize: 22}}>直播间</p>
                        </div>
                        <div className="center w-full">
                            {this.state.currentLiveData ?
                                <p>{this.state.currentLiveData.name}</p>
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
                            <Button type="primary" onClick={this.showLiveCreatePop}>选择直播间</Button>
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
                        {/*{getFieldDecorator('playPath', {})(*/}
                        {/*<Input style={{minWidth: 300, textAlign: "center"}}/>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</div>*/}
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>菜单设置</span>
                        </div>
                        <div className="center w-full">
                            <FormItem {...formItemLayout} className="bs-form-item">
                                {getFieldDecorator('type', {
                                    initialValue: this.getMatchType(),
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
                        </div>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>人数放大</span>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.baseMin', {
                                    initialValue: 500
                                })(
                                    <Input addonBefore="初始值最小" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="初始值最小"/>
                                )}
                            </FormItem>
                            <span className="ml-s mr-s">-</span>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.baseMax', {
                                    initialValue: 900
                                })(
                                    <Input addonBefore="初始值最大" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="初始值最大"/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.expandMin', {
                                    initialValue: 80,
                                })(
                                    <Input addonBefore="放大值最小" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="放大值最小"/>
                                )}
                            </FormItem>
                            <span className="ml-s mr-s">-</span>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('expand.expandMax', {
                                    initialValue: 100,
                                })(
                                    <Input addonBefore="放大值最大" style={{minWidth: 60, textAlign: "center"}}
                                           placeholder="放大值最大"/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>在线人数</span>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('online', {
                                    initialValue: randomNum(500, 900)
                                })(
                                    <Input addonBefore="在线人数" style={{maxWidth: 300, minWidth: 60, textAlign: "center"}}
                                           placeholder="在线人数"/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <span className="mb-n mt-m" style={{fontSize: 20}}>预览封面</span>
                        </div>
                        <div className="center w-full">
                            <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                                {getFieldDecorator('poster', {
                                    // initialValue: this.state.currentLeague?this.state.currentLeague.poster:null,
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
                                        action={uploadposter}
                                        listType="picture-card"
                                        withCredentials={true}
                                        showUploadList={false}
                                        disabled={this.state.uploading}
                                        onChange={this.handleAvatarChange}
                                    >
                                        {
                                            <img
                                                src={form.getFieldValue('poster') ? form.getFieldValue('poster') : (this.state.currentLeague ? this.state.currentLeague.poster : imgcover)}
                                                alt="poster"
                                                className="form-match-poster-img"/>
                                        }

                                    </Upload>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('playPath', {})(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('activityId', {})(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('available', {
                                    initialValue: true,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('areaType', {
                                    initialValue: this.state.leaguedata ? this.state.leaguedata.areaType : 0,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center w-full">
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator('wechatType', {
                                    initialValue: this.state.leaguedata ? this.state.leaguedata.wechatType : 0,
                                })(
                                    <Input hidden={true}/>
                                )}
                            </FormItem>
                        </div>
                        <div className="center mt-m">
                            <Input style={{minWidth: 300, textAlign: "center"}} placeholder='封面地址'
                                   onChange={this.onPosterChange.bind(this, form)}
                                   value={form.getFieldValue('poster') ? form.getFieldValue('poster') : (this.state.currentLeague ? this.state.currentLeague.poster : null)}/>
                        </div>
                        {this.state.isupload ? <div className="center w-full">
                            <Progress style={{width: 160}} percent={this.state.uploading ? 0 : 100}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchAddDialog);