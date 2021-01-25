import React from 'react';
import {Row, Col, Divider, message, Input, Button, Modal, Tooltip, List, Form, Card, Icon, Radio, Tag} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getBanner, addBanner, updateBanner, getAreasList, delBannerById,} from "../../../axios";
import BannerAddDialog from './BannerAddDialog';
import BannerModifyDialog from './BannerModifyDialog';
import {Link} from "react-router-dom";

const RadioGroup = Radio.Group;

const areaType = {0: "默认", 1: "全国"}
const wechatType = {0: "茄子tv", 1: "青少年", 2: "茄子fc"}

class BannerSetting extends React.Component {
    state = {data: []}

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        this.setState({loading: true, areaLoading: true})
        getBanner().then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.setState({data: data.data, loading: false});
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('获取系统配置失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getAreasList().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    areaLoading: false,
                    areas: data.data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    saveBannerAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveBannerModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showBannerAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showBannerModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleBannerAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleBannerModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleBannerAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addBanner(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleBannerModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateBanner(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    } else {
                        message.warn(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    deleteBanner = () => {
        delBannerById({id: this.state.record.id}).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleBannerDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteBanner,
            deleteCols: 1,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    onRecordModifyClick = (record) => {
        this.setState({record: record});
        this.showBannerModifyDialog()
    }
    onRecordDeleteClick = (record)=>{
        this.setState({record: record});
        this.handleBannerDelete()
    }
    render() {
        const onRecordModifyClick = this.onRecordModifyClick;
        const onRecordDeleteClick = this.onRecordDeleteClick;
        const isMobile = this.props.responsive.data.isMobile;
        const AddDialog = Form.create()(BannerAddDialog);
        const ModifyDialog = Form.create()(BannerModifyDialog);
        return (
            <div>
                <BreadcrumbCustom first="系统设置"/>
                <Divider>首页轮播图设置</Divider>
                <Card title={<div style={{minHeight: 32}}>
                    <Tooltip title="添加">
                        <Button type="primary" shape="circle" icon="plus"
                                onClick={this.showBannerAddDialog}/>
                    </Tooltip>
                    <Tooltip title="刷新">
                        <Button type="primary" shape="circle" icon="reload"
                                className="pull-right"
                                loading={this.state.loading}
                                onClick={this.refresh}/>
                    </Tooltip>
                </div>}>
                    <List
                        rowKey={record => record.id}
                        grid={{gutter: 16, lg: 4, md: 3, xs: 1}}
                        dataSource={this.state.data.filter(value => value.wechatType == 0)}
                        loading={this.state.loading}
                        itemLayout="horizontal"
                        size="large"
                        header="茄子TV"
                        renderItem={(item) => (<List.Item className="pa-s">
                            <Card
                                hoverable
                                cover={<div className="h-full w-full center flex-important pt-m">
                                    <img
                                        alt="img"
                                        className="form-match-poster-img cursor-hand"
                                        src={item.img}
                                        onClick={this.onRecordModifyClick.bind(this, item)}
                                    />
                                </div>
                                }
                                actions={[
                                    <Icon type="setting" key="setting" onClick={this.onRecordModifyClick.bind(this, item)}/>,
                                    <Icon type="delete" style={{color:"red"}} key="delete" onClick={this.onRecordDeleteClick.bind(this, item)}/>,
                                ]}>
                                <div>
                                    <Tooltip title={item.url}>
                                        <Tag style={{maxWidth: 160, overflow: "hidden"}}>{item.url ? item.url : "无跳转"}</Tag>
                                    </Tooltip>
                                    <Tag>小程序：{wechatType[item.wechatType]}</Tag>
                                    <Tag>地区：{areaType[item.areaType]}</Tag>
                                    <Tag>省份：{item.province ? item.province : "无"}</Tag>
                                </div>
                            </Card>
                        </List.Item>)}
                    />
                    <List
                        rowKey={record => record.id}
                        grid={{gutter: 16, lg: 4, md: 3, xs: 1}}
                        dataSource={this.state.data.filter(value => value.wechatType == 1)}
                        loading={this.state.loading}
                        itemLayout="horizontal"
                        size="large"
                        header="青少年"
                        className="mt-s"
                        renderItem={(item) => (<List.Item className="pa-s">
                            <Card
                                cover={<div className="h-full w-full center flex-important pt-m">
                                    <img
                                        alt="img"
                                        className="form-match-poster-img cursor-hand"
                                        src={item.img}
                                        onClick={this.onRecordModifyClick.bind(this, item)}
                                    />
                                </div>
                                }
                                actions={[
                                    <Icon type="setting" key="setting" onClick={this.onRecordModifyClick.bind(this, item)}/>,
                                    <Icon type="delete" style={{color:"red"}} key="delete" onClick={this.onRecordDeleteClick.bind(this, item)}/>,
                                ]}>
                                <div>
                                    <Tooltip title={item.url}>
                                        <Tag style={{maxWidth: 160, overflow: "hidden"}}>{item.url ? item.url : "无跳转"}</Tag>
                                    </Tooltip>
                                    <Tag>小程序：{wechatType[item.wechatType]}</Tag>
                                    <Tag>地区：{areaType[item.areaType]}</Tag>
                                    <Tag>省份：{item.province ? item.province : "无"}</Tag>
                                </div>
                            </Card>
                        </List.Item>)}
                    />
                </Card>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="添加轮播图"
                    visible={this.state.dialogAddVisible}
                    footer={[
                        <Button key="back" onClick={this.handleBannerAddCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleBannerAddCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleBannerAddCancel}>
                    <AddDialog areas={this.state.areas}
                               visible={this.state.dialogAddVisible}
                               ref={this.saveBannerAddDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="修改轮播图"
                    visible={this.state.dialogModifyVisible}
                    footer={[
                        <Button key="delete" type="danger" className="pull-left"
                                onClick={this.handleBannerDelete}>删除</Button>,
                        <Button key="back" onClick={this.handleBannerModifyCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleBannerModifyCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleBannerModifyCancel}>
                    <ModifyDialog areas={this.state.areas}
                                  visible={this.state.dialogModifyVisible}
                                  record={this.state.record}
                                  ref={this.saveBannerModifyDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.state.handleDeleteOK}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除{this.state.deleteCols}条数据？</p>
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