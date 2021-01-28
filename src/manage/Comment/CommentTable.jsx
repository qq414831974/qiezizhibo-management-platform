import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {message, Input, Icon, Tooltip, Button, Table, Modal, Avatar} from 'antd';
import {
    getCommentByMatchId,
    deleteCommentByIds,
    addCommentByMatchId,
    updateComment,
    pendCommentByIds,
    passCommentByIds,
    banCommentByIds,
    pendCommentById,
    passCommentById,
    banCommentById
} from "../../axios";
import {mergeJSON, parseTimeString} from "../../utils";
import {Link, Redirect} from 'react-router-dom';
import {Form} from "antd/lib/index";
import CommentAddDialog from "../Comment/CommentAddDialog";
import CommentModifyDialog from "../Comment/CommentModifyDialog";

class CommentTable extends React.Component {
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
        this.fetch({
            matchId: this.props.matchId,
            pageSize: this.state.pagination.pageSize,
            pageNum: 1
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getCommentByMatchId(params).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                    selectedRowKeys: [],
                    dialogModifyVisible: false,
                });
            } else {
                message.error('获取评论列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        const pager = {...this.state.pagination};
        this.fetch({
            matchId: this.props.matchId,
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    deleteComment = () => {
        deleteCommentByIds({id: [this.state.record.id]}).then((data) => {
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
    deleteComments = () => {
        deleteCommentByIds({id: this.state.selectedRowKeys}).then((data) => {
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
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onSearch = () => {
        const {searchText} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
        });
        this.fetch({
            matchId: this.props.matchId,
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onNameClick = (record, e) => {
        this.setState({record: record, dialogModifyVisible: true});
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        pager.filters = this.getTableFilters(pager);
        this.setState({
            pagination: pager,
        });
        this.fetch({
            matchId: this.props.matchId,
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    getTableFilters = (pager, filters) => {
        const {searchText} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["content"] = searchText;
        }
        if (filters) {
            for (let param in filters) {
                if (filters[param] != null && (filters[param] instanceof Array && filters[param].length > 0)) {
                    pager.filters[param] = filters[param][0];
                }
            }
        }
        return pager.filters;
    }
    saveCommentAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveCommentModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showCommentAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showCommentModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleCommentAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleCommentModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleCommentAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addCommentByMatchId({matchId: this.props.matchId, ...values}).then((data) => {
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
    handleCommentModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateComment(values).then((data) => {
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
    handleCommentDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteComment,
            deleteCols: 1,
        });
    }
    handleCommentsDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteComments,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    handleCommentsPend = () => {
        pendCommentByIds(this.state.selectedRowKeys).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('取消审核失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleCommentsPass = () => {
        passCommentByIds(this.state.selectedRowKeys).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('审核失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleCommentsBan = () => {
        banCommentByIds(this.state.selectedRowKeys).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('禁用失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleCommentPend = () => {
        pendCommentById(this.state.record.id).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('取消审核失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleCommentPass = () => {
        passCommentById(this.state.record.id).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('审核失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    handleCommentBan = () => {
        banCommentById(this.state.record.id).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success(data.message, 1);
                }
            } else {
                message.error('禁用失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    render() {
        if (!(this.props.matchId)) {
            return <Redirect push to="/football/footballMatch"/>;
        }
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;
        const AddDialog = Form.create()(CommentAddDialog);
        const ModifyDialog = Form.create()(CommentModifyDialog);

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
            title: '用户',
            dataIndex: 'user',
            align: 'center',
            render: function (text, record, index) {
                if (record.user == null) {
                    return <span onClick={onNameClick.bind(this, record)} className="cursor-hand">匿名用户</span>
                }
                return <div onClick={onNameClick.bind(this, record)} className="inline cursor-hand">
                    <Avatar className="inline-block" src={record.user.avatar}/>
                    <span className="inline-block ml-s mt-n mb-n">{record.user.name}</span>
                </div>
            },
        }, {
            title: '内容',
            dataIndex: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按内容查找"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            width: '50%',
            align: 'center',
            render: function (text, record, index) {
                return <a onClick={onNameClick.bind(this, record)}>{record.content}</a>;
            },
        }, {
            title: '状态',
            key: 'status',
            filters: [
                {text: '未审核', value: 0},
                {text: '已审核', value: 1},
                {text: '已禁用', value: 2},
            ],
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                if (record.status == null) {
                    return "未审核";
                }
                let status = "未审核";
                switch (record.status) {
                    case 0:
                        status = "未审核";
                        break;
                    case 1:
                        status = "已审核";
                        break;
                    case 2:
                        status = "已禁用";
                        break;
                    default :
                        status = "未审核";
                }
                return record.updatedAt ? <Tooltip title={"更新时间：" + parseTimeString(record.updatedAt)}>
                    {status}
                </Tooltip> : status;
            },
        }, {
            title: '创建时间',
            key: 'createdAt',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                return (record.createdAt ? parseTimeString(record.createdAt) : "-")
            }
        },
        ];
        const columns_moblie = [{
            title: '内容',
            dataIndex: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            width: '80%',
            align: 'center',
            render: function (text, record, index) {
                return <a onClick={onNameClick.bind(this, record)}>{record.content}</a>;
            },
        }, {
            title: '状态',
            key: 'status',
            filters: [
                {text: '未审核', value: 0},
                {text: '已审核', value: 1},
                {text: '已禁用', value: 2},
            ],
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                if (record.status == null) {
                    return "未审核";
                }
                let status = "未审核";
                switch (record.status) {
                    case 0:
                        status = "未审核";
                        break;
                    case 1:
                        status = "已审核";
                        break;
                    case 2:
                        status = "已禁用";
                        break;
                    default :
                        status = "未审核";
                }
                return record.updatedAt ? <Tooltip title={"更新时间：" + parseTimeString(record.updatedAt)}>
                    {status}
                </Tooltip> : status;
            },
        }
        ];
        return (<div><Table columns={isMobile ? columns_moblie : columns}
                            rowKey={record => record.id}
                            rowSelection={isMobile ? null : rowSelection}
                            dataSource={this.state.data}
                            pagination={this.state.pagination}
                            loading={this.state.loading}
                            onChange={this.handleTableChange}
                            bordered
                            title={() =>
                                <div>
                                    <Button type="primary" shape="circle" icon="plus"
                                            onClick={this.showCommentAddDialog}/>
                                    <Button type="danger" shape="circle" icon="delete"
                                            hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                            onClick={this.handleCommentsDelete}>{selectedRowKeys.length}</Button>
                                    <Button type="primary"
                                            hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                            onClick={this.handleCommentsPass}>审核({selectedRowKeys.length})</Button>
                                    <Button type="primary"
                                            hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                            onClick={this.handleCommentsBan}>禁用({selectedRowKeys.length})</Button>
                                    <Button type="primary"
                                            hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                            onClick={this.handleCommentsPend}>取消审核({selectedRowKeys.length})</Button>
                                    <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                            loading={this.state.loading}
                                            onClick={this.refresh}/>
                                </div>
                            }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加评论"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleCommentAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleCommentAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleCommentAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible} matchId={this.props.matchId}
                           ref={this.saveCommentAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改评论"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleCommentDelete}>删除</Button>,
                    <Button key="pass" type="primary" className="pull-left"
                            onClick={this.handleCommentPass}>审核</Button>,
                    <Button key="ban" type="primary" className="pull-left"
                            onClick={this.handleCommentBan}>禁用</Button>,
                    <Button key="pend" type="primary" className="pull-left"
                            onClick={this.handleCommentPend}>取消审核</Button>,
                    <Button key="back" onClick={this.handleCommentModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleCommentModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleCommentModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveCommentModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentTable);