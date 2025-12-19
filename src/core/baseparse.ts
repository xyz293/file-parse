import type {FileType,Parse} from '../type/parse.ts'

export class Baseparse<T=any> implements Parse<T>{
   async validate(content:Blob){
       try{
         const data =await content.text()
          if(!data){
              return ''
          }
          return data
       }
       catch{
        return ''
       }
   }
   async parse(content: string ,key:string){
       try{
             
      
            
          //一会会使用工厂模式去写解析过程
       }
       catch{
          return null
       }
   }
}