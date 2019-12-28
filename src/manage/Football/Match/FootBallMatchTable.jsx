import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Upload, Radio} from 'antd';
import {getAllMatchs} from '../../../axios/index';
import {mergeJSON} from '../../../utils/index';
import {Avatar} from 'antd';
import {
    delMatchByIds,
    updateMatchById,
    createMatch,
    delMatchById,
    addMatchSchedule,
    uploaddocx_match,
    updateMatchScoreStatusById,
} from "../../../axios";
import {Form, message, notification} from "antd/lib/index";
import FootBallMatchAddDialog from "../Match/FootBallMatchAddDialog"
import FootBallMatchModifyDialog from "../Match/FootBallMatchModifyDialog"
import FootBallMatchScoreDialog from "../Match/FootBallMatchScoreDialog"
import {parseTimeString} from "../../../utils";
import defultAvatar from '../../../static/avatar.jpg';
import {Link} from 'react-router-dom';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const status = {
    0: {text: "比赛开始"},
    14: {text: "中场"},
    15: {text: "下半场"},
    13: {text: "伤停"},
    11: {text: "加时"},
    12: {text: "点球大战"},
    21: {text: "比赛结束"},
    16: {text: "暂停"},
}
const TIME_LINE = 1;
const STATISTICS = 2;
const PLAY_LIST = 3;
const CHATTING_ROOM = 4;
const RECOMMOMED = 5;

class FootBallMatchTable extends React.Component {
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
        dialogScoreVisible: false,
        dialogStatusVisible: false,
    };

    componentDidMount() {
        if (this.props.leagueId != null) {
            this.setState({pagination: {pageSize: 10, filters: {leaguematchId: this.props.leagueId}}});
            this.fetch({
                pageSize: this.state.pagination.pageSize,
                pageNum: 1,
                filter: {leaguematchId: this.props.leagueId}
            });
        } else {
            this.fetch({
                pageSize: this.state.pagination.pageSize,
                pageNum: 1,
            });
        }
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        if (params.filter) {
            params.filter = {areatype: 2, ...params.filter}
        } else {
            params.filter = {areatype: 2}
        }
        getAllMatchs(params).then((data) => {
            if (data && data.list) {
                const pagination = {...this.state.pagination};
                pagination.total = data ? data.total : 0;
                pagination.current = data ? data.pageNum : 0;
                this.setState({
                    loading: false,
                    data: data ? data.list : "",
                    pagination,
                    selectedRowKeys: [],
                });
            } else {
                message.error('获取比赛列表失败：' + (data ? data.result + "-" + data.msg : data), 3);
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
    delete = () => {
        delMatchById(this.state.record.id).then((data) => {
            this.setState({deleteVisible: false, dialogModifyVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    };
    deleteMulti = () => {
        delMatchByIds(this.state.selectedRowKeys).then((data) => {
            this.setState({deleteVisible: false});
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('删除成功', 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    };
    onSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys);
        this.setState({selectedRowKeys});
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
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        if (this.props.leagueId == null) {
            pager.filters = mergeJSON({name: this.state.searchText}, filters);
        } else {
            pager.filters = mergeJSON({name: this.state.searchText, leaguematchId: this.props.leagueId}, filters);
        }
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
    handleMatchAdd = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["starttime"] = values["starttime"] ? values["starttime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["endtime"] = values["endtime"] ? values["endtime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createtime"] = values["createtime"] ? values["createtime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["updatetime"] = values["updatetime"] ? values["updatetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deletetime"] = values["deletetime"] ? values["deletetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            createMatch(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('添加成功', 1);
                    } else {
                        message.warn(data.msg, 1);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.result + "-" + data.msg : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogAddVisible: false});
        });
    };
    handleMatchModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["starttime"] = values["starttime"] ? values["starttime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["endtime"] = values["endtime"] ? values["endtime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createtime"] = values["createtime"] ? values["createtime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["updatetime"] = values["updatetime"] ? values["updatetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["deletetime"] = values["deletetime"] ? values["deletetime"].format('YYYY/MM/DD HH:mm:ss') : null;
            updateMatchById(values).then((data) => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 1);
                    } else {
                        message.warn(data.msg, 1);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.result + "-" + data.msg : data), 3);
                }
            });
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    saveMatchDialogRef = (form) => {
        this.formAdd = form;
    };
    saveMatchModifyDialogRef = (form) => {
        this.formModify = form;
    };
    showMatchModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    showMatchAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleMatchAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleMatchModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showMatchModifyDialog();
    };
    onScoreClick = (record, e) => {
        this.setState({
            record: record,
            statusDialogRadio: record.status,
            statusDialogScore: record.score,
            statusDialogPenaltyScore: record.penaltyscore
        });
        const matchType = record ? (record.type ? eval(record.type) : []) : [];
        if (matchType.indexOf(TIME_LINE) >= 0) {
            this.showScoreDialog();
        } else {
            this.showStatusDialog();
        }
    };

    onStatusDialogRaidoChange = (e) => {
        this.setState({statusDialogRadio: e.target.value});

    }
    onStatusDialogScoreChange = (e) => {
        this.setState({statusDialogScore: e.target.value});
    }
    onStatusDialogPenaltyScoreChange = (e) => {
        this.setState({statusDialogPenaltyScore: e.target.value});
    }
    handleMatchStatusConfirm = () => {
        console.log(this.state.record)
        updateMatchScoreStatusById({
            id: this.state.record.id,
            status: this.state.statusDialogRadio,
            score: this.state.statusDialogScore,
            penaltyscore: this.state.statusDialogPenaltyScore,
        }).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.refresh();
                    message.success('修改成功', 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
        this.setState({dialogStatusVisible: false});
    }
    showScoreDialog = () => {
        this.setState({dialogScoreVisible: true});
    }
    showStatusDialog = () => {
        this.setState({dialogStatusVisible: true});
    }
    handleMatchScoreCancel = () => {
        this.setState({dialogScoreVisible: false});
    };
    handleMatchStatusCancel = () => {
        this.setState({dialogStatusVisible: false});
    };
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
    handleExportMulti = () => {
        const selectedRowKeys = this.state.selectedRowKeys;
        let content = "";
        selectedRowKeys.forEach(selectedItem => {
            this.state.data && this.state.data.forEach(item => {
                if (selectedItem == item.id) {
                    const url = `pages/home/home?page=live&id=${item.id}`;
                    content = content + `${item.name}\r\n${url}\r\n\r\n`;
                }
            });
        });
        this.download("小程序跳转链接导出（比赛）.txt", content);
    }
    handleScheduleMulti = () => {
        const selectedRowKeys = this.state.selectedRowKeys;
        const param = [];
        selectedRowKeys.forEach(selectedItem => {
            param.push({matchid: selectedItem});
        });
        addMatchSchedule(param).then(data => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success(data.msg, 1);
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('添加失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    }
    fake_click = (obj) => {
        const ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
            "click", true, false, window, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        obj.dispatchEvent(ev);
    }
    download = (name, data) => {
        const urlObject = window.URL || window.webkitURL || window;
        const downloadData = new Blob([data]);
        const save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(downloadData);
        save_link.download = name;
        this.fake_click(save_link);
    }
    handleUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploadloading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.setState({
                uploadloading: false,
            });
            message.success(info.file.response + "10秒后自动刷新(或者待会手动刷新)", 10);
            setTimeout(() => {
                this.refresh();
            }, 10000);
        }
        if (info.file.status === 'error') {
            this.setState({
                uploadloading: false,
            });
            message.error(info.file.response.msg, 10);
            return;
        }
    }
    onViewTitleClick = () => {
        const type = this.state.viewType ? this.state.viewType : 1;
        if (type == 1) {
            this.setState({viewText: "点击量", viewType: 2})
        } else {
            this.setState({viewText: "观看人数", viewType: 1})
        }
    }

    render() {
        const onScoreClick = this.onScoreClick;
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;
        const AddDialog = Form.create()(FootBallMatchAddDialog);
        const ModifyDialog = Form.create()(FootBallMatchModifyDialog);
        const ScoreDialog = Form.create()(FootBallMatchScoreDialog);
        const state = this.state;
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
            title: '比赛',
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
            width: '35%',
            render: function (text, record, index) {
                const hostteam = record.hostteam;
                const guestteam = record.guestteam;
                if (hostteam == null || guestteam == null) {
                    return <span className="cursor-hand" onClick={onNameClick.bind(this, record)}>{record.name}</span>
                }
                return <div className="center cursor-hand" onClick={onNameClick.bind(this, record)}>
                    <Avatar src={hostteam.headimg ? hostteam.headimg : defultAvatar}/>
                    <p className="ml-s">{hostteam.name}</p>
                    <p className="ml-s mr-s">VS</p>
                    <Avatar src={guestteam.headimg ? guestteam.headimg : defultAvatar}/>
                    <p className="ml-s">{guestteam.name}</p>
                </div>;
            },
        }, {
            title: '地点',
            align: 'center',
            dataIndex: 'place',
            width: '20%',
            render: function (text, record, index) {
                return <p>{record.place ? record.place : "-"}</p>
            }
        }, {
            title: '时间',
            align: 'center',
            dataIndex: 'datebegin',
            width: '20%',
            render: function (text, record, index) {
                return <p>{(record.starttime ? parseTimeString(record.starttime) : "-")}</p>
            }
        }, {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            width: '10%',
            render: function (text, record, index) {
                return <p className="cursor-hand"
                          onClick={onScoreClick.bind(this, record)}>{record.status == null ? "未开" : (record.status == -1 ? "未开" : status[record.status].text)}</p>
            }
        }, {
            title: '比分',
            align: 'center',
            width: '7%',
            render: function (text, record, index) {
                return <p className="cursor-hand"
                          onClick={onScoreClick.bind(this, record)}>{record.score ? (record.score + (record.penaltyscore ? `(${record.penaltyscore})` : "")) : "-"}</p>;
            },
        }, {
            title: <span onClick={this.onViewTitleClick}>{state.viewType ? state.viewText : "观看人数"}</span>,
            align: 'center',
            dataIndex: 'online',
            width: '8%',
            render: function (text, record, index) {
                const type = state.viewType ? state.viewType : 1;
                if (type == 1) {
                    return <Tooltip title="括号中的为实际人数"><p>{`${record.online}(${record.onlineforreal})`}</p></Tooltip>;
                } else {
                    return <p>{record.online}</p>
                }
            },
        },
        ];
        const columns_moblie = [{
            title: '比赛',
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
            width: '70%',
            render: function (text, record, index) {
                const hostteam = record.hostteam;
                const guestteam = record.guestteam;
                if (hostteam == null || guestteam == null) {
                    return <span className="cursor-hand" onClick={onNameClick.bind(this, record)}>{record.name}</span>
                }
                return <div className="center cursor-hand" onClick={onNameClick.bind(this, record)}>
                    <Avatar src={hostteam.headimg ? hostteam.headimg : defultAvatar}/>
                    <p className="ml-s">{hostteam.name}</p>
                    <p className="ml-s mr-s">VS</p>
                    <Avatar src={guestteam.headimg ? guestteam.headimg : defultAvatar}/>
                    <p className="ml-s">{guestteam.name}</p>
                </div>;
            },
        }, {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            width: '18%',
            render: function (text, record, index) {
                return <p className="cursor-hand"
                          onClick={onScoreClick.bind(this, record)}>{record.status == null ? "未开" : (record.status == -1 ? "未开" : status[record.status].text)}</p>
            }
        }, {
            title: '比分',
            align: 'center',
            width: '12%',
            render: function (text, record, index) {
                return <p className="cursor-hand"
                          onClick={onScoreClick.bind(this, record)}>{record.score ? record.score : "-"}</p>;
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
                                               onClick={this.showMatchAddDialog}/>
                                   </Tooltip>
                                   {/*<Upload*/}
                                   {/*    className="ml-s mr-s"*/}
                                   {/*    accept=".docx"*/}
                                   {/*    action={uploaddocx_match}*/}
                                   {/*    listType="text"*/}
                                   {/*    withCredentials={true}*/}
                                   {/*    showUploadList={false}*/}
                                   {/*    onChange={this.handleUploadChange}*/}
                                   {/*    disabled={this.state.uploadloading}*/}
                                   {/*>*/}
                                   {/*    {*/}
                                   {/*        <Tooltip title="导入">*/}
                                   {/*            <Button type="primary" shape="circle"*/}
                                   {/*                    icon={this.state.uploadloading ? "loading" : "import"}/>*/}
                                   {/*        </Tooltip>*/}
                                   {/*    }*/}
                                   {/*</Upload>*/}
                                   <Tooltip title="导出小程序地址">
                                       <Button type="primary" shape="circle" icon="export"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleExportMulti}>
                                           {selectedRowKeys.length}
                                       </Button>
                                   </Tooltip>
                                   {/*<Tooltip title="计划开始及拉流">*/}
                                   {/*    <Button type="primary" shape="circle" icon="clock-circle"*/}
                                   {/*            hidden={this.state.selectedRowKeys.length > 0 ? false : true}*/}
                                   {/*            onClick={this.handleScheduleMulti}>{selectedRowKeys.length}</Button>*/}
                                   {/*</Tooltip>*/}
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleDeleteMulti}>{selectedRowKeys.length}</Button>
                                   </Tooltip>
                                   <Tooltip title="刷新">
                                       <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                               loading={this.state.loading}
                                               onClick={this.refresh}/>
                                   </Tooltip>
                                   {/*<Button type="primary" className="pull-right">*/}
                                   {/*    <Link to={`/football/schedule`}>*/}
                                   {/*        <Icon type="clock-circle"/>*/}
                                   {/*        查看计划*/}
                                   {/*    </Link>*/}
                                   {/*</Button>*/}
                               </div>
                           }
        />
            <Modal
                className={isMobile ? "top-n" : ""}
                width={800}
                visible={this.state.dialogAddVisible}
                title="添加比赛"
                okText="确定"
                onCancel={this.handleMatchAddCancel}
                destroyOnClose="true"
                onOk={this.handleMatchAdd}
            >
                <AddDialog
                    visible={this.state.dialogAddVisible}
                    ref={this.saveMatchDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                width={800}
                visible={this.state.dialogScoreVisible}
                title="比分详情"
                okText="确定"
                onCancel={this.handleMatchScoreCancel}
                destroyOnClose="true"
                footer={[
                    <Button key="back" onClick={this.handleMatchScoreCancel}>取消</Button>,
                ]}
            >
                <ScoreDialog
                    visible={this.state.dialogScoreVisible}
                    matchid={this.state.record.id}
                    refreshFuc={this.refresh}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                width={800}
                visible={this.state.dialogStatusVisible}
                title="比分状态设置"
                okText="确定"
                onCancel={this.handleMatchStatusCancel}
                destroyOnClose="true"
                footer={[
                    <Button key="submit" type="primary"
                            onClick={this.handleMatchStatusConfirm}>确定</Button>,
                    <Button key="back" onClick={this.handleMatchStatusCancel}>取消</Button>,
                ]}
            >
                <div>
                    <div className="w-full center">
                        <span className="mb-n mt-m" style={{fontSize: 20}}>比分</span>
                    </div>
                    <Input style={{minWidth: 300, textAlign: "center"}} placeholder='比分'
                           onChange={this.onStatusDialogScoreChange}
                           value={this.state.statusDialogScore}/>
                    <Input style={{minWidth: 300, textAlign: "center"}} placeholder='点球比分'
                           className="mt-m"
                           onChange={this.onStatusDialogPenaltyScoreChange}
                           value={this.state.statusDialogPenaltyScore}/>
                    <Radio.Group className="mt-m" onChange={this.onStatusDialogRaidoChange}
                                 value={this.state.statusDialogRadio}>
                        <Radio value={-1}>未开始</Radio>
                        <Radio value={0}>上半场</Radio>
                        <Radio value={14}>中场休息</Radio>
                        <Radio value={15}>下半场</Radio>
                        <Radio value={21}>比赛结束</Radio>
                    </Radio.Group>
                </div>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                width={600}
                visible={this.state.dialogModifyVisible}
                title="编辑比赛"
                okText="确定"
                onCancel={this.handleMatchModifyCancel}
                destroyOnClose="true"
                onOk={this.handleMatchModifyCreate}
                footer={[
                    <Button key="more" type="primary" className="pull-left">
                        <Link to={
                            "/football/footballMatch/" + this.state.record.id
                        }>详细设置</Link>
                    </Button>,
                    <Button key="comment" type="primary" className="pull-left">
                        <Link to={
                            `/football/comment/${this.state.record.id}`
                        }>评论管理</Link>
                    </Button>,
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleMatchModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleMatchModifyCreate}>
                        确定
                    </Button>
                ]}
            >
                <ModifyDialog
                    visible={this.state.dialogModifyVisible}
                    ref={this.saveMatchModifyDialogRef}
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchTable);