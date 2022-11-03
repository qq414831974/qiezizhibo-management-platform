import React from 'react';
import {Row, Col, Card} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import BbsBoardTable from "../Bbs/BbsBoardTable";


class BbsBoardManagement extends React.Component {
    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="bbs板块管理"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <BbsBoardTable/>
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

export default connect(mapStateToProps, mapDispatchToProps)(BbsBoardManagement);