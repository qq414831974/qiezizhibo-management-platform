import React from 'react';
import {Row, Col, Card, Icon, Spin, Modal} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import {getUserByUserNo,} from "../../axios";
import {getQueryString} from "../../utils";
import defultAvatar from "../../static/avatar.jpg";
import UserAddressPanel from "./Address/UserAddressPanel"
import UserAbilityPanel from "./Ability/UserAbilityPanel"
import UserExpPanel from "./Exp/UserExpPanel";

const TabPane = Tabs.TabPane;

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

    fetch = (userNo) => {
        if (userNo == null) {
            message.error("参数错误", 3);
            return;
        }
        getUserByUserNo({userNo: userNo}).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    pageLoaded: true,
                    data: data.data,
                });
            } else {
                message.error('获取用户失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }

    render() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/user/user"/>;
        }
        const userNo = this.props.match.params.id;
        const isMobile = this.props.responsive.data.isMobile;

        return this.state.pageLoaded ? (
            <div className="gutter-example">
                <BreadcrumbCustom first={<Link to={'/user/user'}>用户管理</Link>} second="详细设置"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="inline-block">
                                    <Link to={'/user/user'}>
                                        <Icon type="left" style={{fontSize: 18}}/>
                                    </Link>
                                    <strong className="vertical-align-middle"
                                            style={{fontSize: 18, marginLeft: "10px"}}>
                                        用户：
                                    </strong>
                                    <img className="round-img-s vertical-align-middle"
                                         src={this.state.data && this.state.data.avatar ? this.state.data.avatar : defultAvatar}/>
                                    <strong className="vertical-align-middle"
                                            style={{fontSize: 18, marginLeft: "10px"}}>
                                        {this.state.data ? this.state.data.name : ""}
                                    </strong>
                                </div>
                                <Tabs activeKey={this.state.currentTab} onChange={(value) => {
                                    this.setState({currentTab: value});
                                    this.props.history.replace(`/user/user/${this.props.match.params.id}?tab=${value}`)
                                }}>
                                    <TabPane tab="用户经验" key="1">
                                        <UserExpPanel userNo={userNo}/>
                                    </TabPane>
                                    <TabPane tab="用户地址" key="2">
                                        <UserAddressPanel userNo={userNo}/>
                                    </TabPane>
                                    <TabPane tab="用户能力" key="3">
                                        <UserAbilityPanel userNo={userNo}/>
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </div>
                    </Col>
                </Row>
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