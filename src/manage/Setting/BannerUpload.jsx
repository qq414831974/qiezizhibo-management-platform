import React from 'react';
import {Upload, Input, Button, message, Card, Select} from 'antd';
import BreadcrumbCustom from '../Components/BreadcrumbCustom';
import {bindActionCreators} from "redux";
import {receiveData} from "../../action";
import {connect} from "react-redux";
import {getAreasList, updateBanner, setBanner, upload} from "../../axios";
import {Radio} from "antd/lib/index";

const Option = Select.Option;
const RadioGroup = Radio.Group;

class BannerUpload extends React.Component {
    state = {}

    componentDidMount() {
    }

    getAreasOption = () => {
        let dom = [];
        dom.push(<Option value="无" data="无" key={`area-none`}>不选</Option>);
        this.props.areas.forEach((item) => {
            dom.push(<Option value={item.province} data={item.province}
                             key={`area-${item.id}`}>{item.province}</Option>);
        })
        return dom;
    }
    handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploading: true, isupload: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                imgUrl: info.file.response,
            });
        }
    }
    onInputChange = (e) => {
        this.setState({url: e.target.value});
    }
    onImgInputChange = (e) => {
        this.setState({imgUrl: e.target.value});
    }
    onCitySelectChange = (e) => {
        this.setState({province: e});
    }
    onSaveClick = () => {
        const img = this.props.data ? this.props.data.img : null;
        const url = this.props.data ? this.props.data.url : null;
        const province = this.props.data ? this.props.data.province : null;
        const areatype = this.props.data ? this.props.data.areatype : null;
        let func = setBanner;
        if (this.props.data && this.props.data.id) {
            func = updateBanner;
        }
        func({
            id: this.props.data ? this.props.data.id : null,
            position: this.props.index,
            img: this.state.imgUrl ? this.state.imgUrl : img,
            url: this.state.url ? this.state.url : url,
            province: this.state.province ? (this.state.province == "无" ? null : this.state.province) : province,
            areatype: this.state.areatype != null ? this.state.areatype : areatype,
        }).then((data) => {
            if (data && data.code == 200) {
                if (data.data) {
                    message.success(`轮播图${this.props.index}保存成功`, 1);
                    this.props.refreshFunc && this.props.refreshFunc()
                } else {
                    message.warn(data.msg, 1);
                }
            } else {
                message.error(`轮播图${this.props.index}保存失败` + (data ? data.code + ":" + data.msg : data), 3);
            }
        });
    }
    onRadioChange = (e) => {
        this.setState({areatype: e.target.value})
    }

    render() {
        const img = this.props.data ? this.props.data.img : null;
        const url = this.props.data ? this.props.data.url : null;
        const province = this.props.data ? this.props.data.province : null;
        const areatype = this.props.data ? this.props.data.areatype : null;
        // if (this.props.data == null) {
        //     return <div/>
        // }
        return (
            <Card title={`轮播图${this.props.index}`}>
                <div className="w-full center picture-card-warpper-auto">
                    <Upload
                        accept="image/*"
                        action={upload}
                        listType="picture-card"
                        withCredentials={true}
                        showUploadList={false}
                        onChange={this.handleAvatarChange}
                    >
                        {
                            <img
                                src={this.state.imgUrl ? this.state.imgUrl : img}
                                alt="poster"
                                className="form-match-poster-img"/>
                        }

                    </Upload>
                </div>
                <div className="w-full mt-s">
                    <Input addonBefore="图片地址" value={this.state.imgUrl ? this.state.imgUrl : img}
                           onChange={this.onImgInputChange}/>
                </div>
                <div className="w-full mt-s">
                    <Input addonBefore="url" defaultValue={url}
                           onChange={this.onInputChange}/>
                </div>
                <div className="w-full mt-s">
                    <Select className="w-full" onChange={this.onCitySelectChange}
                            disabled={this.props.loading}
                            defaultValue={province}>
                        {this.props.areas ? this.getAreasOption() : null}
                    </Select>
                </div>
                <div className="w-full mt-s">
                    <RadioGroup onChange={this.onRadioChange}
                                defaultValue={areatype}>
                        <Radio value={0}>默认</Radio>
                        <Radio value={1}>全国</Radio>
                        <Radio value={2}>全国青少年</Radio>
                    </RadioGroup>
                </div>
                <div className="w-full center mt-s">
                    <Button type="primary" onClick={this.onSaveClick}>保存</Button>
                </div>
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(BannerUpload);