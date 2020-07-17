import React from 'react';
import {Row, Col, Card, Button} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {Link} from "react-router-dom";

class ImportManagement extends React.Component {

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球赛管理" second="导入"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <Button type="primary">
                                    <Link to={
                                        `/football/import/lysy`
                                    }>绿茵岁月</Link
                                    ></Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ImportManagement;