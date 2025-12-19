/*
这里定义LRU缓存的所继承需要实现的功能和所返回对应的数据
*/
export interface Basecash<T=any>{
    get(key:string):Cashdata |null
    set(key:string,data:T):void
    delete(key:string):void
    has(key:string):boolean
    //分别为获取缓存 设置缓存 删除缓存 判断缓存是否存在
}

export interface Cashdata<T=any>{
    data:T;
    time:number
    lastAccess: number;
    //对应的文件数据  设置的缓存时间  最后的访问时间为多少
}