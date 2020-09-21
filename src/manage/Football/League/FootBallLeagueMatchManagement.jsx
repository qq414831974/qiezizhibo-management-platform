import React from 'react';
import {Row, Col, Card, Button} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import FootBallLeagueMatchTable from "./FootBallLeagueMatchTable";
import {getQueryString} from "../../../utils";

class FootBallLeagueMatchManagement extends React.Component {
    switchPage = (page) => {
        this.props.history.replace(`/football/footballLeagueMatch?page=${page}`)
    }

    render() {
        const currentPage = getQueryString(this.props.location.search, "page");
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球赛管理" second="联赛"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <FootBallLeagueMatchTable
                                    page={currentPage}
                                    switchPage={this.switchPage}/>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FootBallLeagueMatchManagement;