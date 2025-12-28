/*

*/
export type FileType ='json' | 'csv' | 'excel' | 'xml' | 'markdown' | 'text'
export interface parseResult<T=any>{
    data:T,
    metadata: {
    /** 文件大小（字节） */
    size: number;
    /** 解析耗时（毫秒） */
    duration: number;
    /** 文件类型 */
    type: FileType;
    /** 是否使用了缓存 */
    cached?: boolean;
  };
}


export interface Parse<T=any>{
    /*
     验证文件格式   以及解析文件
    */
    validate(content: Blob): Promise<string>;//转化blob  是前端进行文件解析
    parse(content:string,key:string):Promise<parseResult<T>|null>
}


export interface Basework{
    work:Worker
    isActive:boolean
}


export interface Task{
    data:any,
    type:string,
    resolve:(data:any)=>void,
    reject:(data:any)=>void,
}
