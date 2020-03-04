import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {Row, Col, Input, Icon, Avatar, message, List, Modal, Radio, Button} from 'antd';
import IconText from './IconText';
import defultAvatar from '../static/avatar.jpg';
import {parseTimeStringWithOutYear} from "../utils";
import {getAllMatchs, updateMatchScoreStatusById} from '../axios/index';

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

class MatchList extends Component {
    state = {
        pagination: {pageSize: 10, filters: {isActivity: true}},
        searchText: '',
        record: {},
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.fetch({
            pageSize: this.state.pagination.pageSize,
            pageNum: 1,
            isActivity: true
        });
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null
        }
        this.timerID = setInterval(
            () => {
                this.refresh();
            },
            30000
        );
    };

    componentWillUnmount() {
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null
        }
    }

    fetch = (params) => {
        this.setState({searchLoading: true});
        getAllMatchs(params).then((data) => {
            if (data && data.code == 200) {
                let pagination = {...this.state.pagination};
                pagination.total = data.data.total;
                pagination.current = data.data.current;
                pagination.pageSize = data.data.size;
                pagination.onChange = this.handleListChange;
                pagination.simple = true;
                this.setState({
                    searchData: data.data ? data.data.records : [],
                    searchLoading: false,
                    pagination,
                });
            } else {
                message.error('获取比赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    refresh = () => {
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            ...pager.filters,
        });
    }
    onSearch = () => {
        const pager = {...this.state.pagination};
        pager.filters = this.getTableFilters(pager);
        this.fetch({
            pageSize: pager.pageSize,
            pageNum: pager.current,
            ...pager.filters,
        });
    }
    handleListChange = (page, pageSize) => {
        const {searchText} = this.state;
        const pager = {...this.state.pagination};
        pager.current = page;
        pager.pageSize = pageSize;
        pager.filters = this.getTableFilters(pager);
        this.setState({
            pagination: pager,
        });
        this.fetch({
            filter: pager.filters,
            pageNum: pager.current,
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
    onSearchChange = (e) => {
        this.setState({searchText: e.target.value});
    }
    onRecordClick = (record, e) => {
        const matchType = record ? (record.type ? record.type : []) : [];
        this.setState({
            record: record,
            statusDialogRadio: record.status,
            statusDialogScore: record.score,
            statusDialogPenaltyScore: record.penaltyscore
        });
        if (matchType.indexOf(TIME_LINE) < 0) {
            this.showStatusDialog();
            return;
        }
        const history = this.props.history;
        history.push(`/${record.id}`);
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
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        this.setState({dialogStatusVisible: false});
    }
    showStatusDialog = () => {
        this.setState({dialogStatusVisible: true});
    }
    handleMatchStatusCancel = () => {
        this.setState({dialogStatusVisible: false});
    };

    render() {
        const {responsive} = this.props;
        return (
            <div style={{minHeight: responsive.data.clientHeight}}>
                <div className="qz-live-match-search-content-search-div"
                     style={responsive.data.isMobile ? {padding: "1em 1em"} : {}}
                >
                    <Input.Search
                        className="qz-live-match-search-content-search__input"
                        placeholder="搜索比赛"
                        onSearch={this.onSearch}
                        onChange={this.onSearchChange}
                        value={this.state.searchText}
                        suffix={<Icon
                            className="cursor-hand"
                            type="search"
                            onClick={(e) => {
                                this.onSearch(this.state.searchText);
                            }}
                        />}
                    />
                </div>
                <div>
                    <List itemLayout="vertical"
                          size="large"
                          style={{padding: responsive.data.isMobile ? "0" : "0 20em"}}
                          dataSource={this.state.searchData}
                          pagination={this.state.pagination}
                          loading={this.state.listloading}
                          renderItem={item => (
                              <List.Item
                                  style={{padding: "1em"}}
                                  className="qz-live-match-content-list__item"
                                  key={item.id}
                                  onClick={this.onRecordClick.bind(this, item)}
                                  actions={[
                                      <IconText type="calendar" text={parseTimeStringWithOutYear(item.startTime)}/>,
                                      <IconText type="pushpin" text={item.place}/>,
                                      <IconText type="video-camera"
                                                text={item.status ? (item.status === -1 ? "未开" : status[item.status].text) : "未开"}
                                      />,
                                      <IconText type="dribbble" text={item.score}/>,
                                      <IconText type="fire" text={item.online}/>]}
                              >
                                  <style>
                                      {`
                                      .ant-list-vertical .ant-list-item-action > li {
                                            padding: 0 5px;
                                      }
                                      `}
                                  </style>
                                  {(item.hostteam == null || item.guestteam == null) ? <span>{item.name}</span> :
                                      <Row gutter={0}>
                                          <Col span={7}>
                                              <span className="center" style={{height: 32}}>{item.hostteam.name}</span>
                                          </Col>
                                          <Col span={3}>
                                              <div className="center">
                                                  <Avatar
                                                      src={item.hostteam.headImg ? item.hostteam.headImg : defultAvatar}
                                                  />
                                              </div>
                                          </Col>
                                          <Col span={4}>
                                          <span className="w-full center"
                                                style={{
                                                    fontSize: 16,
                                                    height: 32
                                                }}
                                          >{item.status === -1 ? "VS" : item.score}</span>
                                              {item.penaltyscore ? <span className="w-full center"
                                                                         style={{
                                                                             fontSize: 13,
                                                                             height: 26
                                                                         }}
                                              >{item.status === -1 ? "" : item.penaltyscore}</span> : null}
                                          </Col>
                                          <Col span={3}>
                                              <div className="center">
                                                  <Avatar
                                                      src={item.guestteam.headImg ? item.guestteam.headImg : defultAvatar}
                                                  />
                                              </div>
                                          </Col>
                                          <Col span={7}>
                                              <span className="center" style={{height: 32}}>{item.guestteam.name}</span>
                                          </Col>
                                      </Row>}
                              </List.Item>
                          )}
                    />
                </div>
                <Modal
                    className="top-n"
                    width={800}
                    visible={this.state.dialogStatusVisible}
                    title="比分状态设置"
                    okText="确定"
                    onCancel={this.handleMatchStatusCancel}
                    destroyOnClose="true"
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleMatchStatusConfirm}>确定</Button>,
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
                            <Radio value={0}>比赛开始(上半场)</Radio>
                            <Radio value={14}>中场休息</Radio>
                            <Radio value={15}>下半场</Radio>
                            <Radio value={21}>比赛结束</Radio>
                        </Radio.Group>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {responsive = {data: {}}} = state.httpData;
    return {responsive};
};

export default withRouter(connect(mapStateToProps)(MatchList));
