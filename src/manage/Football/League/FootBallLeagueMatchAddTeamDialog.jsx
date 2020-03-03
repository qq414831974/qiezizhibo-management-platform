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

class FootBallLeagueMatchAddTeamDialog extends React.Component {
    state = {data: []}

    componentDidMount() {
        this.fetch("", 1);
        this.isCompositions = true;
    }

    fetch = (searchText, pageNum) => {
        this.setState({
            loading: true,
        });
        getAllTeams({
            pageSize: 20,
            pageNum: pageNum,
            name: searchText,
            areatype: 2,
            sortField: "id",
            sortOrder: "desc"
        }).then((data) => {
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
        if (data.length >= this.state.pageTotal) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetch(this.state.searchText, this.state.pageNum + 1);
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
        const options = this.state.data.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.remark}>
                <div>
                    <Avatar src={d.headImg}/>
                    <span className="ml-s">{d.name}</span>
                </div>
            </Tooltip>
        </Option>);

        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} label="队伍" className="bs-form-item">
                            {getFieldDecorator('teamId', {
                                rules: [{required: true, message: '请选择!'}],
                            })(
                                <Select
                                    showSearch
                                    style={{minWidth: 300}}
                                    placeholder="按名称搜索并选择"
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onChange={this.handleChange}
                                    onPopupScroll={this.handleShowMore}
                                    notFoundContent={null}
                                    mode="multiple"
                                    // loading={this.state.loading}
                                    getInputElement={() => (
                                        <input onInput={this.handleSearch}
                                               onCompositionStart={this.onInputCompositionStart}
                                               onCompositionEnd={this.onInputCompositionEnd}/>)}
                                >
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="组别" className="bs-form-item">
                            {getFieldDecorator('subgroup', {
                                rules: [{required: true, message: '请选择组别'}],
                                initialValue: this.props.record.subgroup && this.props.record.subgroup.groups && this.props.record.subgroup.groups.length > 0 ? this.props.record.subgroup.groups[0] : null,
                            })(
                                <Select style={{width: '100%'}}>
                                    {this.getGroupsOption(this.props.record)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('leagueId', {
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchAddTeamDialog);