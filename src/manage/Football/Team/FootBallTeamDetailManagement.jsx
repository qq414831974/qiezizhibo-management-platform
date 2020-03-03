import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import TeamSimpleForm from "../Team/FootBallTeamModifyDialog";
import {getTeamById, updateTeamById} from "../../../axios";
import TeamAddPlayersPanel from "./FootBallTeamAddPlayersPanel";

const TabPane = Tabs.TabPane;


class FootBallTeamDetailManagement extends React.Component {
    state = {
        currentTab: "1",
        pageLoaded: false,
        data: {},
    };

    componentDidMount() {
        this.fetch(this.props.match.params.id);
    };

    fetch = (params = {}) => {
        this.setState({
            pageLoaded: false,
        });
        getTeamById(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    pageLoaded: true,
                    data: data.data,
                });
            } else {
                message.error('获取队伍失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    saveTeamModifyDialogRef = (form) => {
        this.formModify = form;
    };
    handleTeamModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateTeamById(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.fetch(this.props.match.params.id);
                        message.success('修改成功', 1);
                    }else{
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
        });
    };

    render() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/football/footballTeam"/>;
        }
        const TeamSimple = Form.create()(TeamSimpleForm);
        return this.state.pageLoaded ? (
            <div className="gutter-div">
                <BreadcrumbCustom first={<Link to={'/football/footballTeam'}>球队管理</Link>} second="详细设置"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="inline-block">
                                    <Link to={'/football/footballTeam'}>
                                        <Icon type="left" style={{fontSize: 18}}/>
                                    </Link>
                                    <strong style={{fontSize: 18, marginLeft: "10px"}}>{this.state.data.name}</strong>
                                </div>
                                <Tabs defaultActiveKey="1" onChange={(value) => {
                                    this.setState({currentTab: value});
                                }}>
                                    <TabPane tab="基础设置" key="1">
                                        <TeamSimple visible={this.state.currentTab == "1" ? true : false}
                                                    record={this.state.data}
                                                    detail={true} handleSave={this.handleTeamModifyCreate}
                                                    ref={this.saveTeamModifyDialogRef}/></TabPane>
                                    <TabPane tab="球队人员设置" key="2">
                                        <TeamAddPlayersPanel record={this.state.data}/>
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        ) : <div/>;
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallTeamDetailManagement);