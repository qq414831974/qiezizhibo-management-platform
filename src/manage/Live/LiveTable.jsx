import React from 'react';
import {Table, Input, Button, Icon, Modal, Upload, Spin, Tooltip} from 'antd';
import {Avatar} from 'antd';
import {getActivityInfoList, delLiveByIds, modifyActivityInfo, createActivity} from "../../axios";
import {Form, message, notification} from "antd/lib/index";
import LiveAddDialog from "../Live/LiveAddDialog"
import LiveModifyDialog from "../Live/LiveModifyDialog"
import {parseTimeString} from "../../utils";
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import copy from "copy-to-clipboard/index";

class LiveTable extends React.Component {
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
        getActivityInfoList(params).then((data) => {
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
                message.error('获取直播列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    delete = () => {
        delLiveByIds({id: [this.state.record.id]}).then((data) => {
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
    deleteMulti = () => {
        delLiveByIds({id: this.state.selectedRowKeys}).then((data) => {
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
    onNameClick = (record, e) => {
        this.setState({record: record});
        this.showLiveModifyDialog();
    };
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
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
    showLiveAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showLiveModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleLiveAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleLiveModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    saveLiveDialogRef = (form) => {
        this.formAdd = form;
    };
    saveLiveModifyDialogRef = (form) => {
        this.formModify = form;
    };
    handleLiveAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["startTime"] = values["startTime"] ? values["startTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["endTime"] = values["endTime"] ? values["endTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createTime"] = values["createTime"] ? values["createTime"].format('YYYY/MM/DD HH:mm:ss') : null;

            createActivity(values).then((data) => {
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
    handleLiveModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["startTime"] = values["startTime"] ? values["startTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["endTime"] = values["endTime"] ? values["endTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            values["createTime"] = values["createTime"] ? values["createTime"].format('YYYY/MM/DD HH:mm:ss') : null;

            modifyActivityInfo(values).then((data) => {
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
                    const streamUrl = item.pushStreamUrl;
                    content = content + `${item.name}\r\n${streamUrl}\r\n\r\n`;
                }
            });
        });
        this.download("推流码导出.txt", content);
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
    render() {
        const onNameClick = this.onNameClick;
        const {selectedRowKeys} = this.state;

        const AddDialog = Form.create()(LiveAddDialog);
        const ModifyDialog = Form.create()(LiveModifyDialog);

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
            title: '直播名',
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
            width: '40%',
            render: function (text, record, index) {
                return <div className="center">
                    <span className="ml-s cursor-hand"
                          onClick={onNameClick.bind(this, record)}>{record.name}</span>
                </div>;
            },
        }, {
            title: '直播时间',
            align: 'center',
            key: 'status',
            // filters: [
            //     {text: '可用', value: 0},
            //     {text: '已结束', value: 1},
            //     {text: '已禁用', value: 2},
            // ],
            // filterMultiple: false,
            render: function (text, record, index) {
                return <p>{parseTimeString(record.startTime)}~{parseTimeString(record.endTime)}</p>;
            },
            width: '20%',
        }, {
            title: '推流码链接',
            align: 'center',
            render: function (text, record, index) {
                const url = record.pushStreamUrl;
                return <span className="cursor-hand" onClick={() => {
                    copy(url);
                    message.success('推流链接已复制到剪贴板');
                }}>{url}</span>;
            },
            width: '20%',
        }, {
            title: '正在推流',
            align: 'center',
            render: function (text, record, index) {
                return <p>{record.status==1 ? "是" : "否"}</p>;
            },
            width: '10%',
        }, {
            title: '观看地址',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                const pullStreamUrls = record.pullStreamUrls;
                let urlString = "";
                for (let pullStreamUrlsKey in pullStreamUrls) {
                    urlString = urlString + `\n${pullStreamUrlsKey}:${pullStreamUrls[pullStreamUrlsKey]}`
                }
                return <p className="cursor-hand" onClick={() => {
                    copy(urlString);
                    message.success('观看地址已复制到剪贴板');
                }}>点击复制</p>
            }
        },
        ];
        const columns_moblie = [{
            title: '直播名',
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
                return <div className="center">
                    <span className="ml-s cursor-hand"
                          onClick={onNameClick.bind(this, record)}>{record.name}</span>
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
                                               onClick={this.showLiveAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="导出推流码">
                                       <Button type="primary" shape="circle" icon="export"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleExportMulti}>{selectedRowKeys.length}
                                       </Button>
                                   </Tooltip>
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
                               </div>
                           }
        />
            <Modal
                width={600}
                visible={this.state.dialogAddVisible}
                title="添加直播"
                okText="确定"
                onCancel={this.handleLiveAddCancel}
                destroyOnClose="true"
                onOk={this.handleLiveAddCreate}
            >
                <AddDialog
                    visible={this.state.dialogAddVisible}
                    ref={this.saveLiveDialogRef}/>
            </Modal>

            <Modal
                width={600}
                visible={this.state.dialogModifyVisible}
                title="编辑直播"
                okText="确定"
                onCancel={this.handleLiveModifyCancel}
                destroyOnClose="true"
                onOk={this.handleLiveModifyCreate}
                footer={[
                    <Button key="more" type="primary" className="pull-left">
                        <Link to={
                            "/live/" + this.state.record.id
                        }>详细设置</Link>
                    </Button>,
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleLiveModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleLiveModifyCreate}>
                        确定
                    </Button>
                ]}
            >
                <ModifyDialog
                    visible={this.state.dialogModifyVisible}
                    ref={this.saveLiveModifyDialogRef}
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveTable);
