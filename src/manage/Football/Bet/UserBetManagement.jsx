import React from 'react';
import {Row, Col, Card,} from 'antd';
import UserBetTable from './UserBetTable';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../utils";


class UserBetManagement extends React.Component {
    switchPage = (page) => {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        if (currentMatch != null) {
            this.props.history.replace(`/pay/bet?matchId=${currentMatch}&page=${page}`)
        } else {
            this.props.history.replace(`/pay/bet?page=${page}`)
        }

        if (currentLeague != null) {
            this.props.history.replace(`/pay/bet?leagueId=${currentLeague}&page=${page}`)
        } else {
            this.props.history.replace(`/pay/bet?page=${page}`)
        }
    }

    render() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        const currentMatch = getQueryString(this.props.location.search, "matchId");
        const currentPage = getQueryString(this.props.location.search, "page");

        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="用户竞猜管理"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <UserBetTable
                                    leagueId={currentLeague}
                                    matchId={currentMatch}
                                    switchPage={this.switchPage}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserBetManagement);