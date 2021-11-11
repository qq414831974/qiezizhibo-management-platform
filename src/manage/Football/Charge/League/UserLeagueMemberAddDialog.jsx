import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Icon,
    TreeSelect, Select, Tooltip, message, Avatar,
} from 'antd';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import {getAllMatchs, getAllLeagueMatchs, getAllUser} from "../../../../axios";
import defultAvatar from "../../../../static/avatar.jpg";
import logo from "../../../../static/logo.png";


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

class UserLeagueMemberAddDialog extends React.Component {
    state = {
        loading: false,
        userloading: false,
        data: [],
        leaguedata: [],
        userdata: [],
        match: {},
        league: {},
        user: {},
        userSearchOpen: false,
        leagueSearchOpen: false
    }
    isLeagueCompositions = true;
    isUserCompositions = true;

    componentDidMount() {
    }

    fetchLeagues = (searchText, pageNum, option) => {
        if (searchText == "" || (searchText != null && searchText.trim() == "")) {
            option = {status: 'live', sortField: 'dateBegin', sortOrder: 'desc'}
        }
        this.setState({
            loading: true,
        });
        getAllLeagueMatchs({pageSize: 20, pageNum: pageNum, name: searchText, ...option}).then((data) => {
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
                form.setFieldsValue({leagueId: item.id})
                this.setState({
                    leagueSearchText: null,
                    leaguedata: [],
                    loading: false,
                    leaguePageNum: 1,
                    leaguePageSize: 20,
                    leaguePageTotal: null,
                    leagueHasMore: false,
                })
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
    handleLeagueFocus = () => {
        this.setState({leagueSearchOpen: true})
        this.fetchLeagues(null, 1, {status: 'live', sortField: 'dateBegin', sortOrder: 'desc'});
    }
    handleLeagueBlur = () => {
        this.setState({
            leagueSearchOpen: false,
            leagueSearchText: null,
            leaguedata: [],
            loading: false,
            leaguePageNum: 1,
            leaguePageSize: 20,
            leaguePageTotal: null,
            leagueHasMore: false,
        })
    }
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
                this.setState({
                    userSearchText: null,
                    userdata: [],
                    userloading: false,
                    userPageNum: 1,
                    userPageSize: 20,
                    userPageTotal: null,
                    userHasMore: false,
                })
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
    handleUserFocus = () => {
        this.setState({userSearchOpen: true})
    }
    handleUserBlur = () => {
        this.setState({
            userSearchOpen: false,
            userSearchText: null,
            userdata: [],
            userloading: false,
            userPageNum: 1,
            userPageSize: 20,
            userPageTotal: null,
            userHasMore: false,
        })
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
        const currentUser = this.state.user;
        const currentLeague = this.state.league;
        const leagueOptions = this.state.leaguedata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <div className="center">
                <Avatar src={d ? d.headImg : logo}/>
                <p className="ml-s">{d ? (d.shortName ? d.shortName : d.name) : ""}</p>
            </div>
        </Option>);
        const userOptions = this.state.userdata.map(d => <Option style={{height: 50}} key={d.userNo} value={d.userNo}>
            <div className="center">
                <Avatar src={d ? d.avatar : defultAvatar}/>
                <p className="ml-s">{d ? d.name : ""}</p>
            </div>
        </Option>);
        const leagueSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>关联联赛</span>
            </div>
            <Select
                showSearch
                style={{minWidth: this.props.isToolbox ? null : 300}}
                placeholder="按名称搜索并选择"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleLeagueChange}
                onPopupScroll={this.handleLeagueShowMore}
                notFoundContent={null}
                onFocus={this.handleLeagueFocus}
                onBlur={this.handleLeagueBlur}
                open={this.state.leagueSearchOpen}
                defaultOpen={false}
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
                style={{minWidth: this.props.isToolbox ? null : 300}}
                placeholder="按名字搜索并选择"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleUserChange}
                onPopupScroll={this.handleUserShowMore}
                notFoundContent={null}
                onFocus={this.handleUserFocus}
                onBlur={this.handleUserBlur}
                open={this.state.userSearchOpen}
                defaultOpen={false}
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
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            rules: [{required: true, message: '请输入用户id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    {userSelect}
                    {this.props.isToolbox ? leagueSelect : null}
                    {this.props.isToolbox ? <FormItem {...formItemLayout} className="bs-form-item">
                            {getFieldDecorator('leagueId', {
                                rules: [{required: true, message: '请输入id!'}],
                            })(
                                <Input hidden placeholder='请输入id!'/>
                            )}
                        </FormItem>
                        : <FormItem {...formItemLayout} className="bs-form-item">
                            {getFieldDecorator('leagueId', {
                                rules: [{required: true, message: '请输入id!'}],
                                initialValue: this.props.leagueId,
                            })(
                                <Input hidden placeholder='请输入id!'/>
                            )}
                        </FormItem>}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserLeagueMemberAddDialog);