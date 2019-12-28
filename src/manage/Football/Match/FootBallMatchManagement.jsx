import React from 'react';
import {Row, Col, Card, Button} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import FootBallMatchTable from "./FootBallMatchTable";
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getQueryString} from "../../../utils";

class FootBallMatchManagement extends React.Component {
    render() {
        const currentLeague = getQueryString(this.props.location.search, "leagueId");
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球赛管理" second="球赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card className={this.props.responsive.data.isMobile?"no-padding":""} bordered={false}>
                                <FootBallMatchTable leagueId={currentLeague}/>
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
    console.log(state)

    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchManagement);