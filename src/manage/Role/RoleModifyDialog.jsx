import React from 'react';
import {
    Form,
    Input,
    Icon,
    TreeSelect, Tooltip, Select, Checkbox,
} from 'antd';
import 'moment/locale/zh-cn';
import {receiveData} from "../../action";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getPermissionList} from "../../axios";
import {message} from "antd/lib/index";
import {distinctById} from "../../utils"

const Option = Select.Option;

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

class RoleModifyDialog extends React.Component {
    state = {loading: true}

    componentDidMount() {
        if (this.props.visible) {
            this.fetch(null, 1);
            this.isCompositions = true;
        }
    }

    fetch = (searchText, pageNum) => {
        getPermissionList({
            pageSize: 200,
            pageNum: pageNum,
            name: searchText,
            sortOrder: "asc",
            sortField: "sortIndex"
        }).then((data) => {
            if (data && data.code == 200 && data.data.records) {
                this.setState({
                    data: pageNum == 1 ? (data.data ? data.data.records : []) :
                        (data.data ? this.state.data.concat(data.data.records) : []),
                    loading: false,
                    pageNum: data.data.current,
                    pageSize: data.data.size,
                    pageTotal: data.data.total,
                });
            } else {
                message.error('获取权限信息失败：' + (data ? data.code + ":" + data.message : data), 3);
            }
        });
    }

    getPermissionOption = () => {
        let dom = [];
        let data = this.state.data || [];
        let recordData = this.props.record && this.props.record.permissions ? this.props.record.permissions : [];
        data = distinctById(data.concat(recordData));
        data.forEach((item, index) => {
            dom.push(<Option value={item.id} style={{height: 50}} key={`permission-${item.id}`}>
                <Tooltip placement="rightTop" title={
                    this.getPermissionTip(item)
                }>
                    <p className="mb-n">{item.name}</p>
                </Tooltip>
            </Option>)
        });
        return dom;
    }
    getPermissionTip = (item) => {
        return <div>
            <p key={item.id + "name"}>{`${item.name}`}</p>
        </div>;
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
        if (data.length >= this.state.pageTotal) {
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetch(this.state.searchText, this.state.pageNum + 1);
    }
    handleChange = (value) => {
        this.setState({value});
    }

    render() {
        const {visible, form, record} = this.props;
        const {getFieldDecorator} = form;
        return (
            visible ?
                <Form>
                    <FormItem {...formItemLayout} label="直播人员" className="bs-form-item">
                        {getFieldDecorator('isAnchor', {
                            initialValue: record.isAnchor,
                            valuePropName: 'checked',
                        })(
                            <Checkbox/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名字" className="bs-form-item">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名字!'}],
                            initialValue: record.name
                        })(
                            <Input placeholder='请输入名字!'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label="权限"
                              className="bs-form-item-nowrap">
                        {getFieldDecorator('permissions', {
                            rules: [{required: true, message: '请选择权限!'}],
                            initialValue: record.permissions ? record.permissions.flatMap(role => role.id) : null,
                        })(
                            <Select
                                showSearch
                                style={{minWidth: 300}}
                                placeholder="请选择"
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onChange={this.handleChange}
                                onPopupScroll={this.handleShowMore}
                                notFoundContent={null}
                                mode="multiple"
                                loading={this.state.loading}
                                getInputElement={() => (
                                    <input onInput={this.handleSearch}
                                           onCompositionStart={this.onInputCompositionStart}
                                           onCompositionEnd={this.onInputCompositionEnd}/>)}
                            >
                                {this.getPermissionOption()}
                            </Select>
                        )}
                        <Icon className="ml-s" style={{fontSize: 16}} type="loading" hidden={!this.state.loading}/>
                    </FormItem>
                    <FormItem {...formItemLayout} className="bs-form-item">
                        {getFieldDecorator('id', {
                            initialValue: record.id
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleModifyDialog);