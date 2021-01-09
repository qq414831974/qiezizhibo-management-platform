import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio} from 'antd';
import {getAllRoles, getAllAdminUser} from '../../axios/index';
import {mergeJSON} from '../../utils/index';
import {Avatar} from 'antd';
import {delAdminUserByIds, updateAdminUserById, createAdminUser, resetAdminUserPassword} from "../../axios";
import {Form, message} from "antd/lib/index";
import UserAddDialog from './UserAddDialog';
import UserModifyDialog from './UserModifyDialog';
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from '../../static/logo.png';


class UserTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 5, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        selectedRowKeys: [],
        dialogModifyVisible: false,
        dialogAddVisible: false,
        record: {},
        nameRadioValue: "name",
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getAllAdminUser(params).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data.records,
                    pagination,
                    selectedRowKeys: [],
                });
            } else {
                message.error('获取用户列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    deleteUser = () => {
        delAdminUserByIds({adminId: [this.state.record.id]}).then((data) => {
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
    deleteUsers = () => {
        delAdminUserByIds({adminId: this.state.selectedRowKeys}).then((data) => {
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
    resetAdminUserPassword = () => {
        resetAdminUserPassword({id: this.state.record.id}).then(data => {
            this.setState({resetVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('重置密码成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('重置密码失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        })
    }

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
        this.showUserModifyDialog();
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
        if (this.state.nameRadioValue && searchText != null && searchText != '') {
            pager.filters[this.state.nameRadioValue] = searchText;
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
    saveUserAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveUserModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showUserAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showUserModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleUserAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleUserModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleUserAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.roles) {
                values.roles = values.roles.flatMap(role => {
                    const r = {};
                    r["id"] = role
                    return r;
                })
            }
            createAdminUser(values).then((data) => {
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
    handleUserModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.roles) {
                values.roles = values.roles.flatMap(role => {
                    const r = {};
                    r["id"] = role
                    return r;
                })
            }
            updateAdminUserById(values).then((data) => {
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
    handleUserDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteUser,
            deleteCols: 1,
        });
    }
    handleUserPasswordReset = () => {
        this.setState({
            resetVisible: true,
        });
    }
    handleUsersDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteUsers,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    handleResetCancel = () => {
        this.setState({resetVisible: false});
    }
    getMenuList = (param) => {
        let dom = [];
        param.forEach(role => {
            role.permissions && role.permissions.forEach((item, index) => {
                dom.push(<p key={`permission-${item.id}`}>{item.name}</p>);
            });
        })
        return dom;
    }
    onNameDropDownRadioChange = (e) => {
        this.setState({
            nameRadioValue: e.target.value,
        });
    }

    render() {
        const getMenuList = this.getMenuList;
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;

        const AddDialog = Form.create()(UserAddDialog);
        const ModifyDialog = Form.create()(UserModifyDialog);

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
            title: '名字',
            dataIndex: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <div>
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="搜索"
                            value={this.state.searchText}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    </div>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.nameRadioValue}>
                            <Radio value={"name"}>按昵称</Radio>
                            <Radio value={"userName"}>按用户名</Radio>
                            <Radio value={"phone"}>按电话</Radio>
                        </Radio.Group>
                    </div>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.avatar ? record.avatar : logo}/>
                    <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a></div>;
            },
        }, {
            title: '角色',
            key: 'roleName',
            width: '15%',
            align: 'center',
            render: function (text, record, index) {
                if (record.roles == null) {
                    return "无";
                }
                // return <Tooltip title={getMenuList(record.roles)}>
                //     {record.roles ? record.roles.flatMap((role) => role.name).toString() : "未知"}
                // </Tooltip>;
                return <span>{record.roles ? record.roles.flatMap((role) => role.name).toString() : "未知"}</span>
            },
        }, {
            title: '状态',
            key: 'status',
            filterMultiple: false,
            filters: [
                {text: '启用', value: 1},
                {text: '禁用', value: 2},
                {text: '删除', value: 3},
            ],
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                let status = "未知"
                switch (record.status) {
                    case 1 :
                        status = "启用";
                        break;
                    case 2 :
                        status = "禁用";
                        break;
                    case 3 :
                        status = "删除";
                        break;
                }
                return status;
            },
        }, {
            title: '地区',
            dataIndex: 'country',
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                let address = "";
                if (record.country) {
                    address = address + record.country;
                }
                if (record.province) {
                    address = address + "/" + record.province;
                }
                if (record.city) {
                    address = address + "/" + record.city;
                }
                return address;
            },
        }, {
            title: '部门',
            dataIndex: 'unit',
            width: '10%',
            align: 'center',
        }, {
            title: '电话',
            dataIndex: 'phone',
            width: '13%',
            align: 'center',
        }, {
            title: '邮箱',
            dataIndex: 'email',
            width: '13%',
            align: 'center',
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: '9%',
            align: 'center',
        },
        ];
        const columns_moblie = [{
            title: '名字',
            dataIndex: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <div>
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="搜索"
                            value={this.state.searchText}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    </div>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.nameRadioValue}>
                            <Radio value={"name"}>按昵称</Radio>
                            <Radio value={"userName"}>按用户名</Radio>
                            <Radio value={"phone"}>按电话</Radio>
                        </Radio.Group>
                    </div>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            align: 'center',
            width: '100%',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.avatar ? record.avatar : logo}/>
                    <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a></div>;
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
                                               onClick={this.showUserAddDialog}/></Tooltip>
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleUsersDelete}>{selectedRowKeys.length}</Button>
                                   </Tooltip>
                                   <Tooltip title="刷新">
                                       <Button type="primary" shape="circle" icon="reload"
                                               className="pull-right"
                                               loading={this.state.loading}
                                               onClick={this.refresh}/>
                                   </Tooltip>
                               </div>
                           }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                title="添加用户"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleUserAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleUserAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleUserAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveUserAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改用户"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="reset" type="primary" className="pull-left"
                            onClick={this.handleUserPasswordReset}>重置密码</Button>,
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleUserDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleUserModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleUserModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleUserModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveUserModifyDialogRef}/>
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
            <Modal
                className={isMobile ? "top-n" : ""}
                title="确认重置密码"
                visible={this.state.resetVisible}
                onOk={this.resetAdminUserPassword}
                onCancel={this.handleResetCancel}
                zIndex={1001}
            >
                <div><span className="mb-n" style={{fontSize: 16}}>是否确认重置密码？</span></div>
                <div><span className="mt-s danger" style={{fontSize: 13}}>密码将重置为默认密码</span></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);