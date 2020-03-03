import React from 'react';
import {
    Form,
    Input,
    Avatar,
    Select,
    Col,
    TreeSelect,
    Row,
    Tag,
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defultAvatar from '../../../static/avatar.jpg';
import {getPlayersByTeamId, getFormationById} from "../../../axios";
import {message} from "antd/lib/index";

const Option = Select.Option;
moment.locale('zh-cn');

const FormItem = Form.Item;

const formationData = {
    1: "4-3-3",
    2: "4-4-2",
    3: "4-5-1",
    4: "4-3-2-1",
    5: "4-6-0",
    6: "3-5-2",
    7: "5-3-2",
}
const positionData = [{
    title: '门将',
    value: 'gk',

}, {
    title: '教练',
    value: 'co',
}, {
    title: '后卫',
    value: 'b',
    children: [{title: "右边后卫", value: "rwb"}, {title: "右后卫", value: "rb"},
        {title: "右中后卫", value: "rcb"}, {title: "中后卫", value: "cb"}, {title: "左中后卫", value: "lcb"},
        {title: "左后卫", value: "lb"}, {title: "左边后卫", value: "lwb"}, {title: "攻击型后卫", value: "ab"},
        {title: "清道夫", value: "sw"},],
}, {
    title: '中场',
    value: 'm',
    children: [{title: "右后腰", value: "rcdm"}, {title: "后腰", value: "cdm"},
        {title: "左后腰", value: "lcdm"}, {title: "右边中场", value: "rwm"}, {title: "右中场", value: "rm"},
        {title: "右中中场", value: "rcm"}, {title: "中中场", value: "cm"}, {title: "左中中场", value: "lcm"},
        {title: "左中场", value: "lm"}, {title: "左边中场", value: "lwm"}, {title: "右前腰", value: "rcam"},
        {title: "前腰", value: "cam"}, {title: "左前腰", value: "lcam"},],
}, {
    title: '前锋',
    value: 'f',
    children: [{title: "右前锋", value: "rf"}, {title: "中前锋", value: "cf"},
        {title: "左前锋", value: "lf"}, {title: "右边锋", value: "rw"}, {title: "右中锋", value: "rs"},
        {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"},],
},
];

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
        {title: "中锋", value: "st"}, {title: "左中锋", value: "ls"}, {title: "左边锋", value: "lw"},];

class FootBallMatchAddPlayersDialog extends React.Component {
    state = {
        formationPosition: {},
        playerInfo: {}
    }

    componentDidMount() {
        if (!this.props.visible) {
            return
        }
        this.fetch({
            pageSize: 100,
            pageNum: 1,
        });
    };

    fetch = (params = {}) => {
        this.setState({
            loading: true,
        });
        getPlayersByTeamId(this.props.record.id, params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    data: data.data ? data.data.records : "",
                    loading: false,
                });
                this.getPlayerInfo(data.data ? data.data.records : "");
            } else {
                message.error('获取队员列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        getFormationById(this.props.formationId).then((data) => {
            if (data && data.code == 200) {
                if (data.data && data.data.detail == null) {
                    data.data.detail = {}
                }
                this.setState({
                    formation: data.data ? data.data : "",
                });
            } else {
                message.error('获取阵型失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    getPlayerInfo = (data) => {
        if (data == null || data == "") {
            return;
        }
        const playerInfo = this.state.playerInfo
        data.forEach((item, index) => {
            playerInfo[item.id] = item
        });
        this.setState({
            playerInfo: playerInfo,
        });
    }
    getPositionName = (p) => {
        let title = "";
        positions.forEach((item, index) => {
            if (item.value == p) {
                title = item.title;
            }
        });
        return title;
    }
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
    onPlayerSelect = (e, op) => {
        this.setState({
            player: op.props.data,
            formationPosition: {},
        });
        this.props.form.setFieldsValue({
            formation: null,
        });
    }
    getPlayersOption = () => {
        let dom = [];
        this.state.data.forEach((item, index) => {
            if(!this.isPlayerInFormation(item.id)){
                dom.push(<Option value={item.id} data={item} key={"selectOption-player-" + item.id}>{<div
                    className="inline-p inline-div"><Avatar
                    src={item.headImg}/><p
                    className="ml-s mt-n mb-n">{`${item.name}(${item.shirtNum}号)`}</p>{this.getPosition(item)}
                </div>}</Option>)
            }
        });
        return dom;
    }
    getHalfPlayer = () => {
        const formation = this.state.formation ? formationData[this.state.formation.type] : null
        if (formation == null) {
            return null;
        }
        let times = 12;
        const getColPlayer = (item, colWidth) => {
            let dom_col = [];
            for (var i = 0; i < item; i++) {
                times = times - 1;
                let playerId = -1;
                if (this.state.formation) {
                    if (this.state.formation["detail"][times]) {
                        playerId = this.state.formation["detail"][times];
                    }
                }
                if (times == this.state.formationPosition.position) {
                    playerId = this.state.formationPosition.id;
                }
                dom_col.push(<Col span={colWidth} key={"player" + "-" + item + "-" + i}>
                    <div className="center">
                        <img
                            style={{width: "35px", height: "35px", borderRadius: "50%"}}
                            src={this.state.playerInfo[playerId] ? this.state.playerInfo[playerId].headImg : defultAvatar}/>
                        <p hidden={this.state.playerInfo[playerId] ? true : false}
                           style={{
                               position: "absolute",
                               fontSize: 16,
                               color: "#FFFFFF",
                               marginBottom: "18px"
                           }}>{times}</p>
                    </div>
                </Col>);
            }
            return dom_col;
        }
        const formationList = formation.split("-")
        const divHeight = 250 * 3 / 4 / formationList.length;
        let dom = []
        for (var i = formationList.length - 1; i >= 0; i--) {
            dom.push(<div style={{height: divHeight}} key={"row-div" + "-" + i}>
                <Row gutter={1} className="center" key={"row" + "-" + i}>
                    {getColPlayer(formationList[i], Math.floor(24 / formationList[i]))}
                </Row></div>);
        }
        let playerId = -1;
        if (this.state.formation) {
            if (this.state.formation["detail"][(times - 1)]) {
                playerId = this.state.formation["detail"][(times - 1)];
            }
        }
        if ((times - 1) == this.state.formationPosition.position) {
            playerId = this.state.formationPosition.id;
        }
        dom.push(<div className="center flex-important" key={"player-gk"}>
            <div className="center flex-important">
                <img
                    style={{width: "35px", height: "35px", borderRadius: "50%"}}
                    src={this.state.playerInfo[playerId] ? this.state.playerInfo[playerId].headImg : defultAvatar}/>
                <p hidden={this.state.playerInfo[playerId] ? true : false}
                   style={{
                       position: "absolute",
                       fontSize: 16,
                       color: "#FFFFFF",
                       marginBottom: "18px"
                   }}>{times - 1}</p>
            </div>
        </div>);
        return dom;
    }

    getPositionOption = (n) => {
        return <div className="center mb-n mt-n">
            <img
                style={{opacity: 0.8, width: "35px", height: "35px", borderRadius: "50%"}}
                src={defultAvatar}/>
            <p style={{
                position: "absolute",
                fontSize: 16,
                color: "#FFFFFF",
                marginBottom: "18px"
            }}>{n}</p>
        </div>
    }
    onFormationPositionSelect = (e) => {
        this.setState({
            formationPosition: {position: e, id: this.state.player.id,},
        });
        let tFormation = this.props.record.formation
        if (tFormation == null) {
            tFormation = {}
        }
        tFormation["id"] = this.props.formationId;
        if (tFormation["detail"] == null) {
            tFormation["detail"] = {}
        }
        tFormation["detail"][e] = this.state.player.id;
        this.props.form.setFieldsValue({
            formation: tFormation,
        });
    }
    getPositionOptions = () => {
        let dom = [];
        let tFormation = this.state.formation
        if (tFormation == null) {
            tFormation = {}
        }
        tFormation["id"] = this.props.formationId;
        if (tFormation["detail"] == null) {
            tFormation["detail"] = {}
        }
        for (let i = 1; i < 12; i++) {
            if(tFormation["detail"][i] == null){
                dom.push(<Select.Option value={i}>{this.getPositionOption(i)}</Select.Option>);
            }
        }
        return dom;
    }
    isPlayerInFormation = (playerId)=>{
        let tFormation = this.state.formation
        if (tFormation == null) {
            tFormation = {}
        }
        tFormation["id"] = this.props.formationId;
        if (tFormation["detail"] == null) {
            tFormation["detail"] = {}
        }
        for (let item in tFormation["detail"]) {
            if (tFormation["detail"][item] != null && tFormation["detail"][item] == playerId) {
                return true
            }
        }
        return false;
    }
    render() {
        const {visible, form, record, matchId} = this.props;
        const {getFieldDecorator} = form;
        const getPlayersOption = this.getPlayersOption;
        const onPlayerSelect = this.onPlayerSelect;
        const getHalfPlayer = this.getHalfPlayer;
        const getPositionOption = this.getPositionOption;
        const onFormationPositionSelect = this.onFormationPositionSelect;
        return (
            visible ?
                <div>
                    <Form>
                        <Row gutter={8}>
                            <Col span={12}>
                                <div className="center w-full mb-m">
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('playerId', {})(
                                            <Select size="large" style={{minWidth: 180}} onSelect={onPlayerSelect}>
                                                {this.state.data ? getPlayersOption() : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="center">
                                    <img className="round-img"
                                         src={this.state.player ? this.state.player.headImg : defultAvatar}/>
                                </div>
                                <div className="center w-full">
                                    <p style={{fontSize: 22}}
                                       className="mt-s mb-n">{this.state.player ? this.state.player.name : ""}</p>
                                </div>
                                <div className="center w-full mb-m" hidden={this.state.player ? false : true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('position', {
                                            rules: [{required: true, message: '请选择位置!'}],
                                            initialValue: this.state.player ? this.state.player.position : "",
                                        })(
                                            <TreeSelect className="select-center"
                                                        style={{minWidth: 180}}
                                                        treeData={positionData}
                                                        placeholder="请选择"
                                                        multiple
                                                        dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                                        allowClear
                                                        filterTreeNode={(inputValue, treeNode) => {
                                                            return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value.indexOf(inputValue) != -1;
                                                        }}/>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="center w-full mb-m" hidden={this.state.player ? false : true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('status', {
                                            initialValue: this.state.player ? this.state.player.status : ""
                                        })(
                                            <Select placeholder="是否首发"
                                                    className="select-center"
                                                    style={{minWidth: 180}}>
                                                <Select.Option value={1}><p className="center mb-n mt-n">首发</p>
                                                </Select.Option>
                                                <Select.Option value={2}><p className="center mb-n mt-n">替补</p>
                                                </Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="center w-full mb-m"
                                     hidden={form.getFieldValue('status') == 1 ? false : true}>
                                    <Select
                                        placeholder="选择位置"
                                        size="large"
                                        value={this.state.formationPosition.position}
                                        className="select-center"
                                        style={{maxWidth: 180}}
                                        onChange={onFormationPositionSelect}>
                                        {this.getPositionOptions()}
                                    </Select>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('formation', {
                                            // initialValue: record.formation ? record.formation : null
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('playerId', {
                                            initialValue: this.state.player ? this.state.player.id : ""
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('teamId', {
                                            initialValue: record ? record.id : ""
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('matchId', {
                                            initialValue: matchId
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('shirtNum', {
                                            initialValue: this.state.player ? this.state.player.shirtNum : ""
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="playground">
                                    <div style={{height: 250, minWidth: 250, display: "block"}}>
                                        <div className="playground-half">
                                            <div style={{
                                                marginBottom: 250 / 4,
                                                marginTop: 10
                                            }}>{getHalfPlayer()}</div>
                                            <div className="half-playground-circle"/>
                                            <div className="penalty-area">
                                                <div className="penalty-area-circle"/>
                                                <div className="keeper-area"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full mb-m">
                                        <p className="pull-left mt-n mb-n"
                                           style={{color: "#FFFFFF"}}>{record ? record.name : ""}</p>
                                        <p className="pull-right mt-n mb-n"
                                           style={{color: "#FFFFFF"}}>{this.state.formation ? formationData[this.state.formation.type] : ""}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
                :
                <div/>);
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchAddPlayersDialog);