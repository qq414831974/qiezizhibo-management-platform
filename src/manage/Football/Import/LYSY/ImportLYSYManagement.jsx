import React from 'react';
import {Row, Col, Input, Button, Modal, message} from 'antd';
import BreadcrumbCustom from '../../../Components/BreadcrumbCustom';
import {Link} from "react-router-dom";
import {getAreasList, importLYSYTeamPlayer, importLYSYMatch, importLYSYLeaguePlayer} from "../../../../axios";

class ImportLYSYManagement extends React.Component {
    state = {}

    onImportTeamAndPlyerClick = () => {
        this.setState({importTeamVisible: true})
    }
    onImportMatchClick = () => {
        this.setState({importMatchVisible: true})
    }
    onImportPlyerRankClick = () => {
        this.setState({importPlayerRankVisible: true})
    }
    importTeamCancel = () => {
        this.setState({importTeamVisible: false})
    }
    importMatchCancel = () => {
        this.setState({importMatchVisible: false})
    }
    importPlayerRankCancel = () => {
        this.setState({importPlayerRankVisible: false})
    }
    importTeamConfirm = () => {
        if (this.state.importLoading) {
            return;
        }
        const leagueId = this.state.importTeamLYSYLeagueId;
        const city = this.state.importTeamLYSYCity;
        if (leagueId == null || city == null) {
            message.error("参数不能为空", 3)
            return;
        }
        this.setState({importLoading: true})
        importLYSYTeamPlayer({
            leagueId: leagueId,
            city: city,
        }).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({importLoading: false, importTeamVisible: false})
                    message.success(data.message, 1);
                }
            } else {
                message.error('导入失败，请前往查看如有导入多余数据请删除：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    importMatchConfirm = () => {
        if (this.state.importLoading) {
            return;
        }
        const lysyLeagueId = this.state.importMatchLYSYLeagueId;
        const leagueId = this.state.importMatchLeagueId;
        const duration = this.state.importMatchDuration;
        if (lysyLeagueId == null || leagueId == null || duration == null) {
            message.error("参数不能为空", 3)
            return;
        }
        this.setState({importLoading: true})
        importLYSYMatch({
            leagueId: leagueId,
            lysyLeagueId: lysyLeagueId,
            duration: duration,
        }).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({importLoading: false, importMatchVisible: false})
                    message.success(data.message, 1);
                }
            } else {
                message.error('导入失败，请前往查看如有导入多余数据请删除：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    importPlayerRankConfirm = () => {
        if (this.state.importLoading) {
            return;
        }
        const lysyLeagueId = this.state.importPlayerRankLYSYLeagueId;
        const leagueId = this.state.importPlayerRankLeagueId;
        if (lysyLeagueId == null || leagueId == null) {
            message.error("参数不能为空", 3)
            return;
        }
        this.setState({importLoading: true})
        importLYSYLeaguePlayer({
            leagueId: leagueId,
            lysyLeagueId: lysyLeagueId,
        }).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({importLoading: false, importPlayerRankVisible: false})
                    message.success(data.message, 1);
                }
            } else {
                message.error('导入失败，请前往查看如有导入多余数据请删除：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }
    onImportTeamLYSYLeagueIdChange = (e) => {
        const {value} = e.target;
        this.setState({importTeamLYSYLeagueId: value})
    }
    onImportTeamLYSYCityChange = (e) => {
        const {value} = e.target;
        this.setState({importTeamLYSYCity: value})
    }
    onImportMatchLYSYLeagueIdChange = (e) => {
        const {value} = e.target;
        this.setState({importMatchLYSYLeagueId: value})
    }
    onImportMatchLeagueIdChange = (e) => {
        const {value} = e.target;
        this.setState({importMatchLeagueId: value})
    }
    onImportMatchDurationChange = (e) => {
        const {value} = e.target;
        this.setState({importMatchDuration: value})
    }
    onImportPlayerRankLYSYLeagueIdChange = (e) => {
        const {value} = e.target;
        this.setState({importPlayerRankLYSYLeagueId: value})
    }
    onImportPlayerRankLeagueIdChange = (e) => {
        const {value} = e.target;
        this.setState({importPlayerRankLeagueId: value})
    }
    getImportTeamContent = () => {
        return <div>
            <Row>
                <Col xs={24} sm={5}>
                    <span>绿茵岁月联赛ID：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportTeamLYSYLeagueIdChange}/>
                </Col>
            </Row>
            <Row className="mt-s">
                <Col xs={24} sm={5}>
                    <span>城市：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportTeamLYSYCityChange}/>
                </Col>
            </Row>
            <div className="mt-m">
                <span className="danger">注意：导入完请前往联赛管理，添加所导入球队至联赛中，再导入比赛及球员榜</span>
            </div>
            <div className="mt-s">
                <span className="danger">如导入失败请与管理员联系</span>
            </div>
        </div>;
    }
    getImportMatchContent = () => {
        return <div>
            <Row>
                <Col xs={24} sm={5}>
                    <span>绿茵岁月联赛ID：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportMatchLYSYLeagueIdChange}/>
                </Col>
            </Row>
            <Row className="mt-s">
                <Col xs={24} sm={5}>
                    <span>联赛ID：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportMatchLeagueIdChange}/>
                </Col>
            </Row>
            <Row className="mt-s">
                <Col xs={24} sm={5}>
                    <span>比赛时长：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportMatchDurationChange}/>
                </Col>
            </Row>
            <div className="mt-m">
                <span className="danger">注意：导入前请前往联赛管理，添加球队至联赛中，再导入比赛</span>
            </div>
            <div className="mt-m">
                <span className="danger">如导入失败请与管理员联系</span>
            </div>
        </div>;
    }
    getImportPlayerRankContent = () => {
        return <div>
            <Row>
                <Col xs={24} sm={5}>
                    <span>绿茵岁月联赛ID：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportPlayerRankLYSYLeagueIdChange}/>
                </Col>
            </Row>
            <Row className="mt-s">
                <Col xs={24} sm={5}>
                    <span>联赛ID：</span>
                </Col>
                <Col xs={24} sm={16}>
                    <Input onChange={this.onImportPlayerRankLeagueIdChange}/>
                </Col>
            </Row>
            <div className="mt-m">
                <span className="danger">注意：导入前请前往联赛管理，添加球队至联赛中，再导入球员榜</span>
            </div>
            <div className="mt-m">
                <span className="danger">如导入失败请与管理员联系</span>
            </div>
        </div>;
    }

    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="球赛管理" second="导入-绿茵岁月"/>
                <Button type="primary" onClick={this.onImportTeamAndPlyerClick}>导入球队及球员</Button>
                <Button type="primary" onClick={this.onImportMatchClick}>导入比赛</Button>
                <Button type="primary" onClick={this.onImportPlyerRankClick}>导入球员榜</Button>
                <Modal
                    title="导入球队及球员"
                    visible={this.state.importTeamVisible}
                    footer={[
                        <Button key="back" onClick={this.importTeamCancel}>取消</Button>,
                        <Button key="confirm" type="primary" loading={this.state.importLoading}
                                onClick={this.importTeamConfirm}>{this.state.importLoading ? "导入中" : "确定"}</Button>,
                    ]}
                    onCancel={this.importTeamCancel}>
                    {this.getImportTeamContent()}
                </Modal>
                <Modal
                    title="导入比赛"
                    visible={this.state.importMatchVisible}
                    footer={[
                        <Button key="back" onClick={this.importMatchCancel}>取消</Button>,
                        <Button key="confirm" type="primary" loading={this.state.importLoading}
                                onClick={this.importMatchConfirm}>{this.state.importLoading ? "导入中" : "确定"}</Button>,
                    ]}
                    onCancel={this.importMatchCancel}>
                    {this.getImportMatchContent()}
                </Modal>
                <Modal
                    title="导入球员榜"
                    visible={this.state.importPlayerRankVisible}
                    footer={[
                        <Button key="back" onClick={this.importPlayerRankCancel}>取消</Button>,
                        <Button key="confirm" type="primary" loading={this.state.importLoading}
                                onClick={this.importPlayerRankConfirm}>{this.state.importLoading ? "导入中" : "确定"}</Button>,
                    ]}
                    onCancel={this.importPlayerRankCancel}>
                    {this.getImportPlayerRankContent()}
                </Modal>
            </div>
        );
    }
}

export default ImportLYSYManagement;