import React from 'react';
import {Row, Col, Card, Icon, Spin, Modal} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import MatchSimpleForm from "../Match/FootBallMatchModifyDialog";
import {delMatchByIds, getMatchById, updateMatchById} from "../../../axios";
import FootBallMatchPlayersSettingPanel from "./Formation/FootBallMatchPlayersSettingPanel";
import FootBallMatchPlayersMediaPanel from "./Media/FootBallMatchPlayersMediaPanel";
import {getQueryString} from "../../../utils";

const TabPane = Tabs.TabPane;

const TIME_LINE = 1;
const STATISTICS = 2;
const PLAY_LIST = 3;
const CHATTING_ROOM = 4;
const RECOMMOMED = 5;

class FootBallMatchDetailManagement extends React.Component {
    state = {
        currentTab: "1",
        pageLoaded: false,
        data: {},
    };

    componentDidMount() {
        this.fetch(this.props.match.params.id);
        if (this.props.location.search) {
            const currentTab = getQueryString(this.props.location.search, "tab");
            this.setState({currentTab: currentTab.toString()});
        }
    };

    fetch = (params = {}) => {
        getMatchById(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    pageLoaded: true,
                    data: data.data,
                });
            } else {
                message.error('获取比赛失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    saveMatchModifyDialogRef = (form) => {
        this.formModify = form;
    };
    handleMatchModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["startTime"] = values["startTime"] ? values["startTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["available"] = values["available"] != null ? !values["available"] : false;
            updateMatchById(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.fetch(this.props.match.params.id);
                        message.success('修改成功', 1);
                    }else{
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            });
            form.resetFields();
        });
    };
    handleDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.delete,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    delete = () => {
        delMatchByIds({id: [this.props.match.params.id]}).then((data) => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    message.success('删除成功', 1);
                    setTimeout(() => {
                        const history = this.props.history;
                        history.push(`/football/footballMatch`);
                    }, 2000);
                }else{
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    };

    render() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/football/footballMatch"/>;
        }
        const MatchSimple = Form.create()(MatchSimpleForm);
        const id = this.props.match.params.id;
        const isMobile = this.props.responsive.data.isMobile;
        const matchType = this.state.data ? (this.state.data.type ? eval(this.state.data.type) : []) : [];

        return this.state.pageLoaded ? (
            <div className="gutter-example">
                <BreadcrumbCustom first={<Link to={'/football/footballMatch'}>球赛管理</Link>} second="详细设置"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="inline-block">
                                    <Link to={'/football/footballMatch'}>
                                        <Icon type="left" style={{fontSize: 18}}/>
                                    </Link>
                                    <strong style={{fontSize: 18, marginLeft: "10px"}}>
                                        {this.state.data ? this.state.data.name : ""}
                                    </strong>
                                </div>
                                <Tabs activeKey={this.state.currentTab} onChange={(value) => {
                                    this.setState({currentTab: value});
                                    this.props.history.replace(`/football/footballMatch/${this.props.match.params.id}?tab=${value}`)
                                }}>
                                    <TabPane tab="基础设置" key="1">
                                        <MatchSimple visible={this.state.currentTab == 1 ? true : false}
                                                     record={this.state.data}
                                                     detail={true}
                                                     handleSave={this.handleMatchModifyCreate}
                                                     handleDelete={this.handleDelete}
                                                     ref={this.saveMatchModifyDialogRef}/>
                                    </TabPane>
                                    {matchType.indexOf(PLAY_LIST) >= 0 ?
                                        <TabPane tab="球队首发阵型设置" key="2">
                                            <FootBallMatchPlayersSettingPanel
                                                visible={this.state.currentTab == 2 ? true : false}
                                                matchId={id}/>
                                        </TabPane> : null}
                                    {matchType.indexOf(RECOMMOMED) >= 0 ?
                                        <TabPane tab="球员集锦" key="3">
                                            <FootBallMatchPlayersMediaPanel
                                                visible={this.state.currentTab == 3 ? true : false}
                                                matchId={id}/>
                                        </TabPane> : null}
                                </Tabs>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.state.handleDeleteOK}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
                </Modal>
            </div>
        ) : <div className="center" style={{height: document.body.clientHeight}}>
            <Spin spinning={!this.state.pageLoaded} size="large"/>
        </div>;
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchDetailManagement);