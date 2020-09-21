import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {message, Input, Icon, Tooltip, Button, Table, Modal, Avatar} from 'antd';
import {
    getExp,
    updateExp,
    addExp,
    deleteExp
} from "../../axios";
import {Form} from "antd/lib/index";
import ExpAddDialog from "../Exp/ExpAddDialog";
import ExpModifyDialog from "../Exp/ExpModifyDialog";

class ExpTable extends React.Component {
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
        getExp().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data ? data.data : "",
                    selectedRowKeys: [],
                    dialogModifyVisible: false,
                });
            } else {
                message.error('获取等级列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch();
    }
    deleteExp = () => {
        deleteExp({id: [this.state.record.id]}).then((data) => {
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
    deleteExps = () => {
        deleteExp({id: this.state.selectedRowKeys}).then((data) => {
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
    saveExpAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveExpModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showExpAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showExpModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleExpAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleExpModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleExpAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addExp(values).then((data) => {
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
    handleExpModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateExp(values).then((data) => {
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
    handleExpDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteExp,
            deleteCols: 1,
        });
    }
    handleExpsDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteExps,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;
        const AddDialog = Form.create()(ExpAddDialog);
        const ModifyDialog = Form.create()(ExpModifyDialog);

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
            title: '等级',
            dataIndex: 'level',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                return <span onClick={onNameClick.bind(this, record)} className="cursor-hand">
                    {record.level}
                </span>
            },
        }, {
            title: '名称',
            dataIndex: 'name',
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                return <a onClick={onNameClick.bind(this, record)} className="cursor-hand">{record.name}</a>;
            },
        }, {
            title: '最小经验',
            dataIndex: 'minExp',
            width: '20%',
            align: 'center',
        }, {
            title: '最大经验',
            dataIndex: 'maxExp',
            width: '20%',
            align: 'center',
        }, {
            title: '图片',
            key: 'img',
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                if (record.img == null) {
                    return <span>无</span>
                }
                return <Avatar src={record.img}/>
            }
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
                                            onClick={this.showExpAddDialog}/>
                                    <Tooltip title="删除">
                                        <Button type="danger" shape="circle" icon="delete"
                                                hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                                onClick={this.handleExpsDelete}>{selectedRowKeys.length}</Button>
                                    </Tooltip>
                                    <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                            loading={this.state.loading}
                                            onClick={this.refresh}/>
                                </div>
                            }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加等级"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleExpAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleExpAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleExpAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveExpAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改等级"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleExpDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleExpModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleExpModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleExpModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveExpModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExpTable);