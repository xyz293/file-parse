import {requestFile} from './http.ts'
import axios from 'axios'
/** 
* @param urls  文件的url数组
*/
interface parallelRequestFile{
    data:any,
    type:string|undefined,
    filename:string|undefined
}
const GetworkData =(list:any[])=>{
      return new Promise((resolve,reject)=>{
            const work = new Worker('./webwork.ts')
            work.postMessage(list)
            work.onmessage =(e)=>{
                if(e.data){
                    resolve(e.data)
                }
                reject([])
            }
        })
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
        const res :any=await GetworkData (list)
        const result=[]
        for(let index in res){
            const url =urls[Number(index)]
            const data =res[Number(index)]
            if(data?.status==='fulfilled' &&typeof url ==='string'){
                const res =requestFile(url,data.value)
                result.push(res)
            }
        }
        return result
       
}