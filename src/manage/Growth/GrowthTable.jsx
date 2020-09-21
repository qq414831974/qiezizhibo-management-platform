import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {message, Input, Icon, Tooltip, Button, Table, Modal, Avatar} from 'antd';
import {
    getChargeGrowth,
    updateChargeGrowth,
    addChargeGrowth,
    deleteChargeGrowth
} from "../../axios";
import {Form} from "antd/lib/index";
import GrowthAddDialog from "../Growth/GrowthAddDialog";
import GrowthModifyDialog from "../Growth/GrowthModifyDialog";

class GrowthTable extends React.Component {
    state = {
        data: [],
        loading: false,
        selectedRowKeys: [],
        dialogModifyVisible: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch();
    };

    fetch = () => {
        this.setState({loading: true});
        getChargeGrowth().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data ? data.data : "",
                    selectedRowKeys: [],
                    dialogModifyVisible: false,
                });
            } else {
                message.error('获取充值成长列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    deleteGrowth = () => {
        deleteChargeGrowth({id: [this.state.record.id]}).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    deleteGrowths = () => {
        deleteChargeGrowth({id: this.state.selectedRowKeys}).then((data) => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    };
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onNameClick = (record, e) => {
        this.setState({record: record, dialogModifyVisible: true});
    }
    saveGrowthAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveGrowthModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showGrowthAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showGrowthModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleGrowthAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleGrowthModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleGrowthAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addChargeGrowth(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success(data.message, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleGrowthModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateChargeGrowth(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success(data.message, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    handleGrowthDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteGrowth,
            deleteCols: 1,
        });
    }
    handleGrowthsDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteGrowths,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;
        const AddDialog = Form.create()(GrowthAddDialog);
        const ModifyDialog = Form.create()(GrowthModifyDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections: [{
                key: 'disSelect',
                text: '清空选中',
                onSelect: () => {
                    this.setState({selectedRowKeys: []});
                },
            }],
            onSelection: this.onSelection,
        };
        const columns = [{
            title: '充值类型',
            dataIndex: 'chargeType',
            align: 'center',
            width: '40%',
            render: function (text, record, index) {
                let type = "未知"
                switch (record.chargeType) {
                    case 1:
                        type = "购买直播";
                        break;
                    case 2:
                        type = "购买录播";
                        break;
                    case 3:
                        type = "比赛买断";
                        break;
                }
                return <span onClick={onNameClick.bind(this, record)} className="cursor-hand">
                    {type}
                </span>
            },
        }, {
            title: <Tooltip title="每消费一元增长的数值"><span>增长/（元）</span></Tooltip>,
            dataIndex: 'growth',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                return <span onClick={onNameClick.bind(this, record)} className="cursor-hand">{record.growth}</span>;
            },
        }, {
            title: '增长类型',
            dataIndex: 'type',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                let type = "未知"
                switch (record.type) {
                    case 1:
                        type = "用户经验";
                        break;
                    case 2:
                        type = "球队热度";
                        break;
                    case 3:
                        type = "球员热度";
                        break;
                }
                return <span onClick={onNameClick.bind(this, record)} className="cursor-hand">{type}</span>;
            },
        },
        ];
        return (<div><Table columns={columns}
                            rowKey={record => record.id}
                            rowSelection={isMobile ? null : rowSelection}
                            dataSource={this.state.data}
                            loading={this.state.loading}
                            bordered
                            title={() =>
                                <div>
                                    <Button type="primary" shape="circle" icon="plus"
                                            onClick={this.showGrowthAddDialog}/>
                                    <Tooltip title="删除">
                                        <Button type="danger" shape="circle" icon="delete"
                                                hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                                onClick={this.handleGrowthsDelete}>{selectedRowKeys.length}</Button>
                                    </Tooltip>
                                    <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                            loading={this.state.loading}
                                            onClick={this.refresh}/>
                                </div>
                            }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加规则"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleGrowthAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleGrowthAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleGrowthAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveGrowthAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改规则"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleGrowthDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleGrowthModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleGrowthModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleGrowthModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveGrowthModifyDialogRef}/>
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
        </div>)
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GrowthTable);