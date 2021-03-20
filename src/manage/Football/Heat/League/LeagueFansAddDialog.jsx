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
import {getTeamInLeague, getAllAdminUser} from "../../../../axios";
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

class LeagueFansAddDialog extends React.Component {
    state = {
        loading: false,
        userloading: false,
        data: [],
        teamdata: [],
        userdata: [],
        match: {},
        team: {},
        user: {}
    }
    isCompositions = true;
    isTeamCompositions = true;
    isUserCompositions = true;

    componentDidMount() {
        this.fetchTeams();
    }

    fetchTeams = () => {
        this.setState({
            loading: true,
        });
        getTeamInLeague(this.props.leagueId).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    teamdata: data.data.records,
                    loading: false,
                });
            } else {
                message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleTeamChange = (value) => {
        this.setState({currentTeam: value});
        const {form} = this.props;
        this.state.teamdata && this.state.teamdata.forEach(item => {
            if (item.id == value) {
                form.setFieldsValue({teamId: item.id})
            }
        });
    }
    fetchUsers = (searchText, pageNum) => {
        this.setState({
            userloading: true,
        });
        getAllAdminUser({pageSize: 20, pageNum: pageNum, name: searchText, wechatType: 0}).then((data) => {
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
        const currentTeam = this.state.team;
        const currentUser = this.state.user;

        const teamOptions = this.state.teamdata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
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

        const teamSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>选择队伍</span>
            </div>
            <Select
                style={{minWidth: 300}}
                placeholder="选择队伍"
                loading={this.state.loading}
                onChange={this.handleTeamChange}
            >
                {teamOptions}
            </Select>
            <div className="center w-full">
                <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                      hidden={!this.state.loading}/>
            </div>
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
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('teamId', {
                            rules: [{required: true, message: '请输入队伍id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('leagueId', {
                            initialValue: this.props.leagueId,
                            rules: [{required: true, message: '请输入联赛id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    {userSelect}
                    {teamSelect}
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueFansAddDialog);