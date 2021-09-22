import React from 'react';
import {Table, Input, Button, Icon, Modal, Tooltip, Radio, Avatar, Row, Col} from 'antd';
import {
    generateLeaguePlayerCashSettlement,
    getLeaguePlayerCashSettlement,
    updateLeaguePlayerCashSettlement,
    deleteLeaguePlayerCashSettlement,
} from '../../../../axios/index';
import {Form, message} from "antd/lib/index";
import LeaguePlayerCashSettlementDialog from './LeaguePlayerCashSettlementDialog';
import {receiveData} from "../../../../action";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import logo from "../../../../static/logo.png";
import defultAvatar from "../../../../static/avatar.jpg";
import NP from 'number-precision'


class LeagueCashSettlementTable extends React.Component {
    state = {
        data: [],
        pagination: {pageSize: 10, filters: {}},
        loading: false,
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        selectedRowKeys: [],
        dialogModifyVisible: false,
        record: {},
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params) => {
        this.getLeaguePlayerCashSettlement(params);
    }
    getLeaguePlayerCashSettlement = (params) => {
        this.setState({loading: true});
        getLeaguePlayerCashSettlement(params).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                this.setState({
                    loading: false,
                    data: data.data ? data.data.records : "",
                    pagination,
                });
            } else {
                message.error('获取联赛球员提现结算列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
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
            pager.filters["playerName"] = searchText;
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
    onNameClick = (record, e) => {
        this.setState({
            record: record,
            heatRule: this.props.heatRule,
            target: record.player,
            dialogModifyVisible: true
        });
    }
    saveModifyDialogRef = (form) => {
        this.form = form;
    }
    handleModifyCancel = () => {
        this.setState({dialogModifyVisible: false});
    };
    handleModifyCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.cashTotal) {
                values.cashTotal = NP.times(values.cashTotal, 100);
            }
            updateLeaguePlayerCashSettlement(values).then(data => {
                if (data && data.code == 200) {
                    if (data.data) {
                        this.refresh();
                        message.success('修改成功', 3);
                    }
                } else {
                    message.error('修改失败：' + (data ? data.code + ":" + data.message : data), 3);
                }
            })
            this.setState({dialogModifyVisible: false});
        });
    };
    onCashSettlementClick = () => {
        this.setState({settlementLoading: true});
        generateLeaguePlayerCashSettlement({leagueId: this.props.heatRule.leagueId}).then((data) => {
            if (data) {
                this.refresh();
                message.success('结算成功', 3);
                this.setState({settlementLoading: false});
            } else {
                message.error('提现结算失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    render() {
        const onNameClick = this.onNameClick;

        const ModifyDialog = Form.create()(LeaguePlayerCashSettlementDialog);

        const isMobile = this.props.responsive.data.isMobile;


        const columns = [{
            title: '球员',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '40%',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="按名字搜索"
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
            render: function (text, record, index) {
                if (record.player) {
                    const player = record.player;
                    return <div className="center">
                        <Avatar src={player && player.headImg ? player.headImg : logo}/>
                        <a className="ml-s"
                           onClick={onNameClick.bind(this, record)}>
                            {player ? player.name : "未知"}
                        </a>
                    </div>;
                }
                return <span>未知</span>;
            }
        }, {
            title: '结算提现金额（元）',
            key: 'cashTotal',
            dataIndex: 'cashTotal',
            width: '20%',
            align: 'center',
            render: function (text, record, index) {
                if (record.cashTotal) {
                    return <a className="ml-s" onClick={onNameClick.bind(this, record)}>
                        {NP.divide(record.cashTotal, 100)}
                    </a>;
                }
                return "-";
            },
        }, {
            title: '结算时间',
            key: 'cashSettlementTime',
            dataIndex: 'cashSettlementTime',
            width: '20%',
            align: 'center',
        }, {
            title: '验证过期时间',
            key: 'verifyExpireTime',
            dataIndex: 'verifyExpireTime',
            width: '20%',
            align: 'center',
        }
        ];
        return <div><Table columns={columns}
                           rowKey={record => record.id}
                           dataSource={this.state.data}
                           loading={this.state.loading}
                           bordered
                           pagination={this.state.pagination}
                           onChange={this.handleTableChange}
                           title={() =>
                               <div style={{height: 32}}>
                                   <Button
                                       type="primary"
                                       loading={this.state.settlementLoading}
                                       onClick={this.onCashSettlementClick}>
                                       一键结算
                                   </Button>
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
                title="结算修改"
                visible={this.state.dialogModifyVisible}
                footer={[
                    <Button key="back" onClick={this.handleModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleModifyCreate}>确定</Button>,
                ]}
                onCancel={this.handleModifyCancel}>
                <ModifyDialog visible={this.state.dialogModifyVisible}
                              record={this.state.record}
                              heatRule={this.props.heatRule}
                              target={this.state.target}
                              ref={this.saveModifyDialogRef}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueCashSettlementTable);