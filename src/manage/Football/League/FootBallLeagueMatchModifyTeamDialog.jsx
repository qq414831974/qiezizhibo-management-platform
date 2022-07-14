import React from 'react';
import {
    Form,
    Input,
    Select,
    Avatar,
    Tooltip,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import avatar from '../../../static/avatar.jpg';
import {getAllTeams} from "../../../axios";
import {message} from "antd/lib/index";

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 4},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class FootBallLeagueMatchModifyTeamDialog extends React.Component {
    state = {data: []}

    componentDidMount() {
        this.fetch("", 1);
        this.isCompositions = true;
    }

    fetch = (searchText, pageNum) => {
        this.setState({
            loading: true,
        });
        getAllTeams({pageSize: 20, pageNum: pageNum, name: searchText}).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                this.setState({
                    data: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data.data ? this.state.data.concat(data.data.records) : []),
                    loading: false,
                    pageNum: data.data.current,
                    pageSize: data.data.size,
                    pageTotal: data.data.total,
                });
            } else {
                message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    handleSearch = (e) => {
        const value = e.target.value;
        this.setState({searchText: value});
        // setTimeout(()=>{
        if (this.isCompositions) {
            this.fetch(value, 1);
        }
        // },100);
    }

    handleChange = (value) => {
        this.setState({value});
    }
    handleShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.data.length) {
            this.handleOnLoadMore(e);
        }
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onInputCompositionStart = () => {
        this.isCompositions = false;
    }
    onInputCompositionEnd = () => {
        this.isCompositions = true;
        this.fetch(this.state.searchText, 1);
    }
    handleOnLoadMore = (e) => {
        let data = this.state.data;
        e.target.scrollTop = data.length * 50;
        if (this.state.loading) {
            return;
        }
        if (data.length > this.state.pageTotal) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetch(this.state.searchText, this.state.pageNum + 1);
    }
    onInputChange = (type, e) => {
        switch (type) {
            case 'matchWin':
                this.setState({matchWin: e.target.value});
                this.getRank(e.target.value, null, null);
                break;
            case 'matchLost':
                this.setState({matchLost: e.target.value});
                this.getRank(null, e.target.value, null);
                break;
            case 'matchDraw':
                this.setState({matchDraw: e.target.value});
                this.getRank(null, null, e.target.value);
                break;
        }
    }
    getRank = (win, lost, draw) => {
        const {form} = this.props;
        let matchWin = win;
        let matchDraw = draw;
        if (matchWin == null) {
            matchWin = this.state.matchWin ? this.state.matchWin : form.getFieldValue("matchWin");
        }
        if (matchDraw == null) {
            matchDraw = this.state.matchDraw ? this.state.matchDraw : form.getFieldValue("matchDraw");
        }
        if (matchWin == null || matchDraw == null) {
            return;
        }
        const rank = matchWin * 3 + matchDraw * 1;
        this.setState({rank: rank});
        form.setFieldsValue({rank: rank});
    }
    getGroupsOption = (record) => {
        let dom = [];
        record.subgroup && record.subgroup.groups && record.subgroup.groups.forEach((item, index) => {
            dom.push(<Option key={`groups-${index}`} value={item}>{item}</Option>)
        })
        return dom;
    }
    getQuitOption = () => {
        let dom = [];
        dom.push(<Option key={`quit-option-${0}`} value={0}>正常</Option>)
        dom.push(<Option key={`quit-option-${1}`} value={1}>退出</Option>)
        return dom;
    }

    render() {
        const {visible, form} = this.props;

        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} label="退出状态" className="bs-form-item">
                            {getFieldDecorator('quitStatus', {
                                rules: [{required: true, message: '请选择退出状态'}],
                                initialValue: this.props.record.quitStatus ? this.props.record.quitStatus : null,
                            })(
                                <Select style={{width: '100%'}}>
                                    {this.getQuitOption()}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="组别" className="bs-form-item">
                            {getFieldDecorator('subgroup', {
                                rules: [{required: true, message: '请选择组别'}],
                                initialValue: this.props.record.subgroup ? this.props.record.subgroup : null,
                            })(
                                <Select style={{width: '100%'}}>
                                    {this.getGroupsOption(this.props.league)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="总进球">
                            {getFieldDecorator('totalGoal', {
                                initialValue: this.props.record.totalGoal,
                            })(
                                <Input placeholder="总进球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="总失球">
                            {getFieldDecorator('totalGoalLost', {
                                initialValue: this.props.record.totalGoalLost,
                            })(
                                <Input placeholder="总失球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="总场次">
                            {getFieldDecorator('matchTotal', {
                                initialValue: this.props.record.matchTotal,
                            })(
                                <Input placeholder="总场次"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="胜">
                            {getFieldDecorator('matchWin', {
                                initialValue: this.props.record.matchWin,
                            })(
                                <Input placeholder="胜" onChange={this.onInputChange.bind(this, "matchWin")}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="平">
                            {getFieldDecorator('matchDraw', {
                                initialValue: this.props.record.matchDraw,
                            })(
                                <Input placeholder="平" onChange={this.onInputChange.bind(this, "matchDraw")}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="负">
                            {getFieldDecorator('matchLost', {
                                initialValue: this.props.record.matchLost,
                            })(
                                <Input placeholder="负" onChange={this.onInputChange.bind(this, "matchLost")}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="积分">
                            {getFieldDecorator('ranks', {
                                initialValue: this.props.record.ranks,
                            })(
                                <Input placeholder="积分"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="排名">
                            {getFieldDecorator('sortIndex', {
                                initialValue: this.props.record.sortIndex,
                            })(
                                <Input placeholder="排名"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} style={{margin: 0}}>
                            {getFieldDecorator('teamId', {
                                initialValue: this.props.record.teamId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} style={{margin: 0}}>
                            {getFieldDecorator('leagueId', {
                                initialValue: this.props.record.leagueId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} style={{margin: 0}}>
                            {getFieldDecorator('id', {
                                initialValue: this.props.record.id,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                    </Form>
                </div>
                :
                <div/>
        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchModifyTeamDialog);