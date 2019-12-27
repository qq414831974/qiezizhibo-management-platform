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
    List
} from 'antd';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getAreasList, upload, getArticleList, getActivityInfoList} from "../../axios";
import imgcover from '../../static/imgcover.jpg';
import {parseTimeStringWithOutYear} from "../../utils";

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

class BulletinAddDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
        getAreasList().then((data) => {
            if (data) {
                this.setState({
                    areaLoading: false,
                    areas: data,
                });
            } else {
                message.error('获取地区列表失败：' + (data ? data.code + ":" + data.msg : data), 3);
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
    getArticleList = (params) => {
        this.setState({
            listloading: true,
        });
        getArticleList(params).then((data) => {
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
                message.error('获取文章列表失败：' + (data ? data.result + "-" + data.msg : data), 3);
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

        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="类型" className="bs-form-item">
                        {getFieldDecorator('curtain', {
                            initialValue: false,
                        })(
                            <RadioGroup onChange={this.onRadioChange}>
                                <Radio value={false}>公告栏</Radio>
                                <Radio value={true}>广告牌</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="跳转类型" className="bs-form-item">
                        {getFieldDecorator('type', {
                            rules: [{required: true, message: '请选择!'}],
                            initialValue: "page",
                        })(
                            <RadioGroup>
                                <Radio value="page">跳转页面</Radio>
                                <Radio value="website">跳转网站</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="地区" className="bs-form-item">
                        {getFieldDecorator('areatype', {
                            initialValue: 0
                        })(
                            <RadioGroup>
                                <Radio value={0}>默认</Radio>
                                <Radio value={1}>全国</Radio>
                                <Radio value={2}>全国青少年</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="链接" className="bs-form-item">
                        {getFieldDecorator('url', {})(
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
                        {getFieldDecorator('province', {})(
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
                                        getValueFromEvent(e) {
                                            return form.getFieldValue('content')
                                        },
                                        onChange(e) {
                                            const file = e.file;
                                            if (file.response) {
                                                form.setFieldsValue({
                                                    content: file.response
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
                                getValueFromEvent(e) {
                                    return e.target.value
                                },
                                onChange(e) {
                                }
                            })(
                                <Input.TextArea placeholder='请输入内容!'/>
                            )}
                        </FormItem>}
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

export default connect(mapStateToProps, mapDispatchToProps)(BulletinAddDialog);