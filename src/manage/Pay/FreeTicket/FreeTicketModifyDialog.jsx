import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Icon,
    TreeSelect, Select, Tooltip, message, Avatar,
} from 'antd';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import {
    getAllMatchs,
    getAllLeagueMatchs,
    getAllUser,
    getUserByUserNo,
    getLeagueMatchById,
    getMatchById
} from "../../../axios";
import defultAvatar from "../../../static/avatar.jpg";
import logo from "../../../static/logo.png";
import {setRole, setUser} from "../../../utils/tools";


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
const freeTicketType = {
    0: "全部免费",
    1: "比赛",
    2: "联赛"
}

class FreeTicketModifyDialog extends React.Component {
    state = {
        loading: false,
        userloading: false,
        data: [],
        leaguedata: [],
        userdata: [],
        match: {},
        league: {},
        user: {}
    }
    isCompositions = true;
    isLeagueCompositions = true;
    isUserCompositions = true;

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        this.fetchUser();
        this.fetchMatch();
        this.fetchLeague();
    }
    fetchUser = () => {
        const {record} = this.props
        getUserByUserNo({userNo: record.userNo}).then(userData => {
            if (userData && userData.code == 200) {
                this.setState({user: userData.data})
            } else {
                message.error('获取用户信息失败：' + (userData ? userData.code + ":" + userData.message : userData), 3);
            }
        })
    }
    fetchLeague = () => {
        const {record} = this.props
        if (record.externalId && record.type == 2) {
            getLeagueMatchById(record.externalId).then(data => {
                if (data && data.code == 200) {
                    this.setState({league: data.data})
                } else {
                    message.error('获取联赛信息失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            })
        }
    }
    fetchMatch = () => {
        const {record} = this.props
        if (record.externalId && record.type == 1) {
            getMatchById(record.externalId).then(data => {
                if (data && data.code == 200) {
                    this.setState({match: data.data})
                } else {
                    message.error('获取比赛信息失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            })
        }
    }
    fetchMatchs = (searchText, pageNum) => {
        this.setState({
            loading: true,
        });
        getAllMatchs({pageSize: 20, pageNum: pageNum, name: searchText}).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    data: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.data.concat(data.data.records) : []),
                    loading: false,
                    pageNum: data.data.current,
                    pageSize: data.data.size,
                    pageTotal: data.data.total,
                });
            } else {
                message.error('获取比赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleChange = (value) => {
        this.setState({currentMatch: value});
        const {form} = this.props;
        this.state.data && this.state.data.forEach(item => {
            if (item.id == value) {
                form.setFieldsValue({externalId: item.id})
            }
        });
    }
    handleShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.data.length) {
            this.handleOnLoadMore(e);
        }
    }
    handleOnLoadMore = (e) => {
        let data = this.state.data;
        e.target.scrollTop = data.length * 50;
        if (this.state.loading) {
            return;
        }
        if (data.length > this.state.pageTotal) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchMatchs(this.state.searchText, this.state.pageNum + 1);
    }
    handleSearch = (e) => {
        const value = e.target.value;
        this.setState({searchText: value});
        // setTimeout(()=>{
        if (this.isCompositions) {
            this.fetchMatchs(value, 1);
        }
        // },100);
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onInputCompositionStart = () => {
        this.isCompositions = false;
    }
    onInputCompositionEnd = () => {
        this.isCompositions = true;
        this.fetchMatchs(this.state.searchText, 1);
    }

    fetchLeagues = (searchText, pageNum) => {
        this.setState({
            loading: true,
        });
        getAllLeagueMatchs({pageSize: 20, pageNum: pageNum, name: searchText}).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    leaguedata: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.leaguedata.concat(data.data.records) : []),
                    loading: false,
                    leaguePageNum: data.data.current,
                    leaguePageSize: data.data.size,
                    leaguePageTotal: data.data.total,
                });
            } else {
                message.error('获取联赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleLeagueChange = (value) => {
        this.setState({currentLeague: value});
        const {form} = this.props;
        this.state.leaguedata && this.state.leaguedata.forEach(item => {
            if (item.id == value) {
                form.setFieldsValue({externalId: item.id})
            }
        });
    }
    handleLeagueShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.leaguedata.length) {
            this.handleLeagueOnLoadMore(e);
        }
    }
    handleLeagueOnLoadMore = (e) => {
        let data = this.state.leaguedata;
        e.target.scrollTop = data.length * 50;
        if (this.state.loading) {
            return;
        }
        if (data.length > this.state.leaguePageTotal) {
            this.setState({
                leagueHasMore: false,
                loading: false,
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
    fetchUsers = (searchText, pageNum) => {
        this.setState({
            userloading: true,
        });
        getAllUser({pageSize: 20, pageNum: pageNum, name: encodeURIComponent(searchText), exactByName: true}).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    userdata: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.userdata.concat(data.data.records) : []),
                    userloading: false,
                    userPageNum: data.data.current,
                    userPageSize: data.data.size,
                    userPageTotal: data.data.total,
                });
            } else {
                message.error('获取用户列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleUserChange = (value) => {
        this.setState({currentUser: value});
        const {form} = this.props;
        this.state.userdata && this.state.userdata.forEach(item => {
            if (item.userNo == value) {
                form.setFieldsValue({userNo: item.userNo})
            }
        });
    }
    handleUserShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.userdata.length) {
            this.handleUserOnLoadMore(e);
        }
    }
    handleUserOnLoadMore = (e) => {
        let data = this.state.userdata;
        e.target.scrollTop = data.length * 50;
        if (this.state.userloading) {
            return;
        }
        if (data.length > this.state.userPageTotal) {
            this.setState({
                userHasMore: false,
                userloading: false,
            });
            return;
        }
        this.fetchUsers(this.state.userSearchText, this.state.userPageNum + 1);
    }
    handleUserSearch = (e) => {
        const value = e.target.value;
        this.setState({userSearchText: value});
        // setTimeout(()=>{
        if (this.isUserCompositions) {
            this.fetchUsers(value, 1);
        }
        // },100);
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onUserInputCompositionStart = () => {
        this.isUserCompositions = false;
    }
    onUserInputCompositionEnd = () => {
        this.isUserCompositions = true;
        this.fetchUsers(this.state.userSearchText, 1);
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const currentMatch = this.state.match;
        const currentLeague = this.state.league;
        const currentUser = this.state.user;
        const options = this.state.data.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.name + "-" + d.startTime}>
                {(d.hostTeam == null || d.guestTeam == null) ?
                    <span>{d.name}</span>
                    : <div className="center">
                        <Avatar src={d.hostTeam ? d.hostTeam.headImg : defultAvatar}/>
                        <p className="ml-s">{d.hostTeam ? d.hostTeam.name : ""}</p>
                        <p className="ml-s mr-s">{d.score}</p>
                        <Avatar src={d.guestTeam ? d.guestTeam.headImg : defultAvatar}/>
                        <p className="ml-s">{d.guestTeam ? d.guestTeam.name : ""}</p>
                    </div>}
            </Tooltip>
        </Option>);
        const leagueOptions = this.state.leaguedata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <div className="center">
                <Avatar src={d ? d.headImg : logo}/>
                <p className="ml-s">{d ? d.name : ""}</p>
            </div>
        </Option>);
        const userOptions = this.state.userdata.map(d => <Option style={{height: 50}} key={d.userNo} value={d.userNo}>
            <div className="center">
                <Avatar src={d ? d.avatar : defultAvatar}/>
                <p className="ml-s">{d ? d.name : ""}</p>
            </div>
        </Option>);
        const matchSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>关联比赛</span>
            </div>
            <Select
                showSearch
                style={{minWidth: 300}}
                placeholder="按名称搜索并选择"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange}
                onPopupScroll={this.handleShowMore}
                notFoundContent={null}
                // mode="tags"
                // loading={this.state.loading}
                getInputElement={() => (
                    <input onInput={this.handleSearch}
                           onCompositionStart={this.onInputCompositionStart}
                           onCompositionEnd={this.onInputCompositionEnd}/>)}
            >
                {options}
            </Select>
            <div className="center w-full">
                <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                      hidden={!this.state.loading}/>
            </div>
            <div className="center w-full">
                {(currentMatch.hostTeam == null || currentMatch.guestTeam == null) ?
                    <Tooltip
                        title={currentMatch.name + "-" + currentMatch.startTime}><span>{currentMatch.name}</span></Tooltip>
                    : <Tooltip title={currentMatch.name + "-" + currentMatch.startTime}>
                        <div className="center">
                            <Avatar
                                src={currentMatch.hostTeam ? currentMatch.hostTeam.headImg : defultAvatar}/>
                            <p className="ml-s">{currentMatch.hostTeam ? currentMatch.hostTeam.name : ""}</p>
                            <p className="ml-s mr-s">{currentMatch.score}</p>
                            <Avatar
                                src={currentMatch.guestTeam ? currentMatch.guestTeam.headImg : defultAvatar}/>
                            <p className="ml-s">{currentMatch.guestTeam ? currentMatch.guestTeam.name : ""}</p>
                        </div>
                    </Tooltip>}
            </div>
            {currentMatch == null ? <div className="center w-full"><span>暂未关联比赛</span></div> : null}
        </div>;

        const leagueSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>关联联赛</span>
            </div>
            <Select
                showSearch
                style={{minWidth: 300}}
                placeholder="按名称搜索并选择"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleLeagueChange}
                onPopupScroll={this.handleLeagueShowMore}
                notFoundContent={null}
                // mode="tags"
                // loading={this.state.loading}
                getInputElement={() => (
                    <input onInput={this.handleLeagueSearch}
                           onCompositionStart={this.onLeagueInputCompositionStart}
                           onCompositionEnd={this.onLeagueInputCompositionEnd}/>)}
            >
                {leagueOptions}
            </Select>
            <div className="center w-full">
                <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                      hidden={!this.state.loading}/>
            </div>
            {currentLeague.name ? <div className="center w-full">
                <div className="center">
                    <Avatar
                        src={currentLeague ? currentLeague.headImg : logo}/>
                    <p className="ml-s">{currentLeague ? currentLeague.name : ""}</p>
                </div>
            </div> : null}
            {currentLeague == null ? <div className="center w-full"><span>暂未关联联赛</span></div> : null}
        </div>

        const userSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>关联用户</span>
            </div>
            <Select
                showSearch
                style={{minWidth: 300}}
                placeholder="按名字搜索并选择"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleUserChange}
                onPopupScroll={this.handleUserShowMore}
                notFoundContent={null}
                // mode="tags"
                // loading={this.state.loading}
                getInputElement={() => (
                    <input onInput={this.handleUserSearch}
                           onCompositionStart={this.onUserInputCompositionStart}
                           onCompositionEnd={this.onUserInputCompositionEnd}/>)}
            >
                {userOptions}
            </Select>
            <div className="center w-full">
                <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                      hidden={!this.state.userloading}/>
            </div>
            {currentUser.name ? <div className="center w-full">
                <div className="center">
                    <Avatar
                        src={currentUser ? currentUser.avatar : defultAvatar}/>
                    <p className="ml-s">{currentUser ? currentUser.name : ""}</p>
                </div>
            </div> : null}
            {currentUser == null ? <div className="center w-full"><span>暂未关联用户</span></div> : null}
        </div>

        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="是否启用" className="bs-form-item">
                        {getFieldDecorator('enabled', {
                            initialValue: record.enabled,
                            rules: [{required: true, message: '请选择!'}],
                        })(
                            <Select placeholder="请选择!">
                                <Option value={true}>启用</Option>
                                <Option value={false}>禁用</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type,
                            rules: [{required: true, message: '请选择类型!'}],
                        })(
                            <Select placeholder="请选择类型!">
                                <Option value={0}>全部免费</Option>
                                <Option value={1}>比赛</Option>
                                <Option value={2}>联赛</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            initialValue: record.userNo,
                            rules: [{required: true, message: '请输入用户id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    {userSelect}
                    {form.getFieldValue("type") != 0 ?
                        <FormItem {...formItemLayout} className="bs-form-item">
                            {getFieldDecorator('externalId', {
                                initialValue: record.externalId,
                                rules: [{required: true, message: '请输入id!'}],
                            })(
                                <Input hidden placeholder='请输入id!'/>
                            )}
                        </FormItem> : null}
                    {form.getFieldValue("type") == 1 ?
                        matchSelect : null}
                    {form.getFieldValue("type") == 2 ?
                        leagueSelect : null}
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <div className="mt-s">
                        <span className="danger">设置所有免费及联赛免费有5分钟延迟，请注意！</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(FreeTicketModifyDialog);