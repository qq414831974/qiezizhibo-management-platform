import React from 'react';
import {Row, Col, Card, Button, Tabs, message, Form, Avatar} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../../utils";
import {
    getLeagueMatchById,
    getLeagueBillAnalysisGift,
    getLeagueBillAnalysisCharge,
} from "../../../../axios";
import defultAvatar from "../../../../static/avatar.jpg";

const TabPane = Tabs.TabPane;

class FootballLeagueMatchBillAnalysis extends React.Component {
    state = {
        data: {},
        chargeBillShow: true, giftBillShow: true
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        let currentLeague;
        if (this.props.location) {
            currentLeague = getQueryString(this.props.location.search, "leagueId");
        } else {
            currentLeague = this.props.leagueId;
        }
        this.fetch({leagueId: currentLeague})
    }
    fetch = (params = {}) => {
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
                <Card>
                    {this.state.chargeBill && this.state.chargeBillShow ? <div className="mt-l mb-l">
                        <h3>视频收益</h3>
                        <div>{`线上支付：${this.state.chargeBill ? this.state.chargeBill.online / 100 : 0}`}</div>
                        <div>{`余额支付：${this.state.chargeBill ? this.state.chargeBill.deposit / 100 : 0}`}</div>
                    </div> : null}

                    {this.state.giftBill && this.state.giftBillShow ? <div className="mt-l mb-l">
                        <h3>礼物收益：</h3>
                        <div>{`线上支付：${this.state.giftBill ? this.state.giftBill.online / 100 : 0}`}</div>
                        <div>{`余额支付：${this.state.giftBill ? this.state.giftBill.deposit / 100 : 0}`}</div>
                    </div> : null}
                    <div className="mt-l">
                        <Button onClick={() => {
                            this.setState({chargeBillShow: !this.state.chargeBillShow})
                        }}>显示/隐藏视频收益</Button>
                        <Button onClick={() => {
                            this.setState({giftBillShow: !this.state.giftBillShow})
                        }}>显示/隐藏礼物收益</Button>
                    </div>
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