import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip} from 'antd';
import {getAllRoles} from '../../axios/index';
import {mergeJSON} from '../../utils/index';
import {delRoleByIds, updateRoleById, createRole} from "../../axios";
import {Form, message} from "antd/lib/index";
import RoleAddDialog from './RoleAddDialog';
import RoleModifyDialog from './RoleModifyDialog';
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";


class RoleTable extends React.Component {
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
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getAllRoles(params).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                    selectedRowKeys: [],
                });
            } else {
                message.error('获取权限列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
        this.setState({selectedRowKeys: []});
    }
    deleteRole = () => {
        delRoleByIds({id: [this.state.record.id]}).then((data) => {
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
    deleteRoles = () => {
        delRoleByIds({id: this.state.selectedRowKeys}).then((data) => {
            this.setState({deleteVisible: false});
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
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onSearch = () => {
        const {searchText} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            pagination: pager,
        });
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: 1,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            ...pager.filters,
        });
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showRoleModifyDialog();
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
    saveRoleAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveRoleModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showRoleAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showRoleModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleRoleAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleRoleModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleRoleAddCreate = () => {
        const form = this.formAdd;
        const packingValues = this.packingValues;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            packingValues(values);
            createRole(values).then((data) => {
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
    handleRoleModifyCreate = () => {
        const form = this.formModify;
        const packingValues = this.packingValues;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            packingValues(values);
            updateRoleById(values).then((data) => {
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
    handleRoleDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteRole,
            deleteCols: 1,
        });
    }
    handleRolesDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteRoles,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    packingValues = (values) => {
        const menuList = values.permissions;
        const list = [];
        if (menuList) {
            menuList.forEach((item, index) => {
                list.push({id: item})
            })
            values.permissions = list;
        }
    }
    getRoleTip = (param) => {
        let dom = [];
        param.permissions && param.permissions.forEach((item, index) => {
            dom.push(<p key={`permission-${item.id}`}>{item.name}</p>);
        });
        return dom;
    }

    render() {
        const getRoleTip = this.getRoleTip;
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;

        const AddDialog = Form.create()(RoleAddDialog);
        const ModifyDialog = Form.create()(RoleModifyDialog);

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
            dataIndex: 'id',
            key: 'id',
            width: '20%',
            align: 'center',
        }, {
            title: '名字',
            key: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
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
                return <Tooltip placement="rightTop" title={
                    getRoleTip(record)
                }>
                    <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a>
                </Tooltip>;
            },
        },
            // {
            //     title: '',
            //     key: '操作',
            //     width: 50,
            //     fixed: 'right',
            //     render: function (text, record, index) {
            //         return <span><UserDropDownMenu record={record} onComplete={onComplete}/></span>
            //     },
            // }
        ];
        const columns_moblie = [{
            title: '名字',
            key: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
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
            width: '100%',
            align: 'center',
            render: function (text, record, index) {
                if (isMobile) {
                    return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a>;
                }
                return <Tooltip placement="rightTop" title={
                    getRoleTip(record)
                }>
                    <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a>
                </Tooltip>;
            },
        },
        ];
        return <div><Table columns={isMobile ? columns_moblie : columns}
                           rowKey={record => record.id}
                           rowSelection={isMobile ? null : rowSelection}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                           bordered
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary" shape="circle" icon="plus"
                                               onClick={this.showRoleAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleRolesDelete}>{selectedRowKeys.length}</Button>
                                   </Tooltip>
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
                title="添加权限"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleRoleAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleRoleAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleRoleAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveRoleAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改权限"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleRoleDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleRoleModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleRoleModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleRoleModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveRoleModifyDialogRef}/>
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
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleTable);