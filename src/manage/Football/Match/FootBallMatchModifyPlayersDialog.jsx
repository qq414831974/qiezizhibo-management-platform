import React from 'react';
import {
    Form,
    Input,
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

class FootBallMatchModifyPlayersDialog extends React.Component {
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
            if (data && data.list) {
                this.setState({
                    data: data ? data.list : "",
                    loading: false,
                });
                this.getPlayerInfo(data ? data.list : "");
            } else {
                message.error('获取队员列表失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
        getFormationById(this.props.formationId).then((data) => {
            if (data) {
                this.setState({
                    formation: data ? data : "",
                });
                this.getPlayerFormationPosition(data ? data : "");
            } else {
                message.error('获取阵型失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    }
    getPlayerFormationPosition = (data) => {
        if (data == null || data == "") {
            return;
        }
        for (var i = 1; i <= 11; i++) {
            if (data["position" + i] && data["position" + i] == this.props.player.id) {
                this.setState({
                    playerPosition: i,
                });
                let tFormation = {}
                tFormation["id"] = this.props.formationId;
                tFormation["position" + i] = this.props.player.id;
                this.props.form.setFieldsValue({
                    formation: tFormation,
                });
            }
        }
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
        if (record.position.indexOf("[") != -1) {
            position = eval(record.position);
            position.forEach((item, index) => {
                dom.push(<Tag key={i} color="#001529">{positionName(item)}</Tag>)
                i = i + 1;
            });
        } else {
            dom.push(<Tag key={i} color="#001529">{positionName(record.position)}</Tag>)
        }
        return <div className="center">{dom}</div>;
    };
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
                    if (this.state.formation["position" + times] && (this.state.status ? (this.state.status == 1) : (this.props.player.status == 1))) {
                        if (this.state.formationPosition.id != this.state.formation["position" + times]) {
                            playerId = this.state.formation["position" + times];
                        }
                    }
                }
                if (times == this.state.formationPosition.position) {
                    playerId = this.state.formationPosition.id;
                }
                dom_col.push(<Col span={colWidth} key={"player" + "-" + item + "-" + i}>
                    <div className="center">
                        <img
                            style={{width: "35px", height: "35px", borderRadius: "50%"}}
                            src={this.state.playerInfo[playerId] ? this.state.playerInfo[playerId].headimg : defultAvatar}/>
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
        for (let i = formationList.length - 1; i >= 0; i--) {
            dom.push(<div style={{height: divHeight}} key={"row-div" + "-" + i}>
                <Row gutter={1} className="center" key={"row" + "-" + i}>
                    {getColPlayer(formationList[i], Math.floor(24 / formationList[i]))}
                </Row></div>);
        }
        let playerId = -1;
        if (this.state.formation) {
            if (this.state.formation["position" + (times - 1)]) {
                playerId = this.state.formation["position" + (times - 1)];
            }
        }
        if ((times - 1) == this.state.formationPosition.position) {
            playerId = this.state.formationPosition.id;
        }
        dom.push(<div className="center" key={"player-gk"}>
            <div className="center">
                <img
                    style={{width: "35px", height: "35px", borderRadius: "50%"}}
                    src={this.state.playerInfo[playerId] ? this.state.playerInfo[playerId].headimg : defultAvatar}/>
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
            formationPosition: {position: e, id: this.props.player.id,},
        });
        let tFormation = {}
        tFormation["id"] = this.props.formationId;
        tFormation["position" + e] = this.props.player.id;
        this.props.form.setFieldsValue({
            formation: tFormation,
        });
    }
    onStatusSelect = (e) => {
        if (e == 1) {
            this.setState({
                status: e,
            });
            return;
        }
        this.setState({
            formationPosition: {},
            status: e,
        });
        let tFormation = this.props.form.getFieldValue("formation");
        for (let i = 1; i <= 11; i++) {
            if (tFormation["position" + i]) {
                tFormation["position" + i] = -1;
            }
        }
        this.props.form.setFieldsValue({
            formation: tFormation,
        });
    }

    render() {
        const {visible, form, record, matchId, player} = this.props;
        const {getFieldDecorator} = form;
        const getHalfPlayer = this.getHalfPlayer;
        const getPositionOption = this.getPositionOption;
        const onFormationPositionSelect = this.onFormationPositionSelect;
        const onStatusSelect = this.onStatusSelect;
        return (
            visible ?
                <div>
                    <Form>
                        <Row gutter={8}>
                            <Col span={12}>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('playerid', {
                                            initialValue: player.id
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="center">
                                    <img className="round-img"
                                         src={this.props.player ? this.props.player.headimg : defultAvatar}/>
                                </div>
                                <div className="center w-full">
                                    <p style={{fontSize: 22}}
                                       className="mt-s mb-n">{this.props.player ? this.props.player.name : ""}</p>
                                </div>
                                <div className="center w-full mb-m" hidden={this.props.player ? false : true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('position', {
                                            rules: [{required: true, message: '请选择位置!'}],
                                            initialValue: this.props.player ? this.props.player.position : "",
                                        })(
                                            <TreeSelect className="select-center"
                                                        style={{minWidth: 180}}
                                                        treeData={positionData}
                                                        placeholder="请选择"
                                                        dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                                        allowClear
                                                        filterTreeNode={(inputValue, treeNode) => {
                                                            return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value.indexOf(inputValue) != -1;
                                                        }}/>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="center w-full mb-m" hidden={this.props.player ? false : true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('status', {
                                            initialValue: this.props.player ? this.props.player.status : ""
                                        })(
                                            <Select placeholder="是否首发"
                                                    className="select-center"
                                                    style={{minWidth: 180}}
                                                    onChange={onStatusSelect}>
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
                                        value={this.state.formationPosition.position ? this.state.formationPosition.position : this.state.playerPosition}
                                        className="select-center"
                                        style={{maxWidth: 180}}
                                        onChange={onFormationPositionSelect}>
                                        <Select.Option value={1}>{getPositionOption(1)}</Select.Option>
                                        <Select.Option value={2}>{getPositionOption(2)}</Select.Option>
                                        <Select.Option value={3}>{getPositionOption(3)}</Select.Option>
                                        <Select.Option value={4}>{getPositionOption(4)}</Select.Option>
                                        <Select.Option value={5}>{getPositionOption(5)}</Select.Option>
                                        <Select.Option value={6}>{getPositionOption(6)}</Select.Option>
                                        <Select.Option value={7}>{getPositionOption(7)}</Select.Option>
                                        <Select.Option value={8}>{getPositionOption(8)}</Select.Option>
                                        <Select.Option value={9}>{getPositionOption(9)}</Select.Option>
                                        <Select.Option value={10}>{getPositionOption(10)}</Select.Option>
                                        <Select.Option value={11}>{getPositionOption(11)}</Select.Option>
                                    </Select>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('formation', {})(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('playerid', {
                                            initialValue: this.props.player ? this.props.player.id : ""
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('teamid', {
                                            initialValue: record ? record.id : ""
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('matchid', {
                                            initialValue: matchId
                                        })(
                                            <Input/>
                                        )}
                                    </FormItem>
                                </div>
                                <div hidden={true}>
                                    <FormItem className="bs-form-item">
                                        {getFieldDecorator('shirtnum', {
                                            initialValue: this.props.player ? this.props.player.shirtnum : ""
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

export default connect(mapStateToProps, mapDispatchToProps)(FootBallMatchModifyPlayersDialog);