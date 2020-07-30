import React from 'react';
import {
    Form,
    Input,
    Select,
    Radio,
    message,
    Upload,
    Button,
    Modal,
    List, Tooltip, Avatar, Icon
} from 'antd';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAllMatchs, getAreasList, getArticleList, getMatchById, upload} from "../../axios";
import imgcover from '../../static/imgcover.jpg';
import defultAvatar from "../../static/avatar.jpg";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

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

class BulletinModifyDialog extends React.Component {
    state = {
        loading: false,
        data: [],
        match: {}
    }
    isCompositions = true;
    componentDidMount() {
        getAreasList().then((data) => {
            if (data && data.code) {
                this.setState({
                    areaLoading: false,
                    areas: data.data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
        if (this.props.record.scene && this.props.record.scene.type == "match") {
            this.fetchMatch(this.props.record.scene.id);
        }
        this.setState({curtain: this.props.record.curtain, isMatch: this.props.record.scene && this.props.record.scene.type == "match"})
    }

    fetch = (searchText, pageNum) => {
        this.setState({
            loading: true,
        });
        getAllMatchs({pageSize: 20, pageNum: pageNum, name: searchText}).then((data) => {
            if (data && data.code == 200 && data.data) {
                this.setState({
                    data: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data ? this.state.data.concat(data.data.records) : []),
                    loading: false,
                    pageNum: data.data.current,
                    pageSize: data.data.size,
                    pageTotal: data.data.total,
                });
            } else {
                message.error('获取比赛列表失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    fetchMatch = (params) => {
        this.setState({
            matchLoaded: false,
        });
        getMatchById(params).then((data) => {
            if (data && data.code == 200) {
                this.setState({
                    matchLoaded: true,
                    match: data.data,
                });
            } else {
                message.error('获取比赛失败：' + (data ? data.result + "-" + data.message : data), 3);
            }
        });
    }
    getAreasOption = () => {
        let dom = [];
        dom.push(<Option value={null} data={null} key={`area-none`}>不选</Option>);
        this.state.areas.forEach((item) => {
            dom.push(<Option value={item.province} data={item.province}
                             key={`area-${item.id}`}>{item.province}</Option>);
        })
        return dom;
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handlePosterChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({posterloading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, posterUrl => this.setState({
                posterUrl,
                posterloading: false,
            }));
            setTimeout(() => {
                this.setState({isposterupload: false});
            }, 2000)
        }
    }
    onPosterChange = (form, e) => {
        form.setFieldsValue({
            content: e.target.value
        })
    }
    onRadioChange = (e) => {
        this.setState({curtain: e.target.value})
    }
    onMatchRadioChange = (e) => {
        const {form} = this.props;
        if (e.target.value == false) {
            form.setFieldsValue({scene: {type: "home"}})
        }
        this.setState({isMatch: e.target.value})
    }
    getArticleList = (params) => {
        this.setState({
            listloading: true,
        });
        getArticleList(params).then((res) => {
            if (res && res.code == 200) {
                const data = res.data
                if (data) {
                    const pagination = {...this.state.pagination};
                    pagination.total = data ? data.total_count : 0;
                    pagination.onChange = this.handleArticleListChange;
                    pagination.size = "small";
                    pagination.simple = true;
                    this.setState({
                        articledata: data.item,
                        listloading: false,
                        pagination,
                    });
                } else {
                    message.error('获取文章列表失败：' + (data ? data.result + "-" + data.message : data), 3);
                }
            }
        })
    }
    handleArticleListChange = (page, pageSize) => {
        const pager = {...this.state.pagination};
        pager.current = page;
        pager.pageSize = pageSize;
        this.setState({
            pagination: pager,
        });
        this.getArticleList({
            pageSize: 5,
            pageNum: pager.current - 1,
        });
    }
    onArticleShowClick = () => {
        this.getArticleList({
            pageSize: 5,
            pageNum: 0,
        })
        this.setState({articleShow: true})
    }
    onArticleShowHide = () => {
        this.setState({articleShow: false})
    }
    onArticlelistClick = (form, item) => {
        form.setFieldsValue({
            url: item.url,
            type: "website"
        })
        this.onArticleShowHide();
    }
    handleChange = (value) => {
        const {form} = this.props;
        form.setFieldsValue({scene: {type: "match", id: `${value}`}})
    }
    handleShowMore = (e) => {
        const num = Math.floor(e.target.scrollTop / 50);
        if (num + 5 >= this.state.data.length) {
            this.handleOnLoadMore(e);
        }
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
    handleSearch = (e) => {
        const value = e.target.value;
        this.setState({searchText: value});
        // setTimeout(()=>{
        if (this.isCompositions) {
            this.fetch(value, 1);
        }
        // },100);
    }
    //中文输入中的状态 参考 https://blog.csdn.net/qq1194222919/article/details/80747192
    onInputCompositionStart = () => {
        this.isCompositions = false;
    }
    onInputCompositionEnd = () => {
        this.isCompositions = true;
        this.fetch(this.state.searchText, 1);
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        const isMobile = this.props.responsive.data.isMobile;
        const handlePosterChange = this.handlePosterChange;
        const content_article = <div>
            <List
                rowKey={record => record.media_id}
                style={{minHeight: 300}}
                className="list-pading-s"
                dataSource={this.state.articledata}
                pagination={this.state.pagination}
                loading={this.state.listloading}
                renderItem={item => {
                    const data = item.content.news_item;
                    const time = item.content.update_time
                    let index = 0;
                    return <List
                        rowKey={record => record.media_id}
                        key={item.media_id}
                        itemLayout="vertical"
                        size="large"
                        dataSource={data}
                        renderItem={item => {
                            index = index + 1;
                            return (
                                <List.Item
                                    key={`article-${item.media_id}-${index}`}
                                    className="cursor-hand"
                                    onClick={this.onArticlelistClick.bind(this, form, item)}
                                    extra={
                                        <img
                                            width={140}
                                            alt="logo"
                                            src={`http://img01.store.sogou.com/net/a/04/link?appid=100520029&url=${item.thumb_url}`}
                                        />
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={null}
                                        title={item.title}
                                        description={item.digest}
                                    />
                                    {new Date(time * 1000).toLocaleString()}
                                </List.Item>)
                        }}
                    />
                }}
            />
        </div>
        const currentMatch = this.state.match;
        const options = this.state.data.map(d => <Option style={{height: 50}} key={d.id} value={d.id}>
            <Tooltip title={d.name + "-" + d.startTime}>
                {(d.hostteam == null || d.guestteam == null) ?
                    <span>{d.name}</span>
                    : <div className="center">
                        <Avatar src={d.hostteam ? d.hostteam.headImg : defultAvatar}/>
                        <p className="ml-s">{d.hostteam ? d.hostteam.name : ""}</p>
                        <p className="ml-s mr-s">{d.score}</p>
                        <Avatar src={d.guestteam ? d.guestteam.headImg : defultAvatar}/>
                        <p className="ml-s">{d.guestteam ? d.guestteam.name : ""}</p>
                    </div>}
            </Tooltip>
        </Option>);
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('curtain', {
                            initialValue: record.curtain,
                        })(
                            <RadioGroup>
                                <Radio value={false}>公告栏</Radio>
                                <Radio value={true}>广告牌</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {this.state.curtain ? <FormItem {...formItemLayout} label="位置" className="bs-form-item">
                        {getFieldDecorator('isMatch', {
                            initialValue: record.scene && record.scene.type == "match",
                            hidden: true,
                        })(
                            <RadioGroup onChange={this.onMatchRadioChange}>
                                <Radio value={false}>首页</Radio>
                                <Radio value={true}>比赛</Radio>
                            </RadioGroup>
                        )}
                    </FormItem> : null}
                    {this.state.isMatch ? <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('scene', {
                            rules: [{required: true, message: '请选择关联比赛!'}],
                            initialValue: record.scene,
                        })(
                            <Input hidden={true}/>
                        )}
                    </FormItem> : <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('scene', {
                            initialValue: {type: "home"},
                        })(
                            <Input hidden={true}/>
                        )}
                    </FormItem>}
                    {this.state.isMatch ?
                        <div>
                            <div className="center w-full">
                                <span style={{fontSize: 16, fontWeight: 'bold'}}>关联比赛</span>
                            </div>
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
                                // mode="tags"
                                // loading={this.state.loading}
                                getInputElement={() => (
                                    <input onInput={this.handleSearch}
                                           onCompositionStart={this.onInputCompositionStart}
                                           onCompositionEnd={this.onInputCompositionEnd}/>)}
                            >
                                {options}
                            </Select>
                            <div className="center w-full">
                                <Icon className="ml-s" style={{fontSize: 16}} type="loading"
                                      hidden={this.state.matchLoaded}/>
                            </div>
                            <div className="center w-full">
                                {(currentMatch.hostteam == null || currentMatch.guestteam == null) ?
                                    <Tooltip
                                        title={currentMatch.name + "-" + currentMatch.startTime}><span>{currentMatch.name}</span></Tooltip>
                                    : <Tooltip title={currentMatch.name + "-" + currentMatch.startTime}>
                                        <div className="center">
                                            <Avatar
                                                src={currentMatch.hostteam ? currentMatch.hostteam.headImg : defultAvatar}/>
                                            <p className="ml-s">{currentMatch.hostteam ? currentMatch.hostteam.name : ""}</p>
                                            <p className="ml-s mr-s">{currentMatch.score}</p>
                                            <Avatar
                                                src={currentMatch.guestteam ? currentMatch.guestteam.headImg : defultAvatar}/>
                                            <p className="ml-s">{currentMatch.guestteam ? currentMatch.guestteam.name : ""}</p>
                                        </div>
                                    </Tooltip>}
                            </div>
                        </div>
                        : null}
                    <FormItem {...formItemLayout} label="跳转类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            initialValue: record.type,
                            rules: [{required: true, message: '请选择!'}],
                        })(
                            <RadioGroup>
                                <Radio value="page">跳转页面</Radio>
                                <Radio value="website">跳转网站</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="地区" className="bs-form-item">
                        {getFieldDecorator('areatype', {
                            initialValue: record.areatype,
                        })(
                            <RadioGroup>
                                <Radio value={0}>默认</Radio>
                                <Radio value={1}>全国</Radio>
                                <Radio value={2}>全国青少年</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="链接" className="bs-form-item">
                        {getFieldDecorator('url', {
                            initialValue: record.url,
                        })(
                            <Input placeholder='请输入链接!'/>
                        )}
                        <div>
                            <Modal
                                title="选择公众号文章"
                                className={isMobile ? "top-n" : ""}
                                visible={this.state.articleShow}
                                maskClosable={false}
                                footer={[
                                    <Button key="back" onClick={this.onArticleShowHide}>取消</Button>,
                                ]}
                                onCancel={this.onArticleShowHide}>
                                {content_article}
                            </Modal>
                            <Button onClick={this.onArticleShowClick}>选择公众号文章</Button>
                        </div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="省份" className="bs-form-item">
                        {getFieldDecorator('province', {
                            initialValue: record.province,
                        })(
                            <Select className="w-full" disabled={this.props.loading}>
                                {this.state.areas ? this.getAreasOption() : null}
                            </Select>
                        )}
                    </FormItem>
                    {this.state.curtain ?
                        <div>
                            <div className="w-full center">
                                <FormItem {...formItemLayout} className="bs-form-item form-match-poster">
                                    {getFieldDecorator('content', {
                                        initialValue: record.content,
                                        getValueFromEvent(e) {
                                            return form.getFieldValue('content')
                                        },
                                        onChange(e) {
                                            const file = e.file;
                                            if (file.response) {
                                                form.setFieldsValue({
                                                    content: file.response.data
                                                })
                                            }
                                            handlePosterChange(e);
                                        }
                                    })(
                                        <Upload
                                            accept="image/*"
                                            action={upload}
                                            listType="picture-card"
                                            withCredentials={true}
                                            showUploadList={false}
                                            disabled={this.state.posterloading}
                                            onChange={this.handlePosterChange}
                                        >
                                            {
                                                <img
                                                    src={form.getFieldValue('content') ? form.getFieldValue('content') : imgcover}
                                                    alt="poster"
                                                    className="form-match-poster-img"/>
                                            }

                                        </Upload>
                                    )}
                                </FormItem>
                            </div>
                            <div className="w-full center mt-m">
                                <Input style={{minWidth: 300, textAlign: "center"}} placeholder='图片地址'
                                       onChange={this.onPosterChange.bind(this, form)}
                                       value={form.getFieldValue('content')}/>
                            </div>
                        </div> : <FormItem {...formItemLayout} label="内容" className="bs-form-item">
                            {getFieldDecorator('content', {
                                rules: [{required: true, message: '请输入内容!'}],
                                initialValue: record.content,
                                getValueFromEvent(e) {
                                    return e.target.value
                                },
                                onChange(e) {
                                }
                            })(
                                <Input.TextArea placeholder='请输入内容!'/>
                            )}
                        </FormItem>}
                    <FormItem style={{margin: 0}}>
                        {getFieldDecorator('id', {
                            initialValue: record.id,
                        })(
                            <Input hidden={true}/>
                        )}
                    </FormItem>
                </Form>
                :
                null
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

export default connect(mapStateToProps, mapDispatchToProps)(BulletinModifyDialog);