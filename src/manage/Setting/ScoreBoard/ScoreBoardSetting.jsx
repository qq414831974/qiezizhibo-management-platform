import React from 'react';
import {Row, Col, Divider, message, Input, Button, Select, Tooltip} from 'antd';
import BreadcrumbCustom from '../../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../../action";
import {connect} from "react-redux";
import {getScoreboard, setScoreboard, updateScoreboard} from "../../../axios";
import ScoreBoard from './ScoreBoard';

class ScoreBoardSetting extends React.Component {
    state = {}

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        getScoreboard().then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    scoreboardList: data.data ? data.data.flatMap(value => {
                        return {id: value.id, ...value.detail}
                    }) : []
                });
            }
        });
    }

    getScoreBoardOption = () => {
        let dom = [];
        console.log(this.state.scoreboardList)
        this.state.scoreboardList && this.state.scoreboardList.forEach((item) => {
            dom.push(<Select.Option key={`item-${item.id}`} value={item.id} data={item}>
                <img src={item.scoreboardpic}
                     style={{
                         width: 200,
                         height: 40
                     }}/>
            </Select.Option>);
        });
        return dom;
    }
    onScoreBoardSelect = (e, option) => {
        this.setState({currentScoreBoard: option.props.data});
        this.removeScoreBoardPanel();
        setTimeout(() => {
            this.addScoreBoardPanel(2, option.props.data);
        }, 1000)
    }
    onScoreBoardAddClick = () => {
        this.removeScoreBoardPanel();
        setTimeout(() => {
            this.addScoreBoardPanel(1);
        }, 1000)
    }
    addScoreBoardPanel = (type, currentScoreBoard) => {
        let dom = {};
        if (type == 1) {
            dom = <ScoreBoard showDelete={false} scoreboard={{}} callBackFunc={this.handleScoreBoardConfirm}/>
        } else if (type == 2) {
            dom = <ScoreBoard showDelete={true} refeshFunc={this.refresh} scoreboard={currentScoreBoard}
                              callBackFunc={this.handleScoreBoardConfirm}/>
        }
        this.setState({extraDom: dom})
    }
    removeScoreBoardPanel = () => {
        this.setState({extraDom: null})
        this.setState({currentScoreBoard: null});
    }
    refresh = () => {
        this.removeScoreBoardPanel();
        this.fetch();
    }
    handleScoreBoardConfirm = (position) => {
        if (position.scoreboardpic == null) {
            message.warn("比分牌图片未选择", 1);
            return;
        }
        let setFunc = setScoreboard;
        if (position && position.id) {
            setFunc = updateScoreboard;
        }
        setFunc(position).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    this.fetch();
                    message.success('修改成功', 1);
                } else {
                    message.warn(data.message, 1);
                }
            } else {
                message.error('修改失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
        this.removeScoreBoardPanel();
    }

    render() {
        return (
            <div>
                <BreadcrumbCustom first="系统设置"/>
                <Divider>比分牌设置</Divider>
                <Select size="large" style={{minWidth: 250}} onSelect={this.onScoreBoardSelect}
                        value={this.state.currentScoreBoard ? this.state.currentScoreBoard.id : null}>
                    {this.getScoreBoardOption()}
                </Select>
                <Tooltip title="添加">
                    <Button className="ml-s" shape="circle" type="primary" icon="plus"
                            onClick={this.onScoreBoardAddClick}/>
                </Tooltip>
                {this.state.extraDom ? this.state.extraDom : null}
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScoreBoardSetting);