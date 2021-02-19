import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar} from 'antd';
import {getGifts, deleteGifts, updateGift, addGift} from '../../../axios/index';
import {Form, message} from "antd/lib/index";
import GiftAddDialog from './GiftAddDialog';
import GiftModifyDialog from './GiftModifyDialog';
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../static/logo.png";
import NP from 'number-precision'

const giftType = {
    0: "全部免费",
    1: "比赛",
    2: "联赛"
}

class GiftTable extends React.Component {
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
            sortField: "sortIndex",
            sortOrder: "asc",
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getGifts(params).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                pagination.sortField = params.sortField;
                pagination.sortOrder = params.sortOrder;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                    selectedRowKeys: [],
                });
            } else {
                message.error('获取礼物列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
    deleteGift = () => {
        deleteGifts({id: [this.state.record.id]}).then((data) => {
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
    deleteGifts = () => {
        deleteGifts({id: this.state.selectedRowKeys}).then((data) => {
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
        this.showGiftModifyDialog();
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        pager.sortField = sorter.field ? sorter.field : pager.sortField;
        pager.sortOrder = sorter.order == "descend" ? "desc" : sorter.order == "ascend" ? "asc" : pager.sortOrder;
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
            pager.filters["name"] = searchText;
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
    saveGiftAddDialogRef = (form) => {
        this.formAdd = form;
    }
    saveGiftModifyDialogRef = (form) => {
        this.formModify = form;
    }
    showGiftAddDialog = () => {
        this.setState({dialogAddVisible: true});
    };
    showGiftModifyDialog = () => {
        this.setState({dialogModifyVisible: true});
    };
    handleGiftAddCancel = () => {
        this.setState({dialogAddVisible: false});
    };
    handleGiftModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleGiftAddCreate = () => {
        const form = this.formAdd;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const discountInfo = {};
            if (values.discountInfo) {
                values.discountInfo.forEach(item => {
                    discountInfo[item.num] = item.discount * 10;
                })
            }
            values.discountInfo = discountInfo;
            const growth = [];
            if (values.growth) {
                values.growth.forEach(item => {
                    if (item != null) {
                        growth.push(item);
                    }
                });
            }
            values.growth = growth;
            if (values.price) {
                values.price = NP.times(values.price, 100)
            }
            addGift(values).then((data) => {
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
    handleGiftModifyCreate = () => {
        const form = this.formModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const discountInfo = {};
            if (values.discountInfo) {
                values.discountInfo.forEach(item => {
                    discountInfo[item.num] = item.discount * 10;
                });
            }
            values.discountInfo = discountInfo;
            const growth = [];
            if (values.growth) {
                values.growth.forEach(item => {
                    if (item != null) {
                        growth.push(item);
                    }
                });
            }
            values.growth = growth;
            if (values.price) {
                values.price = NP.times(values.price, 100)
            }
            updateGift(values).then((data) => {
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
    handleGiftDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteGift,
            deleteCols: 1,
        });
    }
    handleGiftsDelete = () => {
        this.setState({
            deleteVisible: true,
            handleDeleteOK: this.deleteGifts,
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

        const AddDialog = Form.create()(GiftAddDialog);
        const ModifyDialog = Form.create()(GiftModifyDialog);

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
            key: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按名称搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
                            <Radio value={0}>免费</Radio>
                            <Radio value={1}>收费</Radio>
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
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                if (record.pic) {
                    return <div className="center cursor-hand"><Avatar src={record.pic ? record.pic : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a></div>;
                }
                return <span className="cursor-hand" onClick={onNameClick.bind(this, record)}>{record.name}</span>;
            },
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let type = "收费";
                switch (record.type) {
                    case 0:
                        type = `免费${record.limited}个`
                        break;
                    case 1:
                        type = "收费"
                        break;
                }
                return <span>{type}</span>;
            },
        }, {
            title: '价格/元',
            key: 'price',
            dataIndex: 'price',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                return <span>{NP.divide(record.price, 100)}（元）</span>;
            },
        }, {
            title: '折扣',
            key: 'discountInfo',
            dataIndex: 'discountInfo',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let discountToolTip = []
                if (record.discountInfo != null) {
                    let domKey = 0;
                    Object.keys(record.discountInfo).forEach(function (key) {
                        domKey = domKey + 1;
                        discountToolTip.push(<p key={domKey}>
                            {`${key}个打${NP.divide(record.discountInfo[key], 10)}折`}
                        </p>)
                    });
                }
                return <Tooltip title={discountToolTip}><span>查看折扣</span></Tooltip>;
            },
        }, {
            title: '成长',
            key: 'growth',
            dataIndex: 'growth',
            align: 'center',
            width: '10%',
            render: function (text, record, index) {
                let growthToolTip = [];
                if (record.growth != null) {
                    let domKey = 0;
                    record.growth.forEach((value) => {
                        domKey = domKey + 1;
                        let type = "未知";
                        switch (value.type) {
                            case 1:
                                type = "用户经验";
                                break;
                            case 2:
                                type = "球队热度";
                                break;
                            case 3:
                                type = "球员热度";
                                break;
                            case 4:
                                type = "免费竞猜";
                                break;
                        }
                        growthToolTip.push(<p key={domKey}>{`${type}+${value.growth}`}</p>)
                    })
                }
                return <Tooltip title={growthToolTip}><span>查看成长</span></Tooltip>;
            },
        }, {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
            align: 'center',
            width: '10%',
        }, {
            title: '描述2',
            key: 'description2',
            dataIndex: 'description2',
            align: 'center',
            width: '10%',
        }, {
            title: '启用',
            key: 'available',
            dataIndex: 'available',
            align: 'center',
            width: '5%',
            render: function (text, record, index) {
                if (record.available) {
                    return <div className="center">启用</div>;
                }
                return <span>禁用</span>;
            },
        }, {
            title: '排序',
            key: 'sortIndex',
            dataIndex: 'sortIndex',
            align: 'center',
            width: '5%',
        }
        ];
        const columns_moblie = [{
            title: '名字',
            key: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按名称搜索"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
                    <div className="custom-filter-dropdown-radio">
                        <Radio.Group onChange={this.onNameDropDownRadioChange} value={this.state.filterType}>
                            <Radio value={0}>免费</Radio>
                            <Radio value={1}>收费</Radio>
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
            width: '30%',
            align: 'center',
            render: function (text, record, index) {
                if (record.pic) {
                    return <div className="center"><Avatar src={record.pic ? record.pic : logo}/>
                        <a className="ml-s" onClick={onNameClick.bind(this, record)}>{record.name}</a></div>;
                }
                return <span>{record.name}</span>;
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
                                               onClick={this.showGiftAddDialog}/>
                                   </Tooltip>
                                   <Tooltip title="删除">
                                       <Button type="danger" shape="circle" icon="delete"
                                               hidden={this.state.selectedRowKeys.length > 0 ? false : true}
                                               onClick={this.handleGiftsDelete}>{selectedRowKeys.length}</Button>
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
                title="添加礼物"
                visible={this.state.dialogAddVisible}
                footer={[
                    <Button key="back" onClick={this.handleGiftAddCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleGiftAddCreate}>确定</Button>,
                ]}
                onCancel={this.handleGiftAddCancel}>
                <AddDialog visible={this.state.dialogAddVisible}
                           ref={this.saveGiftAddDialogRef}/>
            </Modal>
            <Modal
                className={isMobile ? "top-n" : ""}
                title="修改礼物"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="delete" type="danger" className="pull-left"
                            onClick={this.handleGiftDelete}>删除</Button>,
                    <Button key="back" onClick={this.handleGiftModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleGiftModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleGiftModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible} record={this.state.record}
                              ref={this.saveGiftModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(GiftTable);