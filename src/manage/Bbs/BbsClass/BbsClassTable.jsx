import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {message, Input, Icon, Tooltip, Button, Table, Modal, Avatar} from 'antd';
import {
    getBbsClass,
    deleteBbsClass,
    addBbsClass,
    updateBbsClass,
} from "../../../axios";
import {mergeJSON, parseTimeString} from "../../../utils";
import {Link, Redirect} from 'react-router-dom';
import {Form} from "antd/lib/index";
import BbsClassAddDialog from "./BbsClassAddDialog";
import BbsClassModifyDialog from "./BbsClassModifyDialog";
import defultAvatar from "../../../static/avatar.jpg";

class BbsClassTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        selectedRowKeys: [],
        dialogModifyVisible: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        console.log(this.props.boardId)
        this.fetch({
            boardId: this.props.boardId,
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getBbsClass(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    loading: false,
                    data: data.data,
                    selectedRowKeys: [],
                    dialogModifyVisible: false,
                });
            } else {
                message.error('获取bbs分类列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        this.fetch({
            boardId: this.props.boardId,
        });
    }
    deleteBbsClass = () => {
        deleteBbsClass({
            boardId: this.props.boardId,
            classId: this.state.record.id,
            force: this.state.deleteFlag
        }).then((data) => {
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
    onNameClick = (record, e) => {
        this.setState({record: record, dialogModifyVisible: true});
    }
    saveBbsClassAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveBbsClassModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showBbsClassAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showBbsClassModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleBbsClassAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleBbsClassModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleBbsClassAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.boardId = this.props.boardId;
            addBbsClass(values).then((data) => {
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
    handleBbsClassModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.boardId = this.props.boardId;
            updateBbsClass(values).then((data) => {
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
    handleBbsClassDelete = (flag) => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteBbsClass,
            deleteFlag: flag,
            deleteCols: 1,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;
        const AddDialog = Form.create()(BbsClassAddDialog);
        const ModifyDialog = Form.create()(BbsClassModifyDialog);
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
            title: 'id',
            key: 'id',
            dataIndex: 'id',
            width: '10%',
            align: 'center',
        }, {
            title: '分类名称',
            dataIndex: 'name',
            align: 'center',
            render: function (text, record, index) {
                return <div className="cursor-hand" onClick={onNameClick.bind(this, record)}>
                    <div className={`center ${record.shortName ? "border-bottom-gray" : ""}`}><Avatar
                        src={record.headImg ? record.headImg : defultAvatar}/>
                        <p className="ml-s">{record.name}</p>
                    </div>
                    {record.shortName ? <div className="center">简称：{record.shortName}</div> : null}
                </div>;
            },
        }, {
            title: '是否可用',
            key: 'available',
            filters: [
                {text: '不可用', value: false},
                {text: '可用', value: true},
            ],
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                if (record.available == null) {
                    return "不可用";
                }
                let status = "不可用";
                switch (record.available) {
                    case false:
                        status = "不可用";
                        break;
                    case true:
                        status = "可用";
                        break;
                    default :
                        status = "不可用";
                }
                return status;
            },
        },
        ];
        return (<div><Table columns={columns}
                            rowKey={record => record.id}
                            dataSource={this.state.data}
                            loading={this.state.loading}
                            bordered
                            title={() =>
                                <div>
                                    <Button type="primary" shape="circle" icon="plus"
                                            onClick={this.showBbsClassAddDialog}/>
                                    <Tooltip title="刷新">
                                        <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                                loading={this.state.loading}
                                                onClick={this.refresh}/>
                                    </Tooltip>
                                </div>
                            }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加bbs分类"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleBbsClassAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleBbsClassAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleBbsClassAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible} matchId={this.props.matchId}
                           ref={this.saveBbsClassAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改bbs分类"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleBbsClassDelete.bind(this, false)}>删除</Button>,
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleBbsClassDelete.bind(this, true)}>强制删除</Button>,
                    <Button key="back" onClick={this.handleBbsClassModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleBbsClassModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleBbsClassModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveBbsClassModifyDialogRef}/>
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
                <span className="danger mt-s">{this.state.deleteFlag ? "强制删除将会彻底删除无法恢复！！！" : ""}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(BbsClassTable);