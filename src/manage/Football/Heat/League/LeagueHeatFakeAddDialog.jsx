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
import defultAvatar from "../../../../static/avatar.jpg";
import logo from "../../../../static/logo.png";
import {getAllUser, getGifts} from "../../../../axios";


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

class LeagueHeatFakeAddDialog extends React.Component {
    state = {
        loading: false,
        userloading: false,
        giftloading: false,
        userdata: [],
        giftdata: [],
        user: {},
        gift: {}
    }
    isCompositions = true;
    isUserCompositions = true;
    isGiftCompositions = true;

    componentDidMount() {
        this.fetchGifts(null, 1);
    }

    fetchGifts = (searchText, pageNum) => {
        this.setState({
            giftloading: true,
        });
        getGifts({pageSize: 20, pageNum: pageNum, name: searchText, type: 1, wechatType: 0}).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    giftdata: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.giftdata.concat(data.data.records) : []),
                    giftloading: false,
                    giftPageNum: data.data.current,
                    giftPageSize: data.data.size,
                    giftPageTotal: data.data.total,
                });
            } else {
                message.error('获取礼物列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleGiftChange = (value) => {
        this.setState({currentGift: value});
        const {form} = this.props;
        this.state.giftdata && this.state.giftdata.forEach(item => {
            if (item.id == value) {
                form.setFieldsValue({giftId: item.id})
            }
        });
    }
    handleGiftShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.giftdata.length) {
            this.handleGiftOnLoadMore(e);
        }
    }
    handleGiftOnLoadMore = (e) => {
        let data = this.state.giftdata;
        e.target.scrollTop = data.length * 50;
        if (this.state.giftloading) {
            return;
        }
        if (data.length > this.state.giftPageTotal) {
            this.setState({
                giftHasMore: false,
                giftloading: false,
            });
            return;
        }
        this.fetchGifts(this.state.giftSearchText, this.state.giftPageNum + 1);
    }
    handleGiftSearch = (e) => {
        const value = e.target.value;
        this.setState({giftSearchText: value});
        // setTimeout(()=>{
        if (this.isGiftCompositions) {
            this.fetchGifts(value, 1);
        }
        // },100);
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onGiftInputCompositionStart = () => {
        this.isGiftCompositions = false;
    }
    onGiftInputCompositionEnd = () => {
        this.isGiftCompositions = true;
        this.fetchGifts(this.state.giftSearchText, 1);
    }
    fetchUsers = (searchText, pageNum) => {
        this.setState({
            userloading: true,
        });
        getAllUser({pageSize: 20, pageNum: pageNum, name: searchText, wechatType: 0}).then((data) => {
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
    getGiftGrowthTip = (record) => {
        let growthToolTip = [];
        if (record.growth != null) {
            let domKey = 0;
            record.growth.forEach((value) => {
                domKey = domKey + 1;
                let type = "未知";
                switch (value.type) {
                    case 1:
                        type = "用户经验";
                        break;
                    case 2:
                        type = "球队热度";
                        break;
                    case 3:
                        type = "球员热度";
                        break;
                }
                growthToolTip.push(<p key={domKey}>{`${type}+${value.growth}`}</p>)
            })
        }
        return growthToolTip;
    }

    render() {
        const {visible, form, record, heatRule = {}, target = {}} = this.props;
        const {getFieldDecorator} = form;
        const currentUser = this.state.user;
        const currentGift = this.state.gift;

        const giftOptions = this.state.giftdata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={this.getGiftGrowthTip(d)}>
                <div className="center">
                    <Avatar src={d ? d.pic : defultAvatar}/>
                    <p className="ml-s">{d ? d.name : ""}</p>
                </div>
            </Tooltip>
        </Option>);
        const giftSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>选择礼物</span>
            </div>
            <Select
                showSearch
                style={{minWidth: 300}}
                placeholder="按名字搜索并选择"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleGiftChange}
                onPopupScroll={this.handleGiftShowMore}
                notFoundContent={null}
                // mode="tags"
                // loading={this.state.loading}
                getInputElement={() => (
                    <input onInput={this.handleGiftSearch}
                           onCompositionStart={this.onGiftInputCompositionStart}
                           onCompositionEnd={this.onGiftInputCompositionEnd}/>)}
            >
                {giftOptions}
            </Select>
            <div className="center w-full">
                <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                      hidden={!this.state.giftloading}/>
            </div>
            {currentGift.name ? <div className="center w-full">
                <div className="center">
                    <Avatar
                        src={currentGift ? currentGift.pic : defultAvatar}/>
                    <p className="ml-s">{currentGift ? currentGift.name : ""}</p>
                </div>
            </div> : null}
            {currentGift == null ? <div className="center w-full"><span>暂未选择礼物</span></div> : null}
        </div>

        const userOptions = this.state.userdata.map(d => <Option style={{height: 50}} key={d.userNo} value={d.userNo}>
            <div className="center">
                <Avatar src={d ? d.avatar : defultAvatar}/>
                <p className="ml-s">{d ? d.name : ""}</p>
            </div>
        </Option>);
        const userSelect = <div>
            <div className="center w-full">
                <span style={{fontSize: 16, fontWeight: 'bold'}}>选择用户</span>
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
            {currentUser == null ? <div className="center w-full"><span>暂未选择用户</span></div> : null}
        </div>

        return (
            visible ?
                <Form>
                    <div className="center">
                        <Avatar src={target && target.headImg ? target.headImg : logo}/>
                        <span className="ml-s">
                            {target ? `${target.name}${target.shirtNum ? `(${target.shirtNum}号)` : ""}` : "未知"}
                        </span>
                    </div>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            rules: [{required: true, message: '请输入用户id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    {userSelect}
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('leagueId', {
                            initialValue: record.leagueId,
                            rules: [{required: true, message: '请输入联赛id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('targetType', {
                            initialValue: heatRule.type,
                            rules: [{required: true, message: '请输入目标类型!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('externalId', {
                            initialValue: heatRule.type == 2 ? record.playerId : record.teamId,
                            rules: [{required: true, message: '请输入目标id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('giftId', {
                            rules: [{required: true, message: '请输入礼物id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    {giftSelect}
                    <FormItem {...formItemLayout} label="礼物数量" className="bs-form-item">
                        {getFieldDecorator('num', {
                            initialValue: 1,
                            rules: [{required: true, message: '请输入礼物数量!'}],
                        })(
                            <InputNumber/>
                        )}
                    </FormItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueHeatFakeAddDialog);