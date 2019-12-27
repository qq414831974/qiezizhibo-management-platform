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
        getAllTeams({pageSize: 20, pageNum: pageNum, filter: {name: searchText}}).then((data) => {
            if (data && data.list) {
                this.setState({
                    data: pageNum == 1 ? (data ? data.list : []) :
                        (data ? this.state.data.concat(data.list) : []),
                    loading: false,
                    pageNum: data.pageNum,
                    pageSize: data.pageSize,
                    pageTotal: data.total,
                });
            } else {
                message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.msg : data), 3);
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
            case 'matchwin':
                this.setState({matchwin: e.target.value});
                this.getRank(e.target.value, null, null);
                break;
            case 'matchlost':
                this.setState({matchlost: e.target.value});
                this.getRank(null, e.target.value, null);
                break;
            case 'matchdraw':
                this.setState({matchdraw: e.target.value});
                this.getRank(null, null, e.target.value);
                break;
        }
    }
    getRank = (win, lost, draw) => {
        const {form} = this.props;
        let matchwin = win;
        let matchdraw = draw;
        if (matchwin == null) {
            matchwin = this.state.matchwin ? this.state.matchwin : form.getFieldValue("matchwin");
        }
        if (matchdraw == null) {
            matchdraw = this.state.matchdraw ? this.state.matchdraw : form.getFieldValue("matchdraw");
        }
        if (matchwin == null || matchdraw == null) {
            return;
        }
        const rank = matchwin * 3 + matchdraw * 1;
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

    render() {
        const {visible, form} = this.props;

        const {getFieldDecorator} = form;
        return (
            visible ?
                <div>
                    <Form>
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
                            {getFieldDecorator('totalgoal', {
                                initialValue: this.props.record.totalgoal,
                            })(
                                <Input placeholder="总进球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="总失球">
                            {getFieldDecorator('totalgoallost', {
                                initialValue: this.props.record.totalgoallost,
                            })(
                                <Input placeholder="总失球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="总场次">
                            {getFieldDecorator('matchtotal', {
                                initialValue: this.props.record.matchtotal,
                            })(
                                <Input placeholder="总场次"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="胜">
                            {getFieldDecorator('matchwin', {
                                initialValue: this.props.record.matchwin,
                            })(
                                <Input placeholder="胜" onChange={this.onInputChange.bind(this, "matchwin")}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="平">
                            {getFieldDecorator('matchdraw', {
                                initialValue: this.props.record.matchdraw,
                            })(
                                <Input placeholder="平" onChange={this.onInputChange.bind(this, "matchdraw")}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} className="bs-form-item" label="负">
                            {getFieldDecorator('matchlost', {
                                initialValue: this.props.record.matchlost,
                            })(
                                <Input placeholder="负" onChange={this.onInputChange.bind(this, "matchlost")}/>
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
                            {getFieldDecorator('sortindex', {
                                initialValue: this.props.record.sortindex,
                            })(
                                <Input placeholder="排名"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} style={{margin: 0}}>
                            {getFieldDecorator('teamid', {
                                initialValue: this.props.record.teamid,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} style={{margin: 0}}>
                            {getFieldDecorator('leaguematchid', {
                                initialValue: this.props.record.leaguematchid,
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