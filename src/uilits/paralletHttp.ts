import {requestFile} from './http.ts'
import axios from 'axios'
/** 
* @param urls  文件的url数组
*  @return  返回一个数组，数组中的每个元素都是一个对象，对象中包含文件的内容，文件类型，文件名
*/
interface parallelRequestFile{
    data:any,
    type:string|undefined,
    filename:string|undefined
}
export const parallelRequestFile =async(urls:string[]):Promise<parallelRequestFile[]>=>{
        const list =urls.map((item)=>{
                return axios(
                    {
                        url:item,
                        method:'get',
                        responseType:'blob'
                    }
                )
        })
        const res =await Promise.allSettled(list)
        const result:parallelRequestFile[] =[]
        for(let index in res){
            const url =urls[index]
            const data =res[index]
            if(data?.status==='fulfilled' &&typeof url ==='string'){
                const res =requestFile(url,data.value)
                result.push(res)
            }
        }
        return result
       
}