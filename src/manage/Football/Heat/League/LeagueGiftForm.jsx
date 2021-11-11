import React from 'react';
import {
    Form,
    Input,
    Select,
    Upload,
    Tooltip,
    InputNumber,
    Icon,
    Button,
    Row,
    Col,
    Collapse, Progress, Switch, message, Modal, TreeSelect
} from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn';
import {receiveData} from "../../../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getGifts, upload} from "../../../../axios";
import imgcover from "../../../../static/imgcover.jpg";
import NP from 'number-precision'


const Option = Select.Option;
const {Panel} = Collapse;

moment.locale('zh-cn');

const FormItem = Form.Item;

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

class LeagueGiftForm extends React.Component {
    state = {}

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        this.setState({loading: true});
        getGifts({
            pageSize: 100,
            pageNum: 1,
            sortField: "sortIndex",
            sortOrder: "asc",
        }).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                this.setState({
                    loading: false,
                    giftData: data.data ? data.data.records : "",
                });
            } else {
                message.error('获取礼物列表失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    getTreeData = (giftData) => {
        let treeData = [];
        if (giftData) {
            for (let i = 0; i < giftData.length; i++) {
                let item = giftData[i];
                let obj = {
                    title: <div>
                        <img className="round-img-xs" src={item.pic}/>
                        <span>{item.name}</span>
                        <span>（{NP.divide(item.price, 100)}元）</span>
                        {!item.available ? <span className="danger pa-xs border-radius-10px">已禁用</span> : null}
                    </div>,
                    value: item.id,
                };
                treeData.push(obj);
            }
        }
        return treeData;
    }
    getGiftInfo = (giftId) => {
        if (this.state.giftData && Array.isArray(this.state.giftData)) {
            for (let gift of this.state.giftData) {
                if (gift.id == giftId) {
                    if (gift.sortIndex == null) {
                        gift.sortIndex = 99;
                    }
                    return gift;
                }
            }
        }
        return {sortIndex: 99};
    }

    render() {
        const {form, record} = this.props;
        const {getFieldDecorator} = form;
        const getGiftInfo = this.getGiftInfo

        return (
            <div>
                <Form onSubmit={this.props.handleSubmit}>
                    <div className="w-full center">
                        <span className="mb-n mt-m" style={{fontSize: 20}}>选择礼物</span>
                    </div>
                    <div className="w-full">
                        <FormItem className="bs-form-item">
                            {getFieldDecorator('giftList', {
                                initialValue: record && record.giftList ? record.giftList : (this.state.giftData ? this.state.giftData.map(gift => gift.id) : []),
                                getValueFromEvent(e) {
                                    return form.getFieldValue('giftList')
                                },
                                onChange(values) {
                                    if (values && Array.isArray(values)) {
                                        values = values.filter(value => typeof value == 'number').sort((a, b) => {
                                            const gift_a = getGiftInfo(a);
                                            const gift_b = getGiftInfo(b);
                                            return gift_a.sortIndex - gift_b.sortIndex;
                                        });
                                        form.setFieldsValue({
                                            giftList: values
                                        })
                                    }
                                }
                            })(
                                <TreeSelect
                                    size="large"
                                    disabled={this.state.loading}
                                    treeData={this.getTreeData(this.state.giftData)}
                                    style={{minWidth: "100%", maxWidth: "100%", textAlign: "center"}}
                                    placeholder="请选择"
                                    dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                    allowClear
                                    multiple
                                    filterTreeNode={(inputValue, treeNode) => {
                                        return treeNode.props.title.indexOf(inputValue) != -1 || treeNode.props.value == inputValue;
                                    }}/>
                            )}
                        </FormItem>
                    </div>
                    <div className="w-full center mt-l">
                        <FormItem wrapperCol={{span: 12, offset: 6}}>
                            <Button loading={this.props.modifyLoading}
                                    type="primary"
                                    htmlType="submit">
                                确定
                            </Button>
                        </FormItem>
                    </div>
                </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeagueGiftForm);