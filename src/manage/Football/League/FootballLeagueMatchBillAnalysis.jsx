import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Avatar} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../utils";
import {
    getLeagueMatchById,
    getLeagueBillAnalysisGift,
    getLeagueBillAnalysisCharge,
} from "../../../axios";
import defultAvatar from "../../../static/avatar.jpg";

const TabPane = Tabs.TabPane;

class FootballLeagueMatchBillAnalysis extends React.Component {
    state = {
        data: {},
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        this.fetch({leagueId: currentLeague})
    }
    fetch = (params = {}) => {
        getLeagueMatchById(params.leagueId).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
        getLeagueBillAnalysisGift(params).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    giftBill: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛礼物收益信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
        getLeagueBillAnalysisCharge(params).then(data => {
            if (data && data.code == 200) {
                this.setState({
                    chargeBill: data.data ? data.data : {},
                });
            } else {
                message.error('获取联赛视频收益信息失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        })
    }

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="联赛" second="联赛收益"/>
                <Card title={<div className="center purple-light pt-s pb-s pl-m pr-m border-radius-10px">
                    <Avatar src={this.state.data.headImg ? this.state.data.headImg : defultAvatar}/>
                    <span className="ml-s">{this.state.data.name}</span>
                </div>}>
                    {this.state.giftBill ? <div>
                        <h3>礼物收益：</h3>
                        <div>{`线上支付：${this.state.giftBill ? this.state.giftBill.online / 100 : 0}`}</div>
                        <div>{`余额支付：${this.state.giftBill ? this.state.giftBill.deposit / 100 : 0}`}</div>
                    </div> : null}
                    {this.state.chargeBill ? <div>
                        <h3>视频收益：</h3>
                        <div>{`线上支付：${this.state.chargeBill ? this.state.chargeBill.online / 100 : 0}`}</div>
                        <div>{`余额支付：${this.state.chargeBill ? this.state.chargeBill.deposit / 100 : 0}`}</div>
                    </div> : null}
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    console.log(state)

    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootballLeagueMatchBillAnalysis);