import React from 'react';
import {Row, Col, Divider, message, Card, Button, Table, Modal, Tooltip} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import BannerUpload from './BannerUpload';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {getBulletin, setBulletin,updateBulletin, deleteBulletin, delAreaById, createArea} from "../../axios";
import ScoreBoard from './ScoreBoard';
import {Form} from "antd/lib/index";
import BulletinAddDialog from "./BulletinAddDialog";
import BulletinModifyDialog from "./BulletinModifyDialog";

class BulletinSetting extends React.Component {
    state = {}

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        getBulletin().then((data) => {
            if (data && data.code == 200) {
                this.setState({bulletin: data.data});
            } else {
                message.error('获取系统配置失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    deleteBullet = () => {
        deleteBulletin({id: this.state.record.id}).then((data) => {
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
    };
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showBulletinModifyDialog();
    }
    saveBulletinAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveBulletinModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showBulletinAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleBulletinAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    showBulletinModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleBulletinModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleBulletinAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            setBulletin(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleBulletinModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateBulletin(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    handleBulletinDelete = () => {
        this.setState({deleteVisible: true,});
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const AddDialog = Form.create()(BulletinAddDialog);
        const ModifyDialog = Form.create()(BulletinModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: '内容',
            key: 'content',
            dataIndex: 'content',
            width: '35%',
            align: 'center',
        }, {
            title: '链接',
            dataIndex: 'url',
            key: 'url',
            width: '25%',
            align: 'center',
        }, {
            title: '类型',
            dataIndex: 'curtain',
            key: 'curtain',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                let sceneString = ""
                const sceneType = record.scene.type;
                if(sceneType == "home"){
                    sceneString = "-首页";
                }else if(sceneType == "league"){
                    sceneString = "-联赛";
                }
                else if(sceneType == "match"){
                    sceneString = "-比赛";
                }
                if (record.curtain) {
                    return <span>广告牌{sceneString}</span>
                }
                return <span>公告栏{sceneString}</span>
            }
        }, {
            title: '跳转类型',
            dataIndex: 'type',
            key: 'type',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                if (record.type == 'website') {
                    return <span>网站</span>
                }
                return <span>页面</span>
            }
        }, {
            title: '地区',
            dataIndex: 'areatype',
            key: 'areatype',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                let area = "默认";
                if (record.areatype) {
                    switch (record.areatype) {
                        case 0:
                            area = "默认";
                            break;
                        case 1:
                            area = "全国";
                            break;
                        case 2:
                            area = "全国青少年";
                            break;
                    }
                }
                return <span>{area}</span>
            }
        }, {
            title: '省份',
            dataIndex: 'province',
            key: 'province',
            width: '10%',
            align: 'center',
        }];
        return (
            <div>
                <BreadcrumbCustom first="系统设置"/>
                <Divider>公告设置</Divider>
                <Card bordered={false}>
                    <Table columns={columns}
                           onRow={record => ({onClick: this.onNameClick.bind(this, record)})}
                           rowKey={record => record.id}
                           dataSource={this.state.bulletin}
                           loading={this.state.loading}
                           bordered
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary"
                                               shape="circle"
                                               icon="plus"
                                               onClick={this.showBulletinAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="刷新">
                                       <Button type="primary"
                                               shape="circle"
                                               icon="reload"
                                               className="pull-right"
                                               loading={this.state.loading}
                                               onClick={this.refresh}/>
                                   </Tooltip>
                               </div>
                           }
                    />
                </Card>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="添加公告"
                    visible={this.state.dialogAddVisible}
                    footer={[
                        <Button key="back" onClick={this.handleBulletinAddCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleBulletinAddCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleBulletinAddCancel}>
                    <AddDialog visible={this.state.dialogAddVisible}
                               ref={this.saveBulletinAddDialogRef}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="编辑公告"
                    visible={this.state.dialogModifyVisible}
                    footer={[
                        <Button key="back" onClick={this.handleBulletinModifyCancel}>取消</Button>,
                        <Button key="delete" type="danger" className="pull-left"
                                onClick={this.handleBulletinDelete}>删除</Button>,
                        <Button key="submit" type="primary" onClick={this.handleBulletinModifyCreate}>确定</Button>,
                    ]}
                    onCancel={this.handleBulletinModifyCancel}>
                    <ModifyDialog visible={this.state.dialogModifyVisible}
                                  ref={this.saveBulletinModifyDialogRef}
                                  record={this.state.record}/>
                </Modal>
                <Modal
                    className={isMobile ? "top-n" : ""}
                    title="确认删除"
                    visible={this.state.deleteVisible}
                    onOk={this.deleteBullet}
                    onCancel={this.handleDeleteCancel}
                    zIndex={1001}
                >
                    <p className="mb-n" style={{fontSize: 14}}>是否确认删除？</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(BulletinSetting);