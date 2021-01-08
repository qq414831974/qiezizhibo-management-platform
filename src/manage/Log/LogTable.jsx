import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio} from 'antd';
import {getAllSysLog} from '../../axios/index';
import {Avatar} from 'antd';
import {Form, message} from "antd/lib/index";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from '../../static/logo.png';


class LogTable extends React.Component {
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
        nameRadioValue: "operation",
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({loading: true});
        getAllSysLog(params).then((data) => {
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
    onNameDropDownRadioChange = (e) => {
        this.setState({
            nameRadioValue: e.target.value,
        });
    }
    onParamsClick = (paramsString) => {
        this.setState({logParamsVisible: true, logParamsString: paramsString})
    }
    hideLogParamsString = () => {
        this.setState({logParamsVisible: false})

    }

    render() {
        const onParamsClick = this.onParamsClick;
        const columns = [{
            title: '操作',
            dataIndex: 'operation',
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
                            <Radio value={"userName"}>按用户名</Radio>
                            <Radio value={"operation"}>按操作</Radio>
                            <Radio value={"ip"}>按ip</Radio>
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
                return <span>{record.operation}</span>;
            },
        }, {
            title: '方法',
            dataIndex: 'method',
            width: '31%',
            align: 'center',
        }, {
            title: '参数',
            dataIndex: 'params',
            width: '7%',
            align: 'center',
            render: function (text, record, index) {
                return <span className="cursor-hand" onClick={onParamsClick.bind(this, record.params)}>查看</span>;
            },
        }, {
            title: 'ip',
            dataIndex: 'ip',
            width: '10%',
            align: 'center',
        }, {
            title: '用时',
            dataIndex: 'duration',
            width: '7%',
            align: 'center',
        }, {
            title: '操作时间',
            dataIndex: 'operationTime',
            width: '15%',
            align: 'center',
        }, {
            title: '操作人',
            dataIndex: 'userName',
            width: '10%',
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
                title="查看参数"
                visible={this.state.logParamsVisible}
                onCancel={this.hideLogParamsString}
                zIndex={1001}
            >
                <span>{this.state.logParamsString}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(LogTable);