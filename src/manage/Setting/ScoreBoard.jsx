import React from 'react';
import {Row, Col, Divider, message, Upload, Button} from 'antd';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import Draggable from 'react-draggable';
import scoreBoardDefault from "../../static/score-board-default.png";
import shirt from "../../static/shirt2.png";
import {upload} from "../../axios";
import {deleteScoreboard} from "../../axios";

class ScoreBoard extends React.Component {
    state = {position:{}}

    initposition = {};

    componentDidMount() {
        const position = {};
        position["title"] = this.props.scoreboard.title ? this.props.scoreboard.title : {x: 0 ,y: 0};
        position["hostname"] = this.props.scoreboard.hostname ? this.props.scoreboard.hostname : {x: 0 ,y: 0};
        position["guestname"] = this.props.scoreboard.guestname ? this.props.scoreboard.guestname : {x: 0 ,y: 0};
        position["hostscore"] = this.props.scoreboard.hostscore ? this.props.scoreboard.hostscore : {x: 0 ,y: 0};
        position["guestscore"] = this.props.scoreboard.guestscore ? this.props.scoreboard.guestscore : {x: 0 ,y: 0};
        position["hostshirt"] = this.props.scoreboard.hostshirt ? this.props.scoreboard.hostshirt : {x: 0 ,y: 0};
        position["guestshirt"] = this.props.scoreboard.guestshirt ? this.props.scoreboard.guestshirt : {x: 0 ,y: 0};
        position["time"] = this.props.scoreboard.time ? this.props.scoreboard.time : {x: 0 ,y: 0};
        this.setState({
            scoreBoard: this.props.scoreboard.scoreboardpic,
            hostShirt: this.props.scoreboard.hostshirtpic,
            guestShirt: this.props.scoreboard.guestshirtpic,
            position: position,
        });
        this.initposition = position;
    }

    onStart = (e,data) => {

    };
    onStop = (e,data) => {
        if(data.node.attributes && data.node.attributes["flag"]){
            const key = data.node.attributes["flag"].value;
            const x = this.initposition[key].x * 600 + data.x
            const y = this.initposition[key].y * 120 + data.y
            const position = {x: (x/600).toFixed(2), y: (y/120).toFixed(2)}
            this.state.position[key] = position;
            this.setState({position: this.state.position})
        }
    };
    onDelete = ()=>{
        this.props.scoreboard && deleteScoreboard({id:this.props.scoreboard.id}).then((data)=>{
            if (data && data.code == 200) {
                if (data.data) {
                    this.props.refeshFunc();
                    message.success('删除成功', 1);
                }else{
                    message.warn(data.msg, 1);
                }
            } else {
                message.error('删除失败：' + (data ? data.result + "-" + data.msg : data), 3);
            }
        });
    }
    handleUploadChange = (type,info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                uploading: false,
            });
            const file = info.file;
            if (file.response) {
                if(type=="scoreBoard"){
                    this.setState({scoreBoard: file.response.data})
                }else if(type=="hostShirt"){
                    this.setState({hostShirt: file.response.data})
                }else if(type=="guestShirt") {
                    this.setState({guestShirt: file.response.data})
                }
            }
        }
    }
    render() {
        // const scoreBoardImg = this.props.scoreboard;
        const scoreBoardImg = scoreBoardDefault;
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        const titleStyle = this.state.position && (this.state.position.title == null ? "" : {top:this.state.position.title.y * 120,left:this.state.position.title.x * 600})
        const hostnameStyle = this.state.position && (this.state.position.hostname == null ? "" : {top:this.state.position.hostname.y * 120,left:this.state.position.hostname.x * 600})
        const guestnameStyle = this.state.position && (this.state.position.guestname == null ? "" : {top:this.state.position.guestname.y * 120,left:this.state.position.guestname.x * 600})
        const hostscoreStyle = this.state.position && (this.state.position.hostscore == null ? "" : {top:this.state.position.hostscore.y * 120,left:this.state.position.hostscore.x * 600})
        const guestscoreStyle = this.state.position && (this.state.position.guestscore == null ? "" : {top:this.state.position.guestscore.y * 120,left:this.state.position.guestscore.x * 600})
        const hostshirtStyle = this.state.position && (this.state.position.hostshirt == null ? "" : {top:this.state.position.hostshirt.y * 120,left:this.state.position.hostshirt.x * 600})
        const guestshirtStyle = this.state.position && (this.state.position.guestshirt == null ? "" : {top:this.state.position.guestshirt.y * 120,left:this.state.position.guestshirt.x * 600})
        const timeStyle = this.state.position && (this.state.position.time == null ? "" : {top:this.state.position.time.y * 120,left:this.state.position.time.x * 600})
        return <div>
            <div className="inline">
                <div className="center mt-s mb-s inline-flex-important">
                    <span>比分牌背景:</span>
                    <Upload
                        accept="image/*"
                        action={upload}
                        listType="picture-card"
                        withCredentials={true}
                        showUploadList={false}
                        disabled={this.state.uploading}
                        onChange={this.handleUploadChange.bind(this,"scoreBoard")}
                        className="qz-score-board-upload-board"
                    >
                        {
                            <img
                                src={this.state.scoreBoard}
                                alt="scoreboard"
                                style={{width:200,height:40}}/>
                        }

                    </Upload>
                </div>
                <div className="center mt-s mb-s inline-flex-important">
                    <span>主队球衣背景:</span>
                    <Upload
                        accept="image/*"
                        action={upload}
                        listType="picture-card"
                        withCredentials={true}
                        showUploadList={false}
                        disabled={this.state.uploading}
                        onChange={this.handleUploadChange.bind(this,"hostShirt")}
                        className="qz-score-board-upload-shirt"
                    >
                        {
                            <img
                                src={this.state.hostShirt}
                                alt="hostShirt"
                                style={{width:40,height:40}}/>
                        }

                    </Upload>
                </div>
                <div className="center mt-s mb-s inline-flex-important">
                    <span>客队球衣背景:</span>
                    <Upload
                        accept="image/*"
                        action={upload}
                        listType="picture-card"
                        withCredentials={true}
                        showUploadList={false}
                        disabled={this.state.uploading}
                        onChange={this.handleUploadChange.bind(this,"guestShirt")}
                        className="qz-score-board-upload-shirt"
                    >
                        {
                            <img
                                src={this.state.guestShirt}
                                alt="guestShirt"
                                style={{width:40,height:40}}/>
                        }

                    </Upload>
                </div>
            </div>
            <div className="qz-score-board-container dark-white">
                <img className="qz-score-board-background-img" src={this.state.scoreBoard ? this.state.scoreBoard : this.props.scoreboard.scoreboardpic}/>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <span flag="title" style={titleStyle} className="qz-score-board-match-name center handle">标题</span>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <span flag="hostname" style={hostnameStyle} className="qz-score-board-team-name center handle">主队名</span>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <span flag="guestname" style={guestnameStyle} className="qz-score-board-team-name center handle">客队名</span>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <span flag="hostscore" style={hostscoreStyle} className="qz-score-board-score center handle">主分</span>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <span flag="guestscore" style={guestscoreStyle} className="qz-score-board-score center handle">客分</span>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <span flag="time" style={timeStyle} className="qz-score-board-time center handle">时间</span>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <div flag="hostshirt" style={hostshirtStyle} className="qz-score-board-shirt center handle">
                        <span draggable={false}>主</span>
                        <img draggable={false} src={this.state.hostShirt ? this.state.hostShirt : this.props.scoreboard.hostshirtpic}/>
                    </div>
                </Draggable>
                <Draggable axis="both" bounds="parent" handle=".handle" {...dragHandlers}>
                    <div flag="guestshirt" style={guestshirtStyle} className="qz-score-board-shirt center handle">
                        <span draggable={false}>客</span>
                        <img draggable={false} src={this.state.guestShirt ? this.state.guestShirt : this.props.scoreboard.guestshirtpic}/>
                    </div>
                </Draggable>
            </div>
            <div style={{width: 600}} className="center mt-s">
                <Button type="primary" onClick={()=>{
                    this.props.callBackFunc({id: this.props.scoreboard ? this.props.scoreboard.id : null,
                        scoreboardpic: this.state.scoreBoard,
                        hostshirtpic: this.state.hostShirt,
                        guestshirtpic: this.state.guestShirt,
                        ...this.state.position} );
                }}>确定</Button>
                <Button type="danger" hidden={!this.props.showDelete} onClick={this.onDelete}>删除</Button>
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ScoreBoard);