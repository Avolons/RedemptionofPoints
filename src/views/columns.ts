import moment from "moment";
export const columns  = [
    {
        title:'商品名称',
        dataIndex: 'typeName'
    },
    {
        title:'操作时间',
        dataIndex: 'createTime',
        customRender:(text:any)=>{
            return moment(text.text).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    {
        title:'描述',
        customRender:(text:any,record:any)=>{
            return `单价：${text.record.price}，数量：${text.record.weight}，总价：${text.record.totalPrice}，积分：${text.record.totalPrice}`
        }
    },
]
