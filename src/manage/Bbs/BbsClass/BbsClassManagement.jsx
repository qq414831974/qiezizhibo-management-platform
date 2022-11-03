import React from 'react';
import {Row, Col, Card} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import BbsClassTable from "../BbsClass/BbsClassTable";
import {getQueryString} from "../../../utils";


class BbsClassManagement extends React.Component {
    state = {
        boardId: null,
    };

    componentDidMount() {
        if (this.props.location.search) {
            const boardId = getQueryString(this.props.location.search, "boardId");
            this.setState({boardId: boardId});
        }
    };

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="bbs板块分类管理"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                {this.state.boardId != null ? <BbsClassTable boardId={this.state.boardId}/> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(BbsClassManagement);