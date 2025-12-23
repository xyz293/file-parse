import type {Basecash,Cashdata} from '../type/cash.ts'
export  class LRU <T=any> implements Basecash<T> {
    private cash =new Map<string,Cashdata<T>>()
    private static instance:LRU
    static getInstance():LRU<any>{   //这里是防止内存在同一块使用的缓存不变
                                      //使用filename进行获取缓存
        if(!LRU.instance){
            LRU.instance =new LRU(8)
        }
        return LRU.instance
    }
    constructor(private maxSize:number){
        this.maxSize=maxSize
    }
    has(key:string){
       if(this.cash.has(key)){
           const data =this.cash.get(key)
           if(data&&data.time>Date.now()){
                return true
           }
           this.delete(key)
           return false
       }
       else {
        return false
       }
    }
    get(key: string) {
        if(this.cash.has(key)){
           const data =this.cash.get(key)
           if(data &&data.time>Date.now()){
                this.delete(key)
                this.set(key,data)
                return data
           }
        }
        return null
        
    }
    set(key:string,data:any){
         if(this.cash.size<this.maxSize){
          const cash ={
            data:data,
            time:Date.now()+1000*60*5,
            lastAccess:0
         }
         this.cash.set(key,cash)
         }
        if(this.cash.size>=this.maxSize){
          const oldestKey = this.cash.keys().next().value
            if(oldestKey){
              this.cash.delete(oldestKey)
              this.cash.set(key,{
                data,
                time:Date.now()+1000*60*5,
                lastAccess:0
              })
            }
        }
    }
    delete(key:string){
        this.cash.delete(key)

    }
}
