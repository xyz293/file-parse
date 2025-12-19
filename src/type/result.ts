/*
文件解析之后获取的数据
*/
export type ParseStatus = 'success' | 'partial' | 'error';

export interface result<T=any>{
     /** 成功解析的文件数 */
    success: number;
    /** 失败的文件数 */
    failed: number;
    /** 结果列表 */
    results: parseresult[]
}
export interface parseresult{
    data:string 
    index:string
}
export interface parse{
    data:Blob
    index:string
}