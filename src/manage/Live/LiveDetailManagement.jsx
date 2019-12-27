import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom';
import {Form, message, Tabs} from "antd/lib/index";
import LivePageSetting from "../Live/LivePageSetting";
import LiveSimpleForm from "../Live/LiveSimpleForm";
import LiveMediaSetting from "../Live/LiveMediaSetting";
import {getActivityInfo, modifyActivityInfo, modifyActivityFakeInfo} from "../../axios";

const TabPane = Tabs.TabPane;


class LiveDetailManagement extends React.Component {
    state = {
        pageLoading: false,
        currentTab: "1",
        data: {},
    };

    componentDidMount() {
        this.setState({
            pageLoading: false,
        });
        this.fetch(this.props.match.params.id);
    };

    fetch = (params = {}) => {
        getActivityInfo(params).then((data) => {
            if (data && data.message == null) {
                this.setState({
                    pageLoading: true,
                    data: data ? data : data,
                });
            } else {
                message.error('获取直播信息失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });
    }
    saveLiveSimpleRef = (form) => {
        this.formSimple = form;
    };
    handleModifyCreate = () => {
        const form = this.formSimple;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const callback1 = () => {
                this.check1 = true;
                if (this.check1 && this.check2) {
                    this.fetch(this.props.match.params.id);
                    this.check1 = false;
                    this.check2 = false;
                }
            }
            const callback2 = () => {
                this.check2 = true;
                if (this.check1 && this.check2) {
                    this.fetch(this.props.match.params.id);
                    this.check1 = false;
                    this.check2 = false;
                }
            }
            const baseData = {};
            baseData.endedAt = values.endedAt;
            baseData.startedAt = values.startedAt;
            baseData.name = values.name;
            modifyActivityInfo(values.id, baseData).then(((data) => {
                callback1();
                if (data) {
                    if (data.result) {
                        message.success('修改成功', 1);
                    } else {
                        message.error('修改失败：' + (data ? data.name + "-" + data.message : data), 3);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.name + "-" + data.message : data), 3);
                }
            }));
            const fakeData = {}
            fakeData.enabled = values.isFakeEnabled;
            fakeData.fake = {};
            fakeData.fake.baseCount = values.fake.baseCount;
            fakeData.fake.increaseMin = values.fake.increaseMin;
            fakeData.fake.increaseMax = values.fake.increaseMax;
            modifyActivityFakeInfo(values.id, fakeData).then(((data) => {
                callback2();
                if (data) {
                    if (data.result) {
                        message.success('修改人数放大成功', 1);
                    } else {
                        message.error('修改人数放大失败：' + (data ? data.name + "-" + data.message : data), 3);
                    }
                } else {
                    message.error('修改人数放大失败：' + (data ? data.name + "-" + data.message : data), 3);
                }
            }));
            form.resetFields();
        });
    };

    render() {
        if (!(this.props.match.params && this.props.match.params.id)) {
            return <Redirect push to="/live"/>;
        }
        const LiveSimple = Form.create()(LiveSimpleForm);
        const id = this.props.match.params.id;
        return this.state.pageLoading ? (
            <div className="gutter-example">
                <BreadcrumbCustom first={<Link to={'/live'}>直播管理</Link>} second="详细设置"/>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="inline-block"><Link to={'/live'}><Icon type="left"
                                                                                           style={{fontSize: 18}}/></Link><strong
                                    style={{fontSize: 18, marginLeft: "10px"}}>{this.state.data.name}</strong></div>
                                <Tabs defaultActiveKey="1" onChange={(value) => {
                                    this.setState({currentTab: value});
                                }}>
                                    <TabPane tab="基础设置" key="1">
                                        <LiveSimple
                                            visible={this.state.currentTab == "1" ? true : false}
                                            record={this.state.data}
                                            detail={true}
                                            handleSave={this.handleModifyCreate}
                                            ref={this.saveLiveSimpleRef}/>
                                    </TabPane>
                                    {/*<TabPane tab="播放页设置" key="2">*/}
                                        {/*<LivePageSetting id={id}*/}
                                                         {/*visible={this.state.currentTab == "2" ? true : false}/>*/}
                                    {/*</TabPane>*/}
                                    <TabPane tab="媒体库设置" key="3">
                                        <LiveMediaSetting id={id}
                                                          visible={this.state.currentTab == "3" ? true : false}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveDetailManagement);