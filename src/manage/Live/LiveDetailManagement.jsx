import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import LiveMeidaDetailManagement from "./LiveMeidaDetailManagement";
import LiveStatusManagement from "./LiveStatusManagement";
import {getActivityInfo} from "../../axios";
import {getQueryString} from "../../utils";

const TabPane = Tabs.TabPane;


class LiveDetailManagement extends React.Component {
    state = {
        currentTab: "1",
        pageLoaded: false,
        data: {},
    };

    componentDidMount() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return;
        }
        this.fetch();
        if (this.props.location.search) {
            let currentTab = getQueryString(this.props.location.search, "tab");
            if (currentTab == null) {
                currentTab = 1;
            }
            this.setState({currentTab: currentTab.toString()});
        }
    };

    fetch = () => {
        getActivityInfo(this.props.match.params.id).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({
                        pageLoading: true,
                        data: data ? data.data : {},
                    });
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('获取直播信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    render() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/live"/>;
        }
        return this.state.pageLoading ? <div className="gutter-div">
            <BreadcrumbCustom first={<Link to={'/live'}>直播管理</Link>} second="详细设置"/>
            <Row gutter={16}>
                <Col className="gutter-row">
                    <div className="gutter-box">
                        <Card bordered={false}>
                            <div className="inline-block">
                                <Link to={'/live'}>
                                    <Icon type="left" style={{fontSize: 18}}/>
                                </Link>
                                <strong style={{fontSize: 18, marginLeft: "10px"}}>{this.state.data.name}</strong>
                            </div>
                            <Tabs activeKey={this.state.currentTab} onChange={(value) => {
                                this.setState({currentTab: value});
                                this.props.history.replace(`/live/${this.props.match.params.id}?tab=${value}`)
                            }}>
                                <TabPane tab="直播设置" key="1">
                                    <LiveStatusManagement
                                        id={this.props.match.params.id}
                                        visible={this.state.currentTab == "1" ? true : false}/>
                                </TabPane>
                                <TabPane tab="媒体库" key="2">
                                    <LiveMeidaDetailManagement
                                        id={this.props.match.params.id}
                                        visible={this.state.currentTab == "2" ? true : false}/>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div> : <div/>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveDetailManagement);