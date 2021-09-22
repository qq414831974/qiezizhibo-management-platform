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

class LeaguePlayerCashSettlementDialog extends React.Component {
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
    }

    render() {
        const {visible, form, record, heatRule = {}, target = {}} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <div className="center">
                        <Avatar src={target && target.headImg ? target.headImg : logo}/>
                        <span className="ml-s">
                            {target ? target.name : "未知"}
                        </span>
                    </div>
                    <FormItem className="bs-form-item mt-s">
                        {getFieldDecorator('cashTotal', {
                            initialValue: record.cashTotal ? NP.divide(record.cashTotal, 100) : null,
                            rules: [{required: true, message: '请输入提现金额!'}],
                        })(
                            <InputNumber className="w-full" placeholder="请输入提现金额"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('playerId', {
                            initialValue: record.playerId,
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('leagueId', {
                            initialValue: record.leagueId,
                        })(
                            <Input hidden/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} hidden className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id,
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

export default connect(mapStateToProps, mapDispatchToProps)(LeaguePlayerCashSettlementDialog);