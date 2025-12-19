//'json' | 'csv' | 'excel' | 'xml' | 'markdown' | 'text'
import { Csv } from "../parse/csv.ts";
import { Josn } from "../parse/json.ts";
import { Excel } from "../parse/excel.ts";
import { Xml } from "../parse/xml.ts";
import { Md } from "../parse/md.ts";
import { Txt } from "../parse/txt.ts";
import {LRU} from '../uilits/cash.ts'
export class parserfactory{
    private static instance:parserfactory;
    private lru:LRU
    static getinstance():parserfactory{
        if(!this.instance){
            this.instance =new parserfactory()
        }
        return this.instance
    }
    constructor(){  //在构造函数中初始化LRU缓存
      this.lru =LRU.getInstance()
      this.lru.set('json',new Josn())
      this.lru.set('csv',new Csv())
      this.lru.set('excel',new Excel())
      this.lru.set('xml',new Xml())
      this.lru.set('markdown',new Md())
      this.lru.set('text',new Txt())
    }
    SelectParse(FileType:string){  //后续通过每一个解析器返回的函数进行解析
        switch(FileType){
           case 'json':
                return new Josn()
            case 'csv':
                return new Csv()
            case 'excel':
                return  new Excel()
            case 'xml':
                return  new Xml()
            case 'markdown':
                return new Md()
            case 'text':
                return new Txt()
        }
    }
    /*
    通过传入的文件；类型去获取对应的解析器
    并且使用对应的缓存算法进行获取
    */
   async Getparse(FileType:string){   
        const parse =this.lru.get(FileType)
        if(parse){
            return parse
        }
        else{
          const data =this.SelectParse(FileType)
          this.lru.set(FileType,data)
          return data
        }
    }
}