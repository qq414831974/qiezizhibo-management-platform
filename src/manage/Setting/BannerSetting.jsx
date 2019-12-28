import React from 'react';
import {Row, Col, Divider, message, Input, Button, Modal, Tooltip} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import BannerUpload from './BannerUpload';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {getConfig, delConfig, getAreasList} from "../../axios";
import ScoreBoard from './ScoreBoard';

class BannerSetting extends React.Component {
    state = {}

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        getConfig({areatype:null}).then((data) => {
            if (data) {
                let banner = {}
                let count = 0;
                if (data.banner) {
                    data.banner.forEach((item) => {
                        banner[count] = {}
                        banner[count]["id"] = item.id;
                        banner[count]["img"] = item.img;
                        banner[count]["url"] = item.url;
                        banner[count]["province"] = item.province;
                        banner[count]["areatype"] = item.areatype;
                        count = count + 1;
                    });
                }
                this.setState({banner: banner, hotloader: data.config, bannerCount: count});
            } else {
                message.error('获取系统配置失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
        getAreasList().then((data) => {
            if (data) {
                this.setState({
                    areaLoading: false,
                    areas: data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.msg : data), 3);
            }
        });
    }
    renderBannerList = () => {
        let dom = [];
        for (let i = 0; i < this.state.bannerCount; i++) {
            dom.push(
                <Col xs={24} sm={12} md={8} lg={6}>
                    {this.state.banner[i] && this.state.banner[i].id && <div className="w-full center">
                        <Divider>
                            <Tooltip title="删除">
                                <Button icon={"minus"}
                                        shape="circle"
                                        onClick={this.showDelete.bind(this, this.state.banner[i])}
                                        type="primary">
                                </Button>
                            </Tooltip>
                        </Divider>
                    </div>}
                    <BannerUpload
                        refreshFunc={this.refresh}
                        areas={this.state.areas}
                        loading={this.state.areaLoading}
                        index={i}
                        data={this.state.banner ? this.state.banner[i] : null}/>
                </Col>
            );
        }
        return dom;
    }

    refresh = () => {
        this.fetch();
    }
    showDelete = (item) => {
        this.setState({deleteShow: true, currentItem: item})
    }
    cancelDelete = () => {
        this.setState({deleteShow: false})
    }
    onBannerUploadDelete = () => {
        delConfig({id: this.state.currentItem.id}).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    this.cancelDelete();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.msg : data), 3);
            }
        })
    }

    render() {
        const isMobile = this.props.responsive.data.isMobile;

        return (
            <div>
                <BreadcrumbCustom first="系统设置"/>
                <Divider>首页轮播图设置</Divider>
                <Divider>
                    <div className="center">
                        <Tooltip title="添加">
                            <Button icon={"plus"}
                                    shape="circle"
                                    onClick={() => {
                                        this.setState({bannerCount: this.state.bannerCount + 1});
                                    }}
                                    type="primary">
                            </Button>
                        </Tooltip>
                    </div>
                </Divider>
                <Row gutter={5}>
                    {this.state.banner && this.renderBannerList()}
                </Row>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="确认删除"
                    visible={this.state.deleteShow}
                    onOk={this.onBannerUploadDelete}
                    onCancel={this.cancelDelete}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除</p>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(BannerSetting);