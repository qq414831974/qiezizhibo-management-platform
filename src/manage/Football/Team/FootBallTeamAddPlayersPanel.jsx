import React from 'react';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {
    Row,
    Col,
    Card,
    Button,
    Popover,
    List,
    Input,
    Avatar,
    Radio,
    Popconfirm,
    Modal,
    Tag,
    Tooltip,
    Divider
} from 'antd';
import defultAvatar from '../../../static/avatar.jpg';
import shirt from '../../../static/shirt.png';
import shirt2 from '../../../static/shirt2.png';
import plus from '../../../static/plus.png';
import {addPlayerToTeam, getAllPlayersNotInTeam, getPlayersByTeamId, modifyPlayerInTeam} from "../../../axios";
import {mergeJSON} from "../../../utils";
import {Form, message} from "antd/lib/index";
import ModifyPlayerInTeamDialog from "../Team/FootBallTeamModifyPlayersDialog";
import AddPlayerToTeamDialog from "./FootBallTeamAddPlayersDialog";
import moment from 'moment'
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
        {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"}];

class FootBallTeamAddPlayersPanel extends React.Component {
    state = {
        pageLoaded: false,
        data: {},
        teamdata: {},
        loading: false,
        teamloading: false,
        dialogTeamPlayerVisible: false,
        dialogTeamPlayerModifyVisible: false,
        searchText: '',
        searchDropdownVisible: false,
        filterDropdownVisible: false,
        pagination: {pageSize: 30, filters: {}, onChange: this.handleListChange},
        teampagination: {pageSize: 15, onChange: this.handleTeamListChange, size: "small", simple: true},
    };

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
        });
        this.fetchTeam({
            pageSize: this.state.teampagination.pageSize,
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({
            loading: true,
        });
        getAllPlayersNotInTeam(params, this.props.record.id).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.pagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                pagination.onChange = this.handleListChange;
                pagination.simple = true;
                this.setState({
                    pageLoaded: true,
                    data: data.data ? data.data.records : [],
                    pagination,
                    loading: false,
                });
            } else {
                message.error('获取球员列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }
    fetchTeam = (params = {}) => {
        this.setState({
            teamloading: true,
        });
        getPlayersByTeamId(this.props.record.id, params).then((data) => {
            if (data && data.code == 200) {
                const pagination = {...this.state.teampagination};
                pagination.total = data.data ? data.data.total : 0;
                pagination.current = data.data ? data.data.current : 1;
                pagination.onChange = this.handleTeamListChange;
                pagination.size = "small";
                pagination.simple = true;
                this.setState({
                    teamdata: data.data ? data.data.records : [],
                    teampagination: pagination,
                    teamloading: false,
                });
            } else {
                message.error('获取球队球员列表失败：' + (data ? data.code + ":" + data.message : data), 3);
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
        const teampager = {...this.state.teampagination};
        this.fetchTeam({
            pageSize: teampager.pageSize,
            pageNum: teampager.current,
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
            searchDropdownVisible: false,
            searched: !!searchText,
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
    handleListChange = (page, pageSize) => {
        const pager = {...this.state.pagination};
        pager.current = page;
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
    handleTeamListChange = (page, pageSize) => {
        const pager = {...this.state.teampagination};
        pager.current = page;
        this.setState({
            teampagination: pager,
        });
        this.fetchTeam({
            pageSize: pager.pageSize,
            pageNum: pager.current,
        });
    }
    handleSearchPopVisibleChange = (searchDropdownVisible) => {
        this.setState({searchDropdownVisible});
    }
    handleFilterPopVisibleChange = (filterDropdownVisible) => {
        this.setState({filterDropdownVisible});
    }
    saveTeamPlayerDialogRef = (form) => {
        this.formPlayer = form;
    }
    saveTeamPlayerModifyDialogRef = (form) => {
        this.formPlayerModify = form;
    }
    showTeamPlayerDialog = (player) => {
        this.setState({dialogTeamPlayerVisible: true, playerData: player});
    }
    showTeamPlayerModifyDialog = (player) => {
        this.setState({dialogTeamPlayerModifyVisible: true, playerModifyData: player});
    }
    handleTeamPlayerCancel = (form) => {
        this.setState({dialogTeamPlayerVisible: false});
    }
    handleTeamPlayerModifyCancel = (form) => {
        this.setState({dialogTeamPlayerModifyVisible: false});
    }
    handleTeamPlayerDelete = (teamId, playerId) => {
        const values = {teamId: teamId, playerId: playerId, isDelete: true}
        modifyPlayerInTeam(values).then((data) => {
            this.setState({dialogTeamPlayerModifyVisible: false});
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
    }
    handleTeamPlayerModify = () => {
        const form = this.formPlayerModify;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["joinTime"] = values["joinTime"] ? values["joinTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            modifyPlayerInTeam(values).then((data) => {
                this.setState({dialogTeamPlayerModifyVisible: false});
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
                form.resetFields();
            });
        });
    };

    handleTeamPlayerAdd = () => {
        const form = this.formPlayer;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values["joinTime"] = values["joinTime"] ? values["joinTime"].format('YYYY/MM/DD HH:mm:ss') : null;
            addPlayerToTeam(values).then((data) => {
                this.setState({dialogTeamPlayerVisible: false});
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
                form.resetFields();
            });
        });
    };
    getPosition = (record) => {
        if (record ? record.position == null : true) {
            return null;
        }
        const positionName = this.getPositionName;
        let i = 0;
        let position = [];
        let dom = [];
        position = record.position;
        position.forEach((item, index) => {
            dom.push(<Tag key={i} color="#001529">{positionName(item)}</Tag>)
            i = i + 1;
        });
        return <div className="center">{dom}</div>;
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

    render() {
        const {record} = this.props;
        const AddPlayerToTeam = Form.create()(AddPlayerToTeamDialog);
        const ModifyPlayerInTeam = Form.create()(ModifyPlayerInTeamDialog);
        const showTeamPlayerDialog = this.showTeamPlayerDialog;
        const showTeamPlayerModifyDialog = this.showTeamPlayerModifyDialog;
        const handleTeamPlayerDelete = this.handleTeamPlayerDelete;
        const getPosition = this.getPosition;
        const shirtStyle = {position: "absolute", fontSize: 16, color: "#FFFFFF", paddingBottom: "15px"};
        const shirtStyle2 = {position: "absolute", fontSize: 16, color: "#000000", paddingBottom: "15px"};
        const teamId = record ? record.id : null;
        const playerId = this.state.playerModifyData ? this.state.playerModifyData.id : null;
        const searchContent = <Row gutter={5}>
            <Col span={16}>
                <Input
                    placeholder="搜索"
                    value={this.state.searchText}
                    onChange={this.onInputChange}
                    onPressEnter={this.onSearch}
                />
            </Col>
            <Col span={8}>
                <Button type="primary" icon="search" onClick={this.onSearch}>查找</Button>
            </Col>
        </Row>;
        const header = <div>
            <Popover content={searchContent}
                     trigger="click"
                     visible={this.state.searchDropdownVisible}
                     onVisibleChange={this.handleSearchPopVisibleChange}>
                <Button shape="circle" icon="search" style={{color: this.state.searched ? '#108ee9' : '#aaa'}}/>
            </Popover>
        </div>;
        return this.state.pageLoaded ? <div className="gutter-example">
            {/*<div className="w-full center">*/}
            {/*<img*/}
            {/*src={record.headImg}*/}
            {/*alt="avatar"*/}
            {/*className="round-img-m"/>*/}
            {/*</div>*/}
            {/*<div className="w-full center">*/}
            {/*<p className="mt-n">{record.name}</p>*/}
            {/*</div>*/}
            <Row gutter={20} className="pl-l pr-l">
                <Col className="gutter-row" md={10}>
                    <div className="gutter-box">
                        <Card className="card-pt-m">
                            <div>
                                <p className="center w-full">所有球员</p>
                                <Divider/>
                                <List
                                    rowKey={record => record.id}
                                    style={{minHeight: 400}}
                                    className="list-header-border-none"
                                    grid={{gutter: 16, column: 4}}
                                    dataSource={this.state.data}
                                    pagination={this.state.pagination}
                                    loading={this.state.loading}
                                    header={header}
                                    renderItem={item => (
                                        <List.Item>
                                            <div className="center list-item-hover cursor-hand"
                                                 onClick={showTeamPlayerDialog.bind(this, item)}>
                                                <div className="list-item-hover-plus center">
                                                    <img style={{opacity: 0.8, width: "60px", height: "60px"}}
                                                         src={plus}/>
                                                </div>
                                                <div className="list-item-hover-border center">
                                                    <img style={{opacity: 0.8, width: "60px", height: "60px"}}
                                                         src={plus}/>
                                                </div>
                                                <img className="round-img-m"
                                                     src={item.headImg ? item.headImg : defultAvatar}/>
                                            </div>
                                            <div className="center">
                                                <p className="text-ellipsis">{item.name}</p>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                </Col>
                <Col className="gutter-row" md={4}>
                    <div className="center">
                        <img className="round-img"
                             src={record.headImg ? record.headImg : defultAvatar}/>
                    </div>
                    <div className="center">
                        <p className="pl-s">{record.name}</p>
                    </div>
                </Col>
                <Col className="gutter-row" md={10}>
                    <div className="gutter-box">
                        <Card className="card-pt-m">
                            <div>
                                <p className="center w-full">球队球员</p>
                                <Divider/>
                                <List
                                    rowKey={record => record.id}
                                    style={{minHeight: 400}}
                                    size="small"
                                    className="list-header-border-none"
                                    //grid={{gutter: 16, column: 5}}
                                    dataSource={this.state.teamdata}
                                    pagination={this.state.teampagination}
                                    loading={this.state.teamloading}
                                    renderItem={item => (
                                        <List.Item>
                                            <div className="center list-item-hover cursor-hand"
                                                 onClick={showTeamPlayerModifyDialog.bind(this, item)}>
                                                <div className="list-item-hover-plus center">
                                                    <img style={{opacity: 0, width: "40px", height: "40px"}}
                                                         src={plus}/>
                                                </div>
                                                <img className="round-img-s"
                                                     src={item.headImg ? item.headImg : defultAvatar}/>
                                            </div>
                                            <div className="pl-m">
                                                <p style={{fontSize: 16}}>{item.name}</p>
                                            </div>
                                            <div className="center pl-m">
                                                {getPosition(item)}
                                            </div>
                                            <Tooltip
                                                placement="right"
                                                title={item.status == 1 ? "首发" : item.status == 2 ? "替补" : "队员"}>
                                                <div className="center" style={{position: "absolute", right: 0}}>

                                                    <img
                                                        style={{opacity: 0.8, width: "40px", height: "40px"}}
                                                        src={item.status == 1 ? shirt : shirt2}/>
                                                    <p style={item.status == 1 ? shirtStyle : shirtStyle2}>{item.shirtNum}</p>

                                                </div>
                                            </Tooltip>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Modal
                className="modal-header-ptb-s"
                width={500}
                visible={this.state.dialogTeamPlayerVisible}
                title={
                    <div>
                        <div className="inline-block">
                            <Avatar size="large" src={record.headImg}/>
                        </div>
                        <div className="inline-block">
                            <p className="pl-s">{record.name}</p>
                        </div>
                    </div>
                }
                okText="确定"
                onCancel={this.handleTeamPlayerCancel}
                destroyOnClose="true"
                onOk={this.handleTeamPlayerAdd}
            >
                <AddPlayerToTeam
                    record={this.state.playerData}
                    teamId={teamId}
                    visible={this.state.dialogTeamPlayerVisible}
                    ref={this.saveTeamPlayerDialogRef}/>
            </Modal>
            <Modal
                className="modal-header-ptb-s"
                width={500}
                visible={this.state.dialogTeamPlayerModifyVisible}
                title={
                    <div>
                        <div className="inline-block">
                            <Avatar size="large" src={record.headImg}/>
                        </div>
                        <div className="inline-block">
                            <p className="pl-s">{record.name}</p>
                        </div>
                    </div>
                }
                footer={[
                    <Popconfirm title="确定删除吗?" onConfirm={handleTeamPlayerDelete.bind(this, teamId, playerId)}
                                okText="是" cancelText="否">
                        <Button key="delete" type="danger" className="pull-left">
                            删除
                        </Button>
                    </Popconfirm>,
                    <Button key="back" onClick={this.handleTeamPlayerModifyCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleTeamPlayerModify}>
                        确定
                    </Button>
                ]}
                okText="确定"
                onCancel={this.handleTeamPlayerModifyCancel}
                destroyOnClose="true"
            >
                <ModifyPlayerInTeam
                    record={this.state.playerModifyData}
                    teamId={teamId}
                    visible={this.state.dialogTeamPlayerModifyVisible}
                    ref={this.saveTeamPlayerModifyDialogRef}/>
            </Modal>
        </div> : null
    }
}


const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallTeamAddPlayersPanel);