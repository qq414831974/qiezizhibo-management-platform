import React from 'react';
import {Row, Col, Card} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";

import ShareSentenceTable from "./ShareSentenceTable";

class ShareSentenceManagement extends React.Component {
    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="分享语句管理"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <ShareSentenceTable/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShareSentenceManagement);