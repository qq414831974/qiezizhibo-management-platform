import React from 'react';
import {Table, Button, message, Form, Modal, Tooltip} from 'antd';
import {getActivityInfoList} from '../../axios/index';
import {mergeJSON} from '../../utils/index';
import copy from 'copy-to-clipboard';
import {createActivity, modifyActivityFakeInfo, modifyActivityInfo} from "../../axios";
import {parseTimeString} from "../../utils";
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import LiveSimpleForm from "./LiveSimpleForm";
import LiveAddDialog from "./LiveAddDialog";
import {Link} from 'react-router-dom';


class UserTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filtered: false,
        dialogModifyVisible: false,
        record: {},
        selectedRowKeys: [],
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
            filter: {},
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getActivityInfoList(params).then((data) => {
            const pagination = {...this.state.pagination};
            pagination.total = data ? data.pager.total : 0;
            pagination.current = data ? data.pager.page : 0;
            this.setState({
                loading: false,
                data: data ? data.items : "",
                pagination,
                selectedRowKeys: [],
            });
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
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : "";
        pager.filters = mergeJSON({nickname: this.state.searchText}, filters);
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
    saveLiveSimpleRef = (form) => {
        this.formSimple = form;
    };
    saveLiveAddDialogRef = (form) => {
        this.formAdd = form;
    }
    showModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    showAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    handleModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleAddDialogCancel = () => {
        this.setState({dialogAddVisible: false});
    }
    handleModifyCreate = () => {
        const form = this.formSimple;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const callback1 = () => {
                this.check1 = true;
                if (this.check1 && this.check2) {
                    this.refresh();
                    this.check1 = false;
                    this.check2 = false;
                }
            }
            const callback2 = () => {
                this.check2 = true;
                if (this.check1 && this.check2) {
                    this.refresh();
                    this.check1 = false;
                    this.check2 = false;
                }
            }
            const baseData = {};
            baseData.endedAt = values.endedAt;
            baseData.startedAt = values.startedAt;
            baseData.name = values.name;
            modifyActivityInfo(values.id, baseData).then(((data) => {
                callback1();
                if (data) {
                    if (data.result) {
                        message.success('修改成功', 1);
                    } else {
                        message.error('修改失败：' + (data ? data.name + "-" + data.message : data), 3);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.name + "-" + data.message : data), 3);
                }
            }));
            const fakeData = {}
            fakeData.enabled = values.isFakeEnabled;
            fakeData.fake = {};
            fakeData.fake.baseCount = values.fake.baseCount;
            fakeData.fake.increaseMin = values.fake.increaseMin;
            fakeData.fake.increaseMax = values.fake.increaseMax;
            modifyActivityFakeInfo(values.id, fakeData).then(((data) => {
                callback2();
                if (data) {
                    if (data.result) {
                        message.success('修改人数放大成功', 1);
                    } else {
                        message.error('修改人数放大失败：' + (data ? data.name + "-" + data.message : data), 3);
                    }
                } else {
                    message.error('修改人数放大失败：' + (data ? data.name + "-" + data.message : data), 3);
                }
            }));
            form.resetFields();
            this.setState({dialogModifyVisible: false});
        });
    };
    handleAddDialogCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["endedAt"] = values["endedAt"].format('YYYY-MM-DD HH:mm:ss').toString();
            values["startedAt"] = values["startedAt"].format('YYYY-MM-DD HH:mm:ss').toString();
            createActivity(values).then(((data) => {
                if (data) {
                    if (data.id) {
                        message.success('添加成功', 1);
                        form.resetFields();
                        this.refresh();
                    } else {
                        message.error('添加失败：' + (data ? data.name + "-" + data.message : data), 3);
                    }
                } else {
                    message.error('添加失败：' + (data ? data.name + "-" + data.message : data), 3);
                }
            }));
            this.setState({dialogAddVisible: false});
        });
    }
    handleDetailClick = () => {

    };
    onRecordClick = (record, e) => {
        this.setState({record: record});
        this.showModifyDialog();
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    handleExportMulti = () => {
        const selectedRowKeys = this.state.selectedRowKeys;
        let content = "";
        selectedRowKeys.forEach(selectedItem => {
            this.state.data && this.state.data.forEach(item => {
                if (selectedItem == item.id) {
                    const stream = item.stream;
                    const streamUrl = `rtmp://${item.pushDomain}/${item.app}/${stream}`;
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
        const onRecordClick = this.onRecordClick;
        const LiveSimple = Form.create()(LiveSimpleForm);
        const LiveAddSimple = Form.create()(LiveAddDialog);
        const {selectedRowKeys} = this.state;
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
            title: '名称',
            dataIndex: 'name',
            key: 'status',
            filters: [
                {text: '可用', value: 'enabled'},
                {text: '已结束', value: 'disabled'},
                {text: '已禁用', value: 'forbidden'},
                {text: '已删除', value: 'deleted'},
            ],
            filterMultiple: false,
            align: 'center',
            width: '45%',
            render: function (text, record, index) {
                var type = "enabled";
                var name = record.name;
                switch (record.status) {
                    case "enabled" :
                        type = "play-circle";
                        break;
                    case "disabled" :
                        type = "close";
                        break;
                    case "forbidden" :
                        type = "warning";
                        break;
                    case "deleted" :
                        type = "delete";
                        break;
                }
                return <p className="cursor-hand" onClick={onRecordClick.bind(this, record)}>
                    <u>{record.name}</u>
                </p>;
            },
        }, {
            title: '直播时间',
            align: 'center',
            render: function (text, record, index) {
                return <p>{parseTimeString(record.startedAt)}~{parseTimeString(record.endedAt)}</p>;
            },
            width: '20%',
        }, {
            title: '推流码链接',
            align: 'center',
            render: function (text, record, index) {
                const stream = record.stream;
                const streamUrl = `rtmp://${record.pushDomain}/${record.app}/${stream}`;
                return <p className="cursor-hand" onClick={() => {
                    copy(streamUrl);
                    message.success('推流链接已复制到剪贴板');
                }}>{stream}</p>;
            },
            width: '10%',
        }, {
            title: '正在推流',
            align: 'center',
            render: function (text, record, index) {
                return <p>{record.isPushing ? "是" : "否"}</p>;
            },
            width: '10%',
        }, {
            title: '人数放大',
            align: 'center',
            render: function (text, record, index) {
                return <p>{record.isFakeEnabled ? "是" : "否"}</p>;
            },
            width: '10%',
        }, {
            title: <span>id</span>,
            align: 'center',
            width: '5%',
            render: function (text, record, index) {
                return <p className="cursor-hand" onClick={() => {
                    copy(`https://shangzhibo.tv/watch/${record.id}`);
                    message.success('观看地址已复制到剪贴板');
                }}>{record.id ? `${record.id}` : "-"}</p>
            }
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
        return <div><Table columns={columns}
                           rowKey={record => record.id}
                           rowSelection={rowSelection}
                           dataSource={this.state.data}
                           pagination={this.state.pagination}
                           loading={this.state.loading}
                           onChange={this.handleTableChange}
                           size="small"
                           bordered
                           title={() =>
                               <div>
                                   <Tooltip title="添加">
                                       <Button type="primary" shape="circle" icon="plus" onClick={this.showAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="导出推流码">
                                       <Button type="primary" shape="circle" icon="export"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleExportMulti}>{selectedRowKeys.length}
                                       </Button>
                                   </Tooltip>
                                   <Tooltip title="刷新">
                                   <Button type="primary" shape="circle" icon="reload" className="pull-right"
                                           loading={this.state.loading}
                                           onClick={this.refresh}/>
                                   </Tooltip>
                               </div>
                           }
                           scroll={{x: 1000}}
        />
            <Modal
                width={1000}
                visible={this.state.dialogModifyVisible}
                title={<div className={'inline-p'}><p>{this.state.record.name}</p></div>}
                okText="确定"
                onCancel={this.handleModifyCancel}
                destroyOnClose="true"
                footer={[
                    <Button key="more" type="primary" className="pull-left"
                            onClick={this.handleDetailClick}>
                        <Link to={
                            "/live/" + this.state.record.id
                        }>详细设置</Link>
                    </Button>,
                    <Button key="back" onClick={this.handleModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleModifyCreate}>
                        确定
                    </Button>
                ]}
            >
                <LiveSimple visible={this.state.dialogModifyVisible} record={this.state.record}
                            ref={this.saveLiveSimpleRef}/>
                {this.state.record.createdAt ?
                    <p className={'pull-right'}>创建时间：{parseTimeString(this.state.record.createdAt)}</p> : ""}
            </Modal>
            <Modal
                title="添加直播间"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleAddDialogCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleAddDialogCreate}>确定</Button>,
                ]}
                onCancel={this.handleAddDialogCancel}>
                <LiveAddSimple visible={this.state.dialogAddVisible}
                               ref={this.saveLiveAddDialogRef}/>
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