import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {message, Input, Icon, Tooltip, Button, Table, Modal, Avatar} from 'antd';
import {
    getBbsBoard,
    deleteBbsBoard,
    addBbsBoard,
    updateBbsBoard,
} from "../../axios";
import {mergeJSON, parseTimeString} from "../../utils";
import {Link, Redirect} from 'react-router-dom';
import {Form} from "antd/lib/index";
import BbsBoardAddDialog from "../Bbs/BbsBoardAddDialog";
import BbsBoardModifyDialog from "../Bbs/BbsBoardModifyDialog";
import defultAvatar from "../../static/avatar.jpg";

class BbsBoardTable extends React.Component {
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
            pageSize: this.state.pagination.pageSize,
            pageNum: 1
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getBbsBoard(params).then((data) => {
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
                message.error('获取bbs板块列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        const pager = {...this.state.pagination};
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    deleteBbsBoard = () => {
        deleteBbsBoard({id: [this.state.record.id], force: this.state.deleteFlag}).then((data) => {
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
        pager.filters = this.getTableFilters(pager, filters);
        this.setState({
            pagination: pager,
        });
        this.fetch({
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
            pager.filters["name"] = searchText;
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
    saveBbsBoardAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveBbsBoardModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showBbsBoardAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showBbsBoardModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleBbsBoardAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleBbsBoardModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleBbsBoardAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.bbsClassList) {
                values.bbsClassList = values.bbsClassList.map((item, index) => {
                    return {name: item, sortIndex: index}
                });
            }
            addBbsBoard(values).then((data) => {
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
    handleBbsBoardModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateBbsBoard(values).then((data) => {
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
    handleBbsBoardDelete = (flag) => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteBbsBoard,
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
        const AddDialog = Form.create()(BbsBoardAddDialog);
        const ModifyDialog = Form.create()(BbsBoardModifyDialog);
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
            title: '版块名称',
            dataIndex: 'name',
            align: 'center',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按名称查找"
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
        }, {
            title: '状态',
            key: 'delFlag',
            filters: [
                {text: '未删除', value: false},
                {text: '已删除', value: true},
            ],
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                if (record.delFlag == null) {
                    return "未删除";
                }
                let status = "未删除";
                switch (record.delFlag) {
                    case false:
                        status = "未删除";
                        break;
                    case true:
                        status = "已删除";
                        break;
                    default :
                        status = "未删除";
                }
                return status;
            },
        }, {
            title: '创建时间',
            key: 'createTime',
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                return (record.createTime ? parseTimeString(record.createTime) : "-")
            }
        }, {
            title: '查看分类',
            key: 'bbsClassList',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                return <Link to={`/bbs/class?boardId=${record.id}`}><span className="cursor-hand">查看分类</span></Link>
            }
        },
        ];
        return (<div><Table columns={columns}
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
                                            onClick={this.showBbsBoardAddDialog}/>
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
                title="添加bbs板块"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleBbsBoardAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleBbsBoardAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleBbsBoardAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible} matchId={this.props.matchId}
                           ref={this.saveBbsBoardAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改bbs板块"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleBbsBoardDelete.bind(this, false)}>删除</Button>,
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleBbsBoardDelete.bind(this, true)}>强制删除</Button>,
                    <Button key="back" onClick={this.handleBbsBoardModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleBbsBoardModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleBbsBoardModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveBbsBoardModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(BbsBoardTable);