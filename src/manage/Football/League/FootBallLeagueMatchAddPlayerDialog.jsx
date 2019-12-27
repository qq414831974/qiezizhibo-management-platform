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
import {getTeamInLeague, getPlayersByTeamId, getLeaguePlayerByLeagueTeam} from "../../../axios";
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

class FootBallLeagueMatchAddPlayerDialog extends React.Component {
    state = {data: [], playerdata: [], playerSelectDisable: true}

    componentDidMount() {
        this.fetchTeam();
    }

    fetchTeam = () => {
        this.setState({
            loading: true,
        });
        this.props.record && getTeamInLeague({leagueId: this.props.record.id}).then((data) => {
            if (data) {
                this.setState({
                    data: data,
                    loading: false,
                });
            } else {
                message.error('获取队伍列表失败：' + (data ? data.result + "-" + data.msg : data), 3);
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
            if (data && data.list) {
                this.setState({
                    playerdata: data ? data.list : "",
                    playerloading: false,
                });
            } else {
                message.error('获取队员列表失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    }
    fetchLeagueTeamPlayer = (leagueId,teamId,playerId) => {
        getLeaguePlayerByLeagueTeam({leagueId:leagueId, teamId:teamId, playerId:playerId}).then((data) => {
            this.setState({
                currentPlayerData: data,
            });
        });
    }
    onTeamChange = (e) => {
        this.setState({currentTeam: e, playerSelectDisable: false});
    }
    onPlayerChange = (e) => {
        this.setState({currentPlayer: e});
        this.fetchLeagueTeamPlayer(this.props.record.id,this.state.currentTeam,e);
    }
    onPlayerFocus=()=>{
        this.fetchPlayer();
    }
    render() {
        const {visible, form} = this.props;

        const {getFieldDecorator} = form;
        const options = this.state.data.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.remark}>
                <div>
                    <Avatar src={d.headimg}/>
                    <span className="ml-s">{d.name}</span>
                </div>
            </Tooltip>
        </Option>);
        const options_player = this.state.playerdata.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.remark}>
                <div>
                    <Avatar src={d.headimg}/>
                    <span className="ml-s">{`${d.name}(${d.shirtnum}号)`}</span>
                </div>
            </Tooltip>
        </Option>);
        return (
            visible ?
                <div>
                    <Form>
                        <FormItem {...formItemLayout} label="队伍" className="bs-form-item">
                            {getFieldDecorator('teamid', {
                                rules: [{required: true, message: '请选择!'}],
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
                            {getFieldDecorator('playerid', {
                                rules: [{required: true, message: '请选择!'}],
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
                                    onChange={this.onPlayerChange}
                                >
                                    {options_player}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="进球" className="bs-form-item">
                            {getFieldDecorator('goal', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.goal : null
                            })(
                                <InputNumber placeholder="进球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="黄牌" className="bs-form-item">
                            {getFieldDecorator('yellowcard', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.yellowcard : null
                            })(
                                <InputNumber placeholder="黄牌"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="红牌" className="bs-form-item">
                            {getFieldDecorator('redcard', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.redcard : null
                            })(
                                <InputNumber placeholder="红牌"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="犯规" className="bs-form-item">
                            {getFieldDecorator('foul', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.foul : null
                            })(
                                <InputNumber placeholder="犯规"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="助攻" className="bs-form-item">
                            {getFieldDecorator('assists', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.assists : null
                            })(
                                <InputNumber placeholder="助攻"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="射门" className="bs-form-item">
                            {getFieldDecorator('shoot', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.shoot : null
                            })(
                                <InputNumber placeholder="射门"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="射正" className="bs-form-item">
                            {getFieldDecorator('shootright', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.shootright : null
                            })(
                                <InputNumber placeholder="射正"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="扑救" className="bs-form-item">
                            {getFieldDecorator('save', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.save : null
                            })(
                                <InputNumber placeholder="扑救"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="越位" className="bs-form-item">
                            {getFieldDecorator('offside', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.offside : null
                            })(
                                <InputNumber placeholder="越位"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="乌龙球" className="bs-form-item">
                            {getFieldDecorator('owngoal', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.owngoal : null
                            })(
                                <InputNumber placeholder="乌龙球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="点球进球" className="bs-form-item">
                            {getFieldDecorator('pointgoal', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.pointgoal : null
                            })(
                                <InputNumber placeholder="点球进球"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="点球未进" className="bs-form-item">
                            {getFieldDecorator('pointmiss', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.pointmiss : null
                            })(
                                <InputNumber placeholder="点球未进"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="被犯规" className="bs-form-item">
                            {getFieldDecorator('befouled', {
                                initialValue: this.state.currentPlayerData?this.state.currentPlayerData.befouled : null
                            })(
                                <InputNumber placeholder="被犯规"/>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            {getFieldDecorator('leaguematchid', {
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallLeagueMatchAddPlayerDialog);