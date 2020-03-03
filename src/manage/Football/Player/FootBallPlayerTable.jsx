import React from 'react';
import {Table, Input, Button, Icon, Modal, Tag, Tooltip} from 'antd';
import {getAllPlayers} from '../../../axios/index';
import {mergeJSON} from '../../../utils/index';
import {Avatar} from 'antd';
import {delPlayerByIds, updatePlayerById, createPlayer} from "../../../axios";
import {Form, message, notification} from "antd/lib/index";
import FootBallPlayerAddDialog from "../Player/FootBallPlayerAddDialog"
import FootBallPlayerModifyDialog from "../Player/FootBallPlayerModifiyDialog"
import {parseTimeStringYMD, getYearOld} from "../../../utils";
import defultAvatar from '../../../static/avatar.jpg';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';

const positions =
    [{title: "门将", value: "gk"}, {title: "教练", value: "co"}, {title: "后卫", value: "b"},
        {title: "右边后卫", value: "rwb"}, {title: "右后卫", value: "rb"},
        {title: "右中后卫", value: "rcb"}, {title: "中后卫", value: "cb"}, {title: "左中后卫", value: "lcb"},
        {title: "左后卫", value: "lb"}, {title: "左边后卫", value: "lwb"}, {title: "攻击型后卫", value: "ab"},
        {title: "清道夫", value: "sw"}, {title: "中场", value: "m"}, {title: "右后腰", value: "rcdm"},
        {title: "后腰", value: "cdm"}, {title: "左后腰", value: "lcdm"}, {title: "右边中场", value: "rwm"},
        {title: "右中场", value: "rm"}, {title: "右中中场", value: "rcm"}, {title: "中中场", value: "cm"},
        {title: "左中中场", value: "lcm"}, {title: "左中场", value: "lm"}, {title: "左边中场", value: "lwm"},
        {title: "右前腰", value: "rcam"}, {title: "前腰", value: "cam"}, {title: "左前腰", value: "lcam"},
        {title: "前锋", value: "f"}, {title: "右前锋", value: "rf"}, {title: "中前锋", value: "cf"},
        {title: "左前锋", value: "lf"}, {title: "右边锋", value: "rw"}, {title: "右中锋", value: "rs"},
        {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"},];

class FootBallPlayerTable extends React.Component {
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
        params["areatype"] = 2;
        this.setState({loading: true});
        getAllPlayers(params).then((data) => {
            if (data && data.code == 200) {
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
                message.error('获取球员列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    deleteMulti = () => {
        delPlayerByIds({id: this.state.selectedRowKeys}).then((data) => {
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
    delete = () => {
        delPlayerByIds({id: [this.state.record.id]}).then((data) => {
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
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showPlayerModifyDialog();
    };
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
    showPlayerAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showPlayerModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    savePlayerDialogRef = (form) => {
        this.formAdd = form;
    };
    savePlayerModifyDialogRef = (form) => {
        this.formModify = form;
    };
    handlePlayerAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handlePlayerModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handlePlayerAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["birthdate"] = values["birthdate"] ? values["birthdate"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["careerTime"] = values["careerTime"] ? values["careerTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["retireTime"] = values["retireTime"] ? values["retireTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deleteTime"] = values["deleteTime"] ? values["deleteTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            createPlayer(values).then((data) => {
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
    handlePlayerModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["birthdate"] = values["birthdate"] ? values["birthdate"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["careerTime"] = values["careerTime"] ? values["careerTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["retireTime"] = values["retireTime"] ? values["retireTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deleteTime"] = values["deleteTime"] ? values["deleteTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            updatePlayerById(values).then((data) => {
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
    getPositionName = (p) => {
        let title = "";
        positions.forEach((item, index) => {
            if (item.value == p) {
                title = item.title;
            }
        });
        return title;
    }
    handleDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.delete,
            deleteCols: 1,
        });
    }
    handleDeleteMulti = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteMulti,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    getPosition = (record) => {
        if (record ? record.position == null : true) {
            return null;
        }
        const positionName = this.getPositionName;
        let position = [];
        let i = 0;
        position = eval(record.position);
        let dom = [];
        position.forEach((item, index) => {
            dom.push(<Tag key={i} color="#001529">{positionName(item)}</Tag>)
            i = i + 1;
        });
        return <div className="center">{dom}</div>;
    };

    render() {
        const getPosition = this.getPosition;
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;

        const AddDialog = Form.create()(FootBallPlayerAddDialog);
        const ModifyDialog = Form.create()(FootBallPlayerModifyDialog);

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
            align: 'center',
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
            width: '30%',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.headImg ? record.headImg : defultAvatar}/>
                    <p className="ml-s cursor-hand"
                       onClick={onNameClick.bind(this, record)}>{record.name}{record.englishName ? "(" + record.englishName + ")" : ""}</p>
                </div>;
            },
        }, {
            title: '擅长位置',
            dataIndex: 'position',
            align: 'center',
            render: function (text, record, index) {
                return getPosition(record);
            },
            width: '15%',
        }, {
            title: '国籍',
            align: 'center',
            dataIndex: 'country',
            width: '10%',
            render: function (text, record, index) {
                return <p>{record.country ? record.country : "-"}/{record.city ? record.city : "-"}</p>
            }
        }, {
            title: '身高',
            align: 'center',
            dataIndex: 'height',
            width: '7%',
            render: function (text, record, index) {
                return <p>{record.height ? record.height + "cm" : "-"}</p>
            }
        }, {
            title: '体重',
            align: 'center',
            dataIndex: 'weight',
            width: '7%',
            render: function (text, record, index) {
                return <p>{record.weight ? record.weight + "kg" : "-"}</p>
            }
        }, {
            title: '年龄',
            align: 'center',
            width: '6%',
            render: function (text, record, index) {
                return <p>{record.birthdate ? getYearOld(record.birthdate) : "-"}</p>
            }
        }, {
            title: '生日',
            align: 'center',
            dataIndex: 'birthdate',
            width: '10%',
            render: function (text, record, index) {
                return <p>{record.birthdate ? parseTimeStringYMD(record.birthdate) : "-"}</p>
            }
        }, {
            title: '备注',
            align: 'center',
            dataIndex: 'remark',
            width: '15%',
        },
        ];
        const columns_moblie = [{
            title: '名字',
            align: 'center',
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
            width: '100%',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.headImg ? record.headImg : defultAvatar}/>
                    <p className="ml-s cursor-hand"
                       onClick={onNameClick.bind(this, record)}>{record.name}{record.englishName ? "(" + record.englishName + ")" : ""}</p>
                </div>;
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
                           size="small"
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary" shape="circle" icon="plus"
                                               onClick={this.showPlayerAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleDeleteMulti}>
                                           {selectedRowKeys.length}
                                       </Button>
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
                width={600}
                visible={this.state.dialogAddVisible}
                title="添加球员"
                okText="确定"
                onCancel={this.handlePlayerAddCancel}
                destroyOnClose="true"
                onOk={this.handlePlayerAddCreate}
            >
                <AddDialog
                    visible={this.state.dialogAddVisible}
                    ref={this.savePlayerDialogRef}/>
            </Modal>

            <Modal
                width={600}
                visible={this.state.dialogModifyVisible}
                title="编辑球员"
                footer={[
                    <Button key="detail" type="primary" className="pull-left">
                        <Link to={
                            `/football/footballPlayer/${this.state.record.id}`
                        }>详细设置</Link>
                    </Button>,
                    <Button key="detail" type="danger" className="pull-left"
                            onClick={this.handleDelete}>删除</Button>,
                    <Button key="back" onClick={this.handlePlayerModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handlePlayerModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handlePlayerModifyCancel}
                destroyOnClose="true"
            >
                <ModifyDialog
                    visible={this.state.dialogModifyVisible}
                    ref={this.savePlayerModifyDialogRef}
                    record={this.state.record}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallPlayerTable);