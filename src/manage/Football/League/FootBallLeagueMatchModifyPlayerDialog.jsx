import React from 'react';
import {
    Form,
    Input,
    Select,
    Avatar,
    Tooltip,
    InputNumber,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import avatar from '../../../static/avatar.jpg';
import {getTeamInLeague, getPlayersByTeamId} from "../../../axios";
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

class FootBallLeagueMatchModifyPlayerDialog extends React.Component {
    state = {data: [], playerdata: [], playerSelectDisable: true}

    componentDidMount() {
        this.fetchTeam();
        this.setState({currentTeam: this.props.record.teamId});
    }

    fetchTeam = () => {
        this.setState({
            loading: true,
        });
        this.props.record && getTeamInLeague(this.props.record.leaguematchId).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data,
                    loading: false,
                    playerSelectDisable: false,
                });
                this.fetchPlayer();
            } else {
                message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    fetchPlayer = () => {
        this.setState({
            playerloading: true,
        });
        this.state.currentTeam && getPlayersByTeamId(this.state.currentTeam, {
            pageSize: 100,
            pageNum: 1,
        }).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    playerdata: data.data ? data.data.records : "",
                    playerloading: false,
                });
            } else {
                message.error('获取队员列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    onTeamChange = (e) => {
        this.setState({currentTeam: e, playerSelectDisable: false});
        this.props.form.setFieldsValue({playerId: null})
    }
    onPlayerFocus = () => {
        this.fetchPlayer();
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
        const options_player = this.state.playerdata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.remark}>
                <div>
                    <Avatar src={d.headImg}/>
                    <span className="ml-s">{`${d.name}(${d.shirtNum}号)`}</span>
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
                                initialValue: this.props.record.teamId
                            })(
                                <Select
                                    showSearch
                                    style={{minWidth: 300}}
                                    placeholder="选择队伍"
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    notFoundContent={null}
                                    loading={this.state.loading}
                                    onChange={this.onTeamChange}
                                >
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="球员" className="bs-form-item">
                            {getFieldDecorator('playerId', {
                                rules: [{required: true, message: '请选择!'}],
                                initialValue: this.props.record.playerId
                            })(
                                <Select
                                    showSearch
                                    style={{minWidth: 300}}
                                    placeholder="选择球员"
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    notFoundContent={null}
                                    loading={this.state.playerloading}
                                    disabled={this.state.playerSelectDisable}
                                    onFocus={this.onPlayerFocus}
                                >
                                    {options_player}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="进球" className="bs-form-item">
                            {getFieldDecorator('goal', {
                                initialValue: this.props.record.goal
                            })(
                                <InputNumber placeholder="进球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="黄牌" className="bs-form-item">
                            {getFieldDecorator('yellowCard', {
                                initialValue: this.props.record.yellowCard
                            })(
                                <InputNumber placeholder="黄牌"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="红牌" className="bs-form-item">
                            {getFieldDecorator('redCard', {
                                initialValue: this.props.record.redCard
                            })(
                                <InputNumber placeholder="红牌"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="犯规" className="bs-form-item">
                            {getFieldDecorator('foul', {
                                initialValue: this.props.record.foul
                            })(
                                <InputNumber placeholder="犯规"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="助攻" className="bs-form-item">
                            {getFieldDecorator('assists', {
                                initialValue: this.props.record.assists
                            })(
                                <InputNumber placeholder="助攻"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="射门" className="bs-form-item">
                            {getFieldDecorator('shoot', {
                                initialValue: this.props.record.shoot
                            })(
                                <InputNumber placeholder="射门"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="射正" className="bs-form-item">
                            {getFieldDecorator('shootRight', {
                                initialValue: this.props.record.shootRight
                            })(
                                <InputNumber placeholder="射正"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="扑救" className="bs-form-item">
                            {getFieldDecorator('save', {
                                initialValue: this.props.record.save
                            })(
                                <InputNumber placeholder="扑救"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="越位" className="bs-form-item">
                            {getFieldDecorator('offside', {
                                initialValue: this.props.record.offside
                            })(
                                <InputNumber placeholder="越位"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="乌龙球" className="bs-form-item">
                            {getFieldDecorator('owngoal', {
                                initialValue: this.props.record.owngoal
                            })(
                                <InputNumber placeholder="乌龙球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="点球进球" className="bs-form-item">
                            {getFieldDecorator('pointgoal', {
                                initialValue: this.props.record.pointgoal
                            })(
                                <InputNumber placeholder="点球进球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="点球未进" className="bs-form-item">
                            {getFieldDecorator('pointmiss', {
                                initialValue: this.props.record.pointmiss
                            })(
                                <InputNumber placeholder="点球未进"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="被犯规" className="bs-form-item">
                            {getFieldDecorator('befouled', {
                                initialValue: this.props.record.befouled
                            })(
                                <InputNumber placeholder="被犯规"/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('leaguematchId', {
                                initialValue: this.props.record.leaguematchId,
                            })(
                                <Input hidden={true}/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchModifyPlayerDialog);