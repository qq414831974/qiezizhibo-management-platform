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
    getUserInfo,
    getMatchById,
    updateUserBet
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

class UserBetModifyDialog extends React.Component {
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
    }
    fetchUser = () => {
        const {record} = this.props
        getUserInfo({id: record.userNo, type: "userNo"}).then(userData => {
            if (userData && userData.code == 200) {
                this.setState({user: userData.data})
            } else {
                message.error('获取用户信息失败：' + (userData ? userData.code + ":" + userData.message : userData), 3);
            }
        })
    }
    fetchMatch = () => {
        const {record} = this.props
        if (record.matchId) {
            getMatchById(record.matchId).then(data => {
                if (data && data.code == 200) {
                    this.setState({match: data.data})
                } else {
                    message.error('获取比赛信息失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            })
        }
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        let gradeInfoDom = <div>
            <div>档位:{record.gradeInfo.grade}</div>
            <div>价格:{record.gradeInfo.price / 100}元</div>
            {record.gradeInfo.award ? <div>奖品:{record.gradeInfo.award}</div> :
                <div>奖品:{record.gradeInfo.awardDeposit / 100}茄币</div>}
        </div>;
        const match = record.match;
        const hostteam = match.hostteam;
        const guestteam = match.guestteam;
        let matchDom = null;
        let userDom = null;
        if (record.match) {
            if (hostteam == null || guestteam == null) {
                matchDom =
                    <Tooltip title={`比赛时间：${match.startTime}`}><span className="mb-s">{match.name}</span></Tooltip>
            } else {
                matchDom = <Tooltip title={`比赛时间：${match.startTime}`}>
                    <div className="center mb-s">
                        <Avatar src={hostteam.headImg ? hostteam.headImg : defultAvatar}/>
                        <p className="ml-s">{hostteam.name}</p>
                        <p className="ml-s mr-s">{`${match.status == -1 ? "VS" : match.score}`}</p>
                        <Avatar src={guestteam.headImg ? guestteam.headImg : defultAvatar}/>
                        <p className="ml-s">{guestteam.name}</p>
                    </div>
                </Tooltip>
            }
        }
        if (record.user) {
            userDom = <div className="center mb-s"><Avatar src={record.user.avatar ? record.user.avatar : logo}/>
                <p className="ml-s">{record.user.name}</p></div>;
        }
        return (
            visible ?
                <Form>
                    {userDom}
                    {matchDom}
                    <FormItem {...formItemLayout} label="状态" className="bs-form-item">
                        {getFieldDecorator('status', {
                            initialValue: record.status,
                            rules: [{required: true, message: '请选择状态!'}],
                        })(
                            <Select placeholder="请选择状态!">
                                <Option value={-1}>已竞猜，未出赛果</Option>
                                <Option value={0}>竞猜失败</Option>
                                <Option value={1}>竞猜成功，未发奖</Option>
                                <Option value={2}>竞猜成功，已发奖</Option>
                                <Option value={3}>竞猜成功，未发奖，放弃领奖（未填写地址）</Option>
                                <Option value={4}>竞猜取消</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="用户id" className="bs-form-item">
                        {getFieldDecorator('userNo', {
                            initialValue: record.userNo,
                            rules: [{required: true, message: '请输入用户id!'}],

                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <Tooltip title={gradeInfoDom}>
                        <FormItem {...formItemLayout} label="档次" className="bs-form-item">
                            {getFieldDecorator('grade', {
                                initialValue: record.grade,
                                rules: [{required: true, message: '请输入档次!'}],
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                    </Tooltip>
                    <FormItem {...formItemLayout} label="竞猜方式" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type,
                            rules: [{required: true, message: '请输入竞猜方式!'}],
                        })(
                            <Select placeholder="请选择状态!">
                                <Option value={0}>免费竞猜</Option>
                                <Option value={1}>收费竞猜</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="竞猜比分" className="bs-form-item">
                        {getFieldDecorator('score', {
                            initialValue: record.score,
                            rules: [{required: true, message: '请输入竞猜比分!'}],
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="订单号" className="bs-form-item">
                        {getFieldDecorator('orderId', {
                            initialValue: record.orderId,
                            rules: [{required: true, message: '请输入订单号!'}],
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="下单时间" className="bs-form-item">
                        {getFieldDecorator('betTime', {
                            initialValue: record.betTime,
                            rules: [{required: true, message: '请输入下单时间!'}],
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    {record.settleTime ? <FormItem {...formItemLayout} label="结算时间" className="bs-form-item">
                        {getFieldDecorator('settleTime', {
                            initialValue: record.settleTime,
                            rules: [{required: true, message: '请输入结算时间!'}],
                        })(
                            <Input disabled/>
                        )}
                    </FormItem> : null}
                    {record.settleExpireTime ? <FormItem {...formItemLayout} label="兑奖过期时间" className="bs-form-item">
                        {getFieldDecorator('settleExpireTime', {
                            initialValue: record.settleExpireTime,
                            rules: [{required: true, message: '请输入兑奖过期时间!'}],
                        })(
                            <Input disabled/>
                        )}
                    </FormItem> : null}
                    <FormItem {...formItemLayout} label="地址" className="bs-form-item">
                        {getFieldDecorator('address', {
                            initialValue: record.address,
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="快递单号" className="bs-form-item">
                        {getFieldDecorator('expressNo', {
                            initialValue: record.expressNo,
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                            rules: [{required: true, message: '请输入id!'}],
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('matchId', {
                            initialValue: record.matchId,
                            rules: [{required: true, message: '请输入比赛id!'}],
                        })(
                            <Input hidden/>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserBetModifyDialog);