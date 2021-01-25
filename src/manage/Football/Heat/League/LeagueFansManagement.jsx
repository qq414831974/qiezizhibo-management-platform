import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar, Select} from 'antd';
import {
    getLeagueFans,
    deleteLeagueFans,
    updateLeagueFans,
    addLeagueFans,
    getTeamInLeague
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import LeagueFansAddDialog from "../League/LeagueFansAddDialog"

const Option = Select.Option;

class LeagueFansManagement extends React.Component {
    state = {
        data: [],
        teamdata: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        dialogModifyVisible: false,
        dialogAddVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
        this.fetchTeams();
    };

    fetchTeams = () => {
        getTeamInLeague(this.props.leagueId).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    teamdata: data.data.records,
                });
            } else {
                message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    fetch = (params = {}) => {
        this.setState({loading: true});
        getLeagueFans({leagueId: this.props.leagueId, ...params}).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                });
            } else {
                message.error('获取粉丝列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    deleteLeagueFans = () => {
        deleteLeagueFans({
            userNo: this.state.record.userNo,
            leagueId: this.state.record.leagueId,
            teamId: this.state.record.teamId
        }).then((data) => {
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
    onInputChange = (e) => {
        this.setState({searchText: e}, () => {
            this.onSearch();
        });
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
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.handleLeagueFansDelete();
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
            pager.filters["teamId"] = searchText;
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
    saveLeagueFansAddDialogRef = (form) => {
        this.formAdd = form;
    }
    showLeagueFansAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleLeagueFansAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleLeagueFansAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            addLeagueFans(values).then((data) => {
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
    handleLeagueFansDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteLeagueFans,
            deleteCols: 1,
        });
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }

    render() {
        const onNameClick = this.onNameClick;

        const AddDialog = Form.create()(LeagueFansAddDialog);

        const isMobile = this.props.responsive.data.isMobile;

        const columns = [{
            title: '用户',
            dataIndex: 'userNo',
            key: 'userNo',
            align: 'center',
            width: '40%',
            render: function (text, record, index) {
                if (record.user) {
                    return <div className="center"><Avatar src={record.user.avatar ? record.user.avatar : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.user.name}</a></div>;
                }
                return <span>{record.userNo}</span>;
            },
        }, {
            title: '队伍',
            key: 'teamId',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <div className="w-full center">按队伍搜索</div>
                    <Select
                        className="mt-s"
                        style={{minWidth: 300}}
                        placeholder="选择队伍"
                        loading={this.state.loading}
                        onChange={this.onInputChange}
                    >
                        {this.state.teamdata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
                            <div className="center">
                                <Avatar src={d ? d.headImg : logo}/>
                                <p className="ml-s">{d ? d.name : ""}</p>
                            </div>
                        </Option>)}
                    </Select>
                </div>
            ),
            filterIcon: <Icon type="search" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
            width: '40%',
            align: 'center',
            render: function (text, record, index) {
                if (record.team) {
                    return <div className="center"><Avatar src={record.team.headImg ? record.team.headImg : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.team.name}</a></div>;
                }
                return <span>{record.teamId}</span>;
            },
        }, {
            title: '加入时间',
            key: 'joinTime',
            dataIndex: 'joinTime',
            align: 'center',
            width: '20%',
        },
        ];
        return <div><Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                           bordered
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary" shape="circle" icon="plus"
                                               onClick={this.showLeagueFansAddDialog}/>
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
                title="添加粉丝"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleLeagueFansAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleLeagueFansAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleLeagueFansAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           leagueId={this.props.leagueId}
                           ref={this.saveLeagueFansAddDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueFansManagement);