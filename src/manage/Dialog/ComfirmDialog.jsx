import {Modal} from "antd/lib/index";

export const showConfirmDialog = (title,content,callback)=> {
    Modal.confirm({
        title: title,
        content: content,
        onOk() {
            callback();
        },
    })
}
