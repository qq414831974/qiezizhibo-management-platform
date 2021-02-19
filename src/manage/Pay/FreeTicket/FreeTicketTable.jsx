import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar} from 'antd';
import {getFreeTickets, deleteFreeTickets, updateFreeTicket, addFreeTicket} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import FreeTicketAddDialog from './FreeTicketAddDialog';
import FreeTicketModifyDialog from './FreeTicketModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../static/logo.png";
import defultAvatar from "../../../static/avatar.jpg";

const freeTicketType = {
    0: "全部免费",
    1: "比赛",
    2: "联赛"
}

class FreeTicketTable extends React.Component {
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
        getFreeTickets(params).then((data) => {
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
                message.error('获取免费观看列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    deleteFreeTicket = () => {
        deleteFreeTickets({id: [this.state.record.id]}).then((data) => {
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
    deleteFreeTickets = () => {
        deleteFreeTickets({id: this.state.selectedRowKeys}).then((data) => {
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
        const {searchText, filterType} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        pager.current = 1;
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText || filterType != null,
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
        this.showFreeTicketModifyDialog();
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
        const {searchText, filterType} = this.state;
        pager.filters = {};
        if (searchText != null && searchText != '') {
            pager.filters["userNo"] = searchText;
        }
        if (filterType != null) {
            pager.filters["type"] = filterType;
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
    saveFreeTicketAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveFreeTicketModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showFreeTicketAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showFreeTicketModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleFreeTicketAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleFreeTicketModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleFreeTicketAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addFreeTicket(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        if (values.type == 0) {
                            message.success('添加成功，设置所有免费及联赛免费有5分钟延迟，请注意！', 3);
                        } else {
                            message.success('添加成功', 1);
                        }
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleFreeTicketModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            updateFreeTicket(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        if (values.type == 0) {
                            message.success('修改成功，设置所有免费及联赛免费有5分钟延迟，请注意！', 3);
                        } else {
                            message.success('修改成功', 1);
                        }
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    handleFreeTicketDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteFreeTicket,
            deleteCols: 1,
        });
    }
    handleFreeTicketsDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteFreeTickets,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    onNameDropDownRadioChange = (e) => {
        this.setState({
            filterType: e.target.value,
        });
    }

    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;

        const AddDialog = Form.create()(FreeTicketAddDialog);
        const ModifyDialog = Form.create()(FreeTicketModifyDialog);

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
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按用户id搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
                            <Radio value={0}>全部免费</Radio>
                            <Radio value={1}>比赛</Radio>
                            <Radio value={2}>联赛</Radio>
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
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
            },
        }, {
            title: '用户id',
            dataIndex: 'userNo',
            key: 'userNo',
            align: 'center',
            width: '30%',
            render: function (text, record, index) {
                if (record.user) {
                    return <div className="center"><Avatar src={record.user.avatar ? record.user.avatar : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.user.name}</a></div>;
                }
                return <span>{record.userNo}</span>;
            },
        },
            {
                title: '详细',
                key: 'externalId',
                dataIndex: 'externalId',
                align: 'center',
                width: '40%',
                render: function (text, record, index) {
                    if (record.type == 0) {
                        return <span>全部免费</span>;
                    } else if (record.type == 1) {
                        const match = record.match ? record.match : {};
                        const hostTeam = match.hostTeam;
                        const guestTeam = match.guestTeam;
                        if (hostTeam == null || guestTeam == null) {
                            return <Tooltip title={`比赛时间：${match.startTime}`}><span>{match.name}</span></Tooltip>
                        }
                        return <Tooltip title={`比赛时间：${match.startTime}`}>
                            <div className="center">
                                <Avatar src={hostTeam.headImg ? hostTeam.headImg : defultAvatar}/>
                                <p className="ml-s">{hostTeam.name}</p>
                                <p className="ml-s mr-s">VS</p>
                                <Avatar src={guestTeam.headImg ? guestTeam.headImg : defultAvatar}/>
                                <p className="ml-s">{guestTeam.name}</p>
                            </div>
                        </Tooltip>;
                    } else if (record.type == 2) {
                        const league = record.league ? record.league : {};
                        return <div className="center"><Avatar src={league.headImg ? league.headImg : defultAvatar}/>
                            <p className="ml-s">{league.name}</p>
                        </div>;
                    }
                    return <span>未知</span>;
                },
            },
            {
                title: '类型',
                key: 'type',
                dataIndex: 'type',
                align: 'center',
                width: '10%',
                render: function (text, record, index) {
                    return <span>{record.type != null ? freeTicketType[record.type] : "未知"}</span>;
                },
            },
            {
                title: '可用',
                key: 'enabled',
                dataIndex: 'enabled',
                align: 'center',
                width: '10%',
                render: function (text, record, index) {
                    return <span>{record.enabled ? "可用" : "不可用"}</span>;
                },
            }
        ];
        const columns_moblie = [{
            title: 'id',
            key: 'id',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按用户id搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
                            <Radio value={0}>全部免费</Radio>
                            <Radio value={1}>比赛</Radio>
                            <Radio value={2}>联赛</Radio>
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
            width: '50%',
            align: 'center',
            render: function (text, record, index) {
                return <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.id}</a>;
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
                                               onClick={this.showFreeTicketAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleFreeTicketsDelete}>{selectedRowKeys.length}</Button>
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
                title="添加免费观看"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleFreeTicketAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleFreeTicketAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleFreeTicketAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveFreeTicketAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改免费观看"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleFreeTicketDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleFreeTicketModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleFreeTicketModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleFreeTicketModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveFreeTicketModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FreeTicketTable);