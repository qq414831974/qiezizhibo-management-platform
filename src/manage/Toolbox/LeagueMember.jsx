import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Icon,
    TreeSelect, Select, Tooltip, message, Avatar,
} from 'antd';
import {getAllMatchs, getAllLeagueMatchs, getAllUser} from "../../axios";
import defultAvatar from "../../static/avatar.jpg";


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

class LeagueMember extends React.Component {
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
    isUserCompositions = true;

    componentDidMount() {
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
        const currentUser = this.state.user;
        const userOptions = this.state.userdata.map(d => <Option style={{height: 50}} key={d.userNo} value={d.userNo}>
            <div className="center">
                <Avatar src={d ? d.avatar : defultAvatar}/>
                <p className="ml-s">{d ? d.name : ""}</p>
            </div>
        </Option>);

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
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            rules: [{required: true, message: '请输入用户id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    {userSelect}
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('leagueId', {
                            rules: [{required: true, message: '请输入id!'}],
                            initialValue: this.props.leagueId,
                        })(
                            <Input hidden placeholder='请输入id!'/>
                        )}
                    </FormItem>
                </Form>
                :
                null
        );
    }
}

export default LeagueMember;