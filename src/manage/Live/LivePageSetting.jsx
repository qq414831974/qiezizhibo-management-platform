import React from "react";
import {Row, Col, Card, Icon, Collapse, Radio, Slider, Upload, Button} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {receiveData} from "../../action";
import panelBottom from "../../static/page_live_panel_bottom.png"
import panelRight from "../../static/page_live_panel_right.png"
import {CompactPicker} from 'react-color';
import {getActivityDetailInfo, modifyActivityDetailInfo, upload} from "../../axios";
import {message} from "antd/lib/index";

const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

class LivePageSetting extends React.Component {
    state = {
        pageLoading: false,
        loading: false,
        data: {},
    };

    componentDidMount() {
        if (!this.props.visible) {
            return;
        }
        this.setState({
            pageLoading: false,
        });
        this.fetch(this.props.id);
    }

    fetch = (params = {}) => {
        getActivityDetailInfo(params).then((data) => {
            if (data && data.message == null) {
                this.setState({
                    pageLoading: true,
                    data: data ? data : data,
                    background: data ? "#" + data.data.colorBackground : "#ffffff"
                });
            } else {
                message.error('获取直播信息失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });
    }
    save = (id, params) => {
        modifyActivityDetailInfo(id, params).then((data) => {
            if (data) {
                if (data.result) {
                    this.setState({
                        pageLoading: true,
                    });
                    this.fetch(this.props.id);

                } else {
                    message.error('修改直播信息失败：' + (data ? data.name + "-" + data.message : data), 3);
                }
            } else {
                message.error('修改直播信息失败：' + (data ? data.name + "-" + data.message : data), 3);
            }
        });
    }
    submit = () => {
        const params = {};
        params["data"] = {};
        const data = params["data"];
        if (this.state.logoLayout) {
            data["positionLogo"] = this.state.logoLayout;
        }
        if (this.state.scale) {
            data["imgLogoScale"] = this.state.scale;
        }
        if (this.state.alpha) {
            data["imgLogoTransparency"] = this.state.alpha;
        }
        if (this.state.backgroundKey == 1) {
            data["colorBackground"] = this.state.background;
            data["imgBackground"] = "";
        }
        else if (this.state.backgroundKey == 2) {
            data["colorBackground"] = "";
            data["imgBackground"] = this.state.backgroundUrl;
        }
        if (this.state.imageUrl) {
            data["imgLogo"] = this.state.imageUrl;
        }
        if (this.state.coverUrl) {
            data["imgCover"] = this.state.coverUrl;
        }
        this.save(this.props.id, params);
    }

    handleFileChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    handleCoverChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, coverUrl => this.setState({
                coverUrl,
                loading: false,
            }));
        }
    }
    handleBackGroundChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, backgroundUrl => this.setState({
                backgroundUrl,
                loading: false,
            }));
        }
    }
    onRadioGroupChange = (e) => {
        this.setState({logoLayout: e.target.value});
    }

    onScaleChange = (value) => {
        this.setState({scale: value});
    }

    onAlphaChange = (value) => {
        this.setState({alpha: value});
    }

    handleColorChange = (color) => {
        this.setState({background: color.hex.substr(1)});
    }
    handleBackGroundCollapse = (value) => {
        if (value) {
            this.setState({backgroundKey: value});
        }
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    render() {
        const imageUrl = this.state.imageUrl;
        const coverUrl = this.state.coverUrl;
        const backgroundUrl = this.state.backgroundUrl;
        const data = this.state.data.data;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        var background = "";
        if (this.state.pageLoading) {
            if (this.state.backgroundKey == 1) {
                background = ("#" + this.state.background);
            } else if (this.state.backgroundKey == 2) {
                if (backgroundUrl) {
                    background = "url(" + backgroundUrl + ")";
                } else {
                    background = "url(" + data.imgBackground + ")";
                }
            } else {
                if (data.imgBackground) {
                    background = "url(" + data.imgBackground + ")";
                } else {
                    background = "#" + data.colorBackground;
                }
            }
        }
        return this.state.pageLoading ? <div className="gutter-example button-demo">
            <Row gutter={20}>
                <Col className="gutter-row" md={8}>
                    <div className="gutter-box">
                        <Collapse accordion defaultActiveKey={['1']}>
                            <Panel header="logo" key="1">
                                <div>
                                    <RadioGroup onChange={this.onRadioGroupChange}
                                                defaultValue={data.positionLogo ? data.positionLogo : "hide"}
                                    >
                                        <Radio value={"hide"}>隐藏</Radio>
                                        <Radio value={"topLeft"}>顶部居左</Radio>
                                        <Radio value={"topRight"}>顶部居右</Radio>
                                    </RadioGroup>
                                    <div className="ant-upload-drag">
                                        <Upload accept="image/*"
                                                action={upload}
                                                listType="picture-card"
                                                withCredentials={true}
                                                showUploadList={false}
                                                onChange={this.handleFileChange}
                                        >
                                            {(imageUrl ? true : data.imgLogo) ?
                                                <img src={imageUrl ? imageUrl : data.imgLogo} alt="logo" style={{
                                                    width: 60 * (this.state.scale ? this.state.scale : (data.imgLogoScale ? data.imgLogoScale : 100)) / 100 + "px",
                                                    height: 60 * (this.state.scale ? this.state.scale : (data.imgLogoScale ? data.imgLogoScale : 100)) / 100 + "px",
                                                    opacity: (this.state.alpha ? this.state.alpha : (data.imgLogoTransparency ? data.imgLogoTransparency : 100)) / 100
                                                }}/> : uploadButton}
                                        </Upload>
                                    </div>
                                    <div><p>缩放：</p><Slider min={0} max={100}
                                                           defaultValue={data.imgLogoScale ? data.imgLogoScale : 100}
                                                           step={1}
                                                           onChange={this.onScaleChange}/></div>
                                    <div><p>透明度：</p><Slider min={0} max={100} step={1}
                                                            defaultValue={data.imgLogoTransparency ? data.imgLogoTransparency : 100}
                                                            onChange={this.onAlphaChange}/></div>
                                    <div>
                                        <ul style={{paddingLeft: 20}}>
                                            <li>建议上传图片的高度小于 60 px</li>
                                            <li>支持 jpg/png/gif，3MB 以内</li>
                                        </ul>
                                    </div>
                                </div>
                            </Panel>
                            <Panel header="封面" key="2">
                                <div className="ant-upload-drag-cover">
                                    <Upload accept="image/*"
                                            action={upload}
                                            listType="picture-card"
                                            withCredentials={true}
                                            showUploadList={false}
                                            onChange={this.handleCoverChange}
                                            style={{minWidth: 215, height: 121}}
                                    >
                                        {(coverUrl ? true : data.imgCover) ?
                                            <img src={coverUrl ? coverUrl : data.imgCover} alt="cover" style={{
                                                width: "215px",
                                                height: "121px",
                                            }}/> : uploadButton}
                                    </Upload>
                                </div>
                                <div>
                                    <ul style={{paddingLeft: 20}}>
                                        <li>建议上传的尺寸为 860*484 px</li>
                                        <li>支持 jpg/png/gif，3MB 以内</li>
                                    </ul>
                                </div>
                            </Panel>
                            <Panel header="播放页背景" key="3">
                                <Collapse accordion onChange={this.handleBackGroundCollapse}>
                                    <Panel header="播放页背景色" key="1">
                                        <div><CompactPicker color={this.state.background}
                                                            onChangeComplete={this.handleColorChange}/>
                                        </div>
                                    </Panel>
                                    <Panel header="播放页背景图片" key="2">
                                        <div className="ant-upload-drag-cover">
                                            <Upload accept="image/*"
                                                    action={upload}
                                                    listType="picture-card"
                                                    withCredentials={true}
                                                    showUploadList={false}
                                                    onChange={this.handleBackGroundChange}
                                                    style={{minWidth: 215, height: 121}}
                                            >
                                                {(backgroundUrl ? true : data.imgBackground) ?
                                                    <img src={backgroundUrl ? backgroundUrl : data.imgBackground}
                                                         alt="cover" style={{
                                                        width: "215px",
                                                        height: "121px",
                                                    }}/> : uploadButton}
                                            </Upload>
                                        </div>
                                        <div>
                                            <ul style={{paddingLeft: 20}}>
                                                <li>建议上传的尺寸为 1280*720 px</li>
                                                <li>支持 jpg/png/gif，3MB 以内</li>
                                            </ul>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                        <Button type="primary" size="large" className="ml-s mt-s" onClick={this.submit}>保存配置</Button>
                    </div>
                </Col>
                <Col className="gutter-row" md={2}>
                </Col>
                <Col className="gutter-row" md={14}>
                    <div className="gutter-box">
                        <Card bordered={true} className="card-no-padding">
                            <div className="clear y-center">
                                <div className="page-background" style={{
                                    background: background,
                                    height: (this.props.responsive.data.isMobile ? document.body.clientHeight / 2.8 : document.body.clientHeight / 2)
                                }}>
                                    <div className="page-foreground">
                                        <Col span={18} className="h-full">
                                            <Row style={{height: "93%", lineHeight: 0}}>
                                                <img className="w-full h-full"
                                                     src={coverUrl ? coverUrl : data.imgCover}/>
                                            </Row>
                                            <Row style={{height: "7%", lineHeight: 0}}>
                                                <img className="w-full h-full" src={panelBottom}/>
                                            </Row>
                                        </Col>
                                        <Col span={6} className="h-full">
                                            <img className="w-full h-full" src={panelRight}/>
                                        </Col>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div> : <div/>
    }
}

const mapStateToProps = state => {
    const {auth = {data: {}}, responsive = {data: {}}} = state.httpData;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LivePageSetting);