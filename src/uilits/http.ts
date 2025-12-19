import axios from 'axios'
import {LRU} from './cash.ts'
/**
 * 这里是请求文件的函数
 * @param url  文件的url
 * @param FileType 请求的文件类型(blob)
 * @returns 文件的内容  文件类型 文件名
 */
interface parallelRequestFile{
    data:any,
    type:string|undefined,
    filename:string|undefined,
}
export const requestFile =(url:string,data:any):parallelRequestFile=>{
    /*
    这里通过axios请求去获取文件内容，同时使用了lru进行缓存的机制
    （如果缓存中存在则直接返回缓存中的内容）这里指axios请求的返回内容
    */
    try{
        const lru =LRU.getInstance()
        const  contentType =data.headers['content-type'] 
        const key =url+'get'
        if(lru.has(key)){
            return {
            data: lru.get(key),
            type:getContentType(contentType),
            filename:url.split('/').pop()
        }
        }
        else {
            
        if(data.status===200&&data.data){
            lru.set(key,data.data)
            return {
                data:data.data,
                type:getContentType(contentType),
                filename:url.split('/').pop()
            }
        }
        return {
            data:null,
            type:getContentType(contentType),
            filename:url.split('/').pop()
        }
        }
    }
    catch{
          return {
            data:null,
            type:undefined,
            filename:url.split('/').pop()
        }
    }
}

const getContentType =(contentType:string):string|undefined=>{
    if(contentType.includes('application/json')){
        return 'json'
    }
    if(contentType.includes('application/csv')){
        return 'text'
    }
    if (contentType.includes('application/vnd.ms-excel') || 
      contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return 'excel';
  }
    if (contentType.includes('application/xml') || contentType.includes('text/xml')) return 'xml';
    if (contentType.includes('text/markdown')) return 'markdown';
    if (contentType.includes('text/plain')) return 'text';
}