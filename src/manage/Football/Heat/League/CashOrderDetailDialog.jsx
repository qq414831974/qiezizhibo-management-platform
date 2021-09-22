import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Icon,
    TreeSelect, Select, Tooltip, message, Avatar, Descriptions, Button, Modal
} from 'antd';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from "moment";
import {
    getLeaguePlayerCashOutVerifyInfo,
    passLeaguePlayerCashOrder,
    failLeaguePlayerCashOrder
} from "../../../../axios";
import defultAvatar from "../../../../static/avatar.jpg";
import logo from "../../../../static/logo.png";
import NP from 'number-precision'

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

class CashOrderDetailDialog extends React.Component {
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
        this.refresh();
    }

    refresh = () => {
        this.setState({loading: true});
        const id = this.props.id;
        getLeaguePlayerCashOutVerifyInfo({id: id}).then((data) => {
            if (data && data.data) {
                this.setState({
                    loading: false,
                    data: data.data,
                });
            } else {
                message.error('获取订单信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    getStatusText = (status) => {
        let text = ""
        switch (status) {
            case -1:
                text = "已创建";
                break;
            case 0:
                text = "处理中";
                break;
            case 1:
                text = "成功";
                break;
            case 2:
                text = "需要重试";
                break;
            case 3:
                text = "失败";
                break;
            case 4:
                text = "关闭";
                break;
        }
        return text;
    }
    getYuan = (cash) => {
        if (cash) {
            return NP.divide(cash, 100);
        }
        return 0;
    }
    getVerifyStatus = (record) => {
        let type = "未审核";
        let color = ""
        switch (record.cashOutVerifyStatus) {
            case -1:
                type = "不通过"
                color = "error"
                break;
            case 0:
                type = "未审核"
                color = "warn"
                break;
            case 1:
                type = "审核通过"
                color = "primary"
                break;
        }
        return <span className={`${color} pa-m`}
                     style={{
                         fontSize: 16,
                         fontWeight: 'bold'
                     }}>
            {type}
        </span>;
    }
    passCash = () => {
        this.setState({confrimLoading: true});
        const id = this.props.id;
        passLeaguePlayerCashOrder({id: id}).then((data) => {
            if (data && data.data) {
                this.setState({
                    confrimLoading: false,
                    dialogConfirmVisible: false,
                });
                message.success('操作成功', 3);
                this.refresh();
            } else {
                message.error('操作失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    failCash = () => {
        this.setState({confrimLoading: true});
        const id = this.props.id;
        failLeaguePlayerCashOrder({id: id}).then((data) => {
            if (data && data.data) {
                this.setState({
                    confrimLoading: false,
                    dialogConfirmVisible: false,
                });
                message.success('操作成功', 3);
                this.refresh();
            } else {
                message.error('操作失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    onPassClick = () => {
        this.setState({dialogConfirmVisible: true, confirmFunc: this.passCash, confirmText: "通过后将会发起提现，无法撤销，是否确认？"})
    }
    onFailClick = () => {
        this.setState({dialogConfirmVisible: true, confirmFunc: this.failCash, confirmText: "不通过后提现金额将会返还至用户，是否确认？"})
    }
    handleConfirmCancel = () => {
        this.setState({dialogConfirmVisible: false, confirmFunc: null, confirmText: null})
    }
    handleConfirm = () => {
        this.state.confirmFunc && this.state.confirmFunc();
    }

    render() {
        const {visible} = this.props;
        return (
            visible ?
                <div>
                    <div className="w-full center">
                        {this.getVerifyStatus(this.state.data)}
                    </div>
                    <Descriptions column={1} bordered title="金额">
                        <Descriptions.Item label="金额" className="danger">
                            <span className="danger">
                                {this.state.data && this.state.data.cashOut ? this.getYuan(this.state.data.cashOut) : 0}（元）
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="预提现" className="danger">
                            <span className="danger">
                                {this.state.data && this.state.data.isPreCash ? "是" : "否"}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="提交时间">
                            <span>
                                {this.state.data && this.state.data.cashOutCreateDate ? this.state.data.cashOutCreateDate : "未知"}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions column={1} bordered title={<div className="center">
                        <Avatar
                            src={this.state.data && this.state.data.user && this.state.data.user.avatar ? this.state.data.user.avatar : defultAvatar}/>
                        <span className="ml-s">
                            {this.state.data && this.state.data.user && this.state.data.user.name ? this.state.data.user.name : "用户"}
                        </span>
                    </div>}>
                        <Descriptions.Item label="用户姓名">
                            {this.state.data && this.state.data.userIdentity && this.state.data.userIdentity.name ? this.state.data.userIdentity.name : "无"}
                        </Descriptions.Item>
                        <Descriptions.Item label="用户身份证">
                            {this.state.data && this.state.data.userIdentity && this.state.data.userIdentity.idCard ? this.state.data.userIdentity.idCard : "无"}
                        </Descriptions.Item>
                        <Descriptions.Item label="用户手机号">
                            {this.state.data && this.state.data.user && this.state.data.user.phone ? this.state.data.user.phone : "无"}
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions column={1} bordered title={<div className="center">
                        <Avatar
                            src={this.state.data && this.state.data.player && this.state.data.player.headImg ? this.state.data.player.headImg : defultAvatar}/>
                        <span className="ml-s">
                            {this.state.data && this.state.data.player && this.state.data.player.name ? this.state.data.player.name : "球员"}
                        </span>
                    </div>}>
                        <Descriptions.Item label="球员身份证">
                            {this.state.data && this.state.data.player && this.state.data.player.idCard ? this.state.data.player.idCard : "无"}
                        </Descriptions.Item>
                        <Descriptions.Item label="是否与用户绑定">
                            {this.state.data && this.state.data.isUserPlayerCorrect ? "是" : "否"}
                        </Descriptions.Item>
                        {this.state.data && this.state.data.isPreCash ? null :
                            <Descriptions.Item label="是否在规定时间内验证">
                                {this.state.data && this.state.data.settlementVerify && this.state.data.settlementVerify.available ? "是" : "否"}
                            </Descriptions.Item>}
                    </Descriptions>
                    <Descriptions column={1} bordered title="提现详情">
                        {this.state.data && this.state.data.cashSettlementTotal != null ?
                            <Descriptions.Item label="可提现总额">
                                {this.state.data && this.state.data.cashSettlementTotal ? this.getYuan(this.state.data.cashSettlementTotal) : 0}
                            </Descriptions.Item> : null}
                        {this.state.data && this.state.data.cashPredictTotal != null ?
                            <Descriptions.Item label="可预提现总额">
                                {this.state.data && this.state.data.cashPredictTotal ? this.getYuan(this.state.data.cashPredictTotal) : 0}
                            </Descriptions.Item> : null}
                        <Descriptions.Item label="已提现金额">
                            {this.state.data && this.state.data.cashSettled ? this.getYuan(this.state.data.cashSettled) : 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="正在微信提现的金额">
                            {this.state.data && this.state.data.cashSettling ? this.getYuan(this.state.data.cashSettling) : 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="审核中的提现金额">
                            {this.state.data && this.state.data.cashSettlementVerifying ? this.getYuan(this.state.data.cashSettlementVerifying) : 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="用户今天的提现总额">
                            {this.state.data && this.state.data.todayAmount ? this.getYuan(this.state.data.todayAmount) : 0}
                        </Descriptions.Item>
                    </Descriptions>
                    {this.state.data && this.state.data.cashOutOrder ?
                        <Descriptions column={1} bordered title="提现订单">
                            <Descriptions.Item label="订单号">
                                {this.state.data && this.state.data.cashOutOrder ? this.state.data.cashOutOrder.id : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="订单状态">
                                {this.state.data && this.state.data.cashOutOrder ? this.getStatusText(this.state.data.cashOutOrder.cashStatus) : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="提现金额" className="danger">
                                {this.state.data && this.state.data.cashOutOrder ? this.getYuan(this.state.data.cashOutOrder.cashOut) : 0}
                            </Descriptions.Item>
                        </Descriptions>
                        : null}
                    {this.state.data && this.state.data.cashOutVerifyStatus == 0 ? <div className="w-full center mt-l">
                        <Button
                            type="primary" loading={this.state.confrimLoading}
                            disabled={this.state.confrimLoading}
                            onClick={this.onPassClick}>
                            通过
                        </Button>
                        <Button
                            loading={this.state.confrimLoading}
                            disabled={this.state.confrimLoading}
                            onClick={this.onFailClick}>
                            不通过
                        </Button>
                    </div> : null}
                    <Modal
                        title="是否确认"
                        visible={this.state.dialogConfirmVisible}
                        footer={[
                            <Button key="back" onClick={this.handleConfirmCancel}>关闭</Button>,
                            <Button key="submit" type="primary" onClick={this.handleConfirm}>确定</Button>,
                        ]}
                        destroyOnClosw
                        onCancel={this.handleConfirmCancel}>
                        <span className="danger">{this.state.confirmText}</span>
                    </Modal>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashOrderDetailDialog);