import React from 'react';
import { Row, Col, Card } from 'antd';
import LogTable from './LogTable';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";



class LogManagement extends React.Component {
    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="操作日志管理" />
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <LogTable/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LogManagement);