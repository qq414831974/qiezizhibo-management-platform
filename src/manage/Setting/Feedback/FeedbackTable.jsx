import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio} from 'antd';
import {getAllSysFeedback} from '../../../axios/index';
import {Avatar} from 'antd';
import {Form, message} from "antd/lib/index";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../static/logo.png";
import FeedbackDetailDialog from "./FeedbackDetailDialog";


class FeedbackTable extends React.Component {
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
        valueRadioValue: "value",
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getAllSysFeedback(params).then((data) => {
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
                message.error('获取日志列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
        if (this.state.valueRadioValue && searchText != null && searchText != '') {
            pager.filters[this.state.valueRadioValue] = searchText;
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
    onValueDropDownRadioChange = (e) => {
        this.setState({
            valueRadioValue: e.target.value,
        });
    }
    onDetailClick = (record) => {
        this.setState({
            detailVisible: true,
            detailId: record.id,
            detailString: record.value,
            detailUserNo: record.userNo,
            detailPicList: record.picList
        })
    }
    hideDetail = () => {
        this.setState({detailVisible: false})
    }

    render() {
        const onDetailClick = this.onDetailClick;
        const columns = [{
            title: '内容',
            dataIndex: 'value',
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
                        <Radio.Group onChange={this.onValueDropDownRadioChange} value={this.state.valueRadioValue}>
                            <Radio value={"value"}>按内容</Radio>
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
            width: '40%',
            align: 'center',
            render: function (text, record, index) {
                return <span className="cursor-hand"
                             onClick={onDetailClick.bind(this, record)}>{record.value}</span>;
            },
        }, {
            title: '类型',
            key: 'type',
            filterMultiple: false,
            filters: [
                {text: '功能异常', value: 1},
                {text: '支付问题', value: 2},
                {text: '产品建议', value: 3},
                {text: '违规举报', value: 4},
                {text: '交易问题', value: 5},
            ],
            width: '10%',
            align: 'center',
            render: function (text, record, index) {
                let type = "未知"
                switch (record.type) {
                    case 1 :
                        type = "功能异常";
                        break;
                    case 2 :
                        type = "支付问题";
                        break;
                    case 3 :
                        type = "产品建议";
                        break;
                    case 4 :
                        type = "违规举报";
                        break;
                    case 5 :
                        type = "交易问题";
                        break;
                }
                return type;
            },
        }, {
            title: '用户',
            dataIndex: 'userNo',
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                const user = record.user;
                if (user == null) {
                    return <span>未知</span>
                }
                return <div className="center"><Avatar src={user.avatar ? user.avatar : logo}/>
                    <span className="ml-s">{`${user.name}${user.isDefault ? "(预设用户)" : ""}`}</span>
                </div>;
            },
        }, {
            title: '联系方式',
            dataIndex: 'phone',
            width: '15%',
            align: 'center',
        }, {
            title: '时间',
            dataIndex: 'createTime',
            width: '15%',
            align: 'center',
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
                               <div style={{minHeight: 32}}>
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
                title="查看详细"
                visible={this.state.detailVisible}
                onCancel={this.hideDetail}
                destroyOnClose
                zIndex={1001}
            >
                {/*<span>{this.state.detailString}</span>*/}
                {/*<div className="w-full">*/}
                {/*    {this.state.detailPicList && this.state.detailPicList.map((data, index) => {*/}
                {/*        return <img key={index} src={data} style={{height: "auto", width: "50%", padding: "10px",boxSizing: "border-box"}}/>*/}
                {/*    })}*/}
                {/*</div>*/}
                {/*<div className="mt-l purple">*/}
                {/*    <span>用户id: {this.state.detailUserNo}</span>*/}
                {/*</div>*/}
                <FeedbackDetailDialog
                    id={this.state.detailId}
                    visible={this.state.detailVisible}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackTable);