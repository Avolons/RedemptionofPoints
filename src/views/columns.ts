import moment from "moment";
export const columns  = [
    {
        title:'事件',
        dataIndex: 'event'
    },
    {
        title:'topic',
        dataIndex: 'topic'
    },
    {
        title:'状态',
        dataIndex: 'status',
        customRender:(text:any)=>{
            return text.text!=1?"禁用":"启用"
        }
    },
    {
        title:'创建时间',
        dataIndex: 'createTime',
        customRender:(text:any)=>{
            return moment(text.text).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    {
        title:'更新时间',
        dataIndex: 'updateTime',
        customRender:(text:any)=>{
            return moment(text.text).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    {
        title:'备注',
        dataIndex: 'remark'
    },
    {
        title: '操作',
        key:"action",
        // scopedSlots: {customRender: ''},
        fixed:'right'
    }
]
