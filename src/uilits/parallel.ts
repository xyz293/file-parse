import type {parse,parseresult} from '../type/result.ts'
import {parserfactory} from '../core/parserfactory.ts'
import {LRU} from './cash.ts'
/*
这里是可以将多个文件进行解析内容的函数，
第一个是所有文件进行汇总的函数
第二个函数将文件切片
后续函数是将分片并发将文件解析
*/
export const parallelfile =async(list:parse[],size:number,type:string,filename:string)=>{//通过前端将文件类型传入
            let success =0
            let failed =0
            const results:parseresult[] =[]
            if(!type){
              return{
                 success:0,
                 failed:0,
                 results:[]
              }
            }
          for(let item of list){
                if(item.data){
                const filedata =await parallel(item.data,size,type,filename)
                  if(filedata){
                    success++
                  }
                  else {
                    failed++
                  }
                  results.push({
                    data:filedata,
                    index:item.index
                  })
                }
            }
            return {
                success:success,
                failed:failed,
                results:results
            }
}

export const slicechunck =(chuncklist:Blob,size:number,indexchunck:number)=>{
            const list =[]
           for(let i =0;i<3;i++){
               if(indexchunck<chuncklist.size){
                const data =chuncklist.slice(indexchunck,indexchunck+size)
                indexchunck+=size
                list.push(data)
               }
               break
           }
           return {
            indexchunck,
            list
           }
}
export const parallel =async(content:Blob,size:number,type:string,filenme:string):Promise<any>=>{  //对于单个文件进行操作
    try{
         const lru =LRU.getInstance()
         if(lru.has(filenme)){
            return lru.get(filenme)
         }
         else {
            const chuncksize:number =1024*size
            const chuncklist = []
            let index =0
            let results =''
        while(index<content.size){
          /* const chunck =content.slice(index,index+chuncksize)
           index+=chuncksize
           chuncklist.push(chunck)
           */
          const {list,indexchunck} =slicechunck(content,chuncksize,index)
          index =indexchunck
          const res =await getchunck(list,type)
          results=results+res
        }
        /*
        之后在这里将获取的文件数据lru缓存
        */
       lru.set(filenme,results)
        return results
         }
        /*
        const list =await getchunck(chuncklist)//通过并发实现
            if(list){
                return list
            }
            return ''
            */
    }catch{
        return ''
    }
}
const promise =async(chunck:Blob|undefined,type:string)=>{
    const factory =parserfactory.getinstance()
    if(chunck){
        const data = await chunck.text()   // 之后通过判断文件类型去解析
        const parse = await factory.Getparse(type) // 获取对应的解析器
    }
    return ''
}
const getchunck =async(list:Blob[],type:string)=>{
    try{
        let chuncklist =[]
        let result= ''
        for(let index in list){
           try{
             const chunck = promise(list[index],type)
             chuncklist.push(chunck)
           }catch{
            const chunck = promise(list[index],type)
            chuncklist.push(chunck)
           }
        }
        const data =await Promise.allSettled(chuncklist)
        data.forEach((item)=>{
           if(item.status==='fulfilled'){
             result=result+item.value
           }
            return ''
        })
          return result
    }catch{
        return ''
    }
}