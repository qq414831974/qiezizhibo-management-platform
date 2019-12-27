import React from 'react';
import { Row, Col, Card,Button } from 'antd';
import LiveTable from './LiveTable';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";



class LiveManagement extends React.Component {
    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="直播管理" />
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <LiveTable/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveManagement);