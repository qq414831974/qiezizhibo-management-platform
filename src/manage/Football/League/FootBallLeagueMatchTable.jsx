import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip} from 'antd';
import {getAllLeagueMatchSeries} from '../../../axios/index';
import {mergeJSON} from '../../../utils/index';
import {Avatar} from 'antd';
import {delLeagueMatchById, delLeagueMatchByIds, updateLeagueMatchById, createLeagueMatch} from "../../../axios";
import {Form, message} from "antd/lib/index";
import FootBallLeagueMatchAddDialog from "../League/FootBallLeagueMatchAddDialog"
import FootBallLeagueMatchModifyDialog from "../League/FootBallLeagueMatchModifyDialog"
import {parseTimeStringYMD} from "../../../utils";
import defultAvatar from '../../../static/avatar.jpg';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import copy from 'copy-to-clipboard';

class FootBallLeagueMatchTable extends React.Component {
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
        if (params.filter) {
            params.filter = {areatype: 2, ...params.filter}
        } else {
            params.filter = {areatype: 2}
        }
        getAllLeagueMatchSeries(params).then((data) => {
            if (data && data.list) {
                const pagination = {...this.state.pagination};
                pagination.total = data ? data.total : 0;
                this.setState({
                    loading: false,
                    data: data ? data.list : "",
                    pagination,
                    selectedRowKeys: [],
                });
            } else {
                message.error('获取联赛列表失败：' + (data ? data.code + ":" + data.msg : data), 3);
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
            filter: pager.filters,
        });
    }
    deleteMultiple = () => {
        delLeagueMatchByIds(this.state.selectedRowKeys).then((data) => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.msg : data), 3);
            }
        });
    };
    deleteOne = () => {
        delLeagueMatchById(this.state.record.id).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.code + ":" + data.msg : data), 3);
            }
        });
        ;
    }
    onInputChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onSearch = () => {
        const {searchText} = this.state;
        const pager = {...this.state.pagination};
        pager.filters = mergeJSON({name: searchText}, this.state.pagination.filters);
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
            filter: pager.filters,
        });
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showLeagueMatchModifyDialog();
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        pager.filters = mergeJSON({name: this.state.searchText}, filters);
        this.setState({
            pagination: pager,
        });
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            sortField: pager.sortField,
            sortOrder: pager.sortOrder,
            filter: pager.filters,
        });
    }
    saveLeagueMatchDialogRef = (form) => {
        this.formAdd = form;
    };
    saveLeagueMatchModifyDialogRef = (form) => {
        this.formModify = form;
    };
    showLeagueMatchAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showLeagueMatchModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleLeagueMatchAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleLeagueMatchModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleLeagueMatchAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["datebegin"] = values["datebegin"] ? values["datebegin"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["dateend"] = values["dateend"] ? values["dateend"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createtime"] = values["createtime"] ? values["createtime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["updatetime"] = values["updatetime"] ? values["updatetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deletetime"] = values["deletetime"] ? values["deletetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            createLeagueMatch(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.msg, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.code + ":" + data.msg : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleLeagueMatchModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["datebegin"] = values["datebegin"] ? values["datebegin"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["dateend"] = values["dateend"] ? values["dateend"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createtime"] = values["createtime"] ? values["createtime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["updatetime"] = values["updatetime"] ? values["updatetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deletetime"] = values["deletetime"] ? values["deletetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            updateLeagueMatchById(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    } else {
                        message.warn(data.msg, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.msg : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    handleLeagueDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteOne,
            deleteCols: 1,
        });
    }
    handleLeaguesDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteMultiple,
            deleteCols: this.state.selectedRowKeys ? this.state.selectedRowKeys.length : 0,
        })
    }
    handleDeleteCancel = () => {
        this.setState({deleteVisible: false});
    }
    getModifyFooter = (record) => {
        if (record && record.isparent) {
            return [
                <Button key="view" type="primary" className="pull-left">
                    <Link to={
                        `/football/footballLeagueSeries/${this.state.record.id}`
                    }>浏览联赛</Link>
                </Button>,
                <Button key="delete" type="danger" className="pull-left"
                        onClick={this.handleLeagueDelete}>删除</Button>,
                <Button key="back" onClick={this.handleLeagueMatchModifyCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.handleLeagueMatchModifyCreate}>
                    确定
                </Button>
            ]
        }
        return [
            <Button key="detail" type="primary" className="pull-left">
                <Link to={
                    `/football/footballLeagueMatch/${this.state.record.id}`
                }>详细设置</Link>
            </Button>,
            <Button key="view" type="primary" className="pull-left">
                <Link to={
                    `/football/footballMatch?leagueId=${this.state.record.id}`
                }>浏览比赛</Link>
            </Button>,
            <Button key="delete" type="danger" className="pull-left"
                    onClick={this.handleLeagueDelete}>删除</Button>,
            <Button key="back" onClick={this.handleLeagueMatchModifyCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.handleLeagueMatchModifyCreate}>
                确定
            </Button>
        ]
    }

    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;
        const AddDialog = Form.create()(FootBallLeagueMatchAddDialog);
        const ModifyDialog = Form.create()(FootBallLeagueMatchModifyDialog);

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
            sorter: true,
            align: 'center',
            dataIndex: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        xplaceholder="Search name"
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
            width: '35%',
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.headimg ? record.headimg : defultAvatar}/>
                    <p className="ml-s cursor-hand"
                       onClick={onNameClick.bind(this, record)}>{record.name}{record.englishname ? "(" + record.englishname + ")" : ""}</p>
                </div>;
            },
        }, {
            title: '地点',
            align: 'center',
            dataIndex: 'country',
            width: '10%',
            render: function (text, record, index) {
                return <p>{record.country ? record.country : "-"}/{record.city ? record.city : "-"}</p>
            }
        }, {
            title: '时间',
            align: 'center',
            dataIndex: 'datebegin',
            width: '20%',
            render: function (text, record, index) {
                return <p>{(record.datebegin ? parseTimeStringYMD(record.datebegin) : "-") + "~" + (record.dateend ? parseTimeStringYMD(record.dateend) : "-")}</p>
            }
        }, {
            title: '类型',
            align: 'center',
            dataIndex: 'isparent',
            width: '10%',
            render: function (text, record, index) {
                return <p>{(record.isparent ? "系列赛" : "联赛")}</p>
            }
        }, {
            title: <Tooltip title="排序从9-0开始代表在首页的排序顺序，9第一位，8第二位以此类推"><span>排序</span></Tooltip>,
            align: 'center',
            dataIndex: 'remark',
            width: '10%',
        },
            {
                title: <span>轮播id</span>,
                align: 'center',
                width: '5%',
                render: function (text, record, index) {
                    return <p className="cursor-hand" onClick={() => {
                        copy(`../leagueManager/leagueManager?id=${record.id}`);
                        message.success('轮播链接已复制到剪贴板');
                    }}>{record.id ? `${record.id}` : "-"}</p>
                }
            },
        ];
        const columns_mobile = [{
            title: '名字',
            sorter: true,
            align: 'center',
            dataIndex: 'name',
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
            render: function (text, record, index) {
                return <div className="center"><Avatar src={record.headimg ? record.headimg : defultAvatar}/>
                    <p className="ml-s cursor-hand"
                       onClick={onNameClick.bind(this, record)}>{record.name}{record.englishname ? "(" + record.englishname + ")" : ""}</p>
                </div>;
            },
        }
        ];
        return <div><Table columns={isMobile ? columns_mobile : columns}
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
                                               onClick={this.showLeagueMatchAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleLeaguesDelete}>{selectedRowKeys.length}
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
                key="dialog-add"
                className={isMobile ? "top-n" : ""}
                width={700}
                visible={this.state.dialogAddVisible}
                title="添加联赛"
                okText="确定"
                onCancel={this.handleLeagueMatchAddCancel}
                destroyOnClose="true"
                onOk={this.handleLeagueMatchAddCreate}
            >
                <AddDialog
                    visible={this.state.dialogAddVisible}
                    ref={this.saveLeagueMatchDialogRef}/>
            </Modal>

            <Modal
                key="dialog-modify"
                className={isMobile ? "top-n" : ""}
                width={700}
                visible={this.state.dialogModifyVisible}
                title="编辑球队"
                okText="确定"
                onCancel={this.handleLeagueMatchModifyCancel}
                destroyOnClose="true"
                onOk={this.handleLeagueMatchModifyCreate}
                footer={this.getModifyFooter(this.state.record)}
            >
                <ModifyDialog
                    visible={this.state.dialogModifyVisible}
                    ref={this.saveLeagueMatchModifyDialogRef}
                    record={this.state.record}/>
            </Modal>
            <Modal
                key="dialog-delete"
                className={isMobile ? "top-n" : ""}
                title="确认删除"
                visible={this.state.deleteVisible}
                onOk={this.state.handleDeleteOK}
                onCancel={this.handleDeleteCancel}
                zIndex={1001}
            >
                <p style={{fontSize: 14}}>是否确认删除{this.state.deleteCols}条数据？</p>
                <p className="mb-n text-danger">注意：删除联赛将删除联赛所有比赛数据！！！</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchTable);