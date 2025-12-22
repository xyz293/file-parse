import * as xlsx from 'xlsx'
export class Excel{
    /**
     *  @param file 为Blob
     */
    private async readExecl(file:Blob){
        const buffer = await file.arrayBuffer()
        const work  =xlsx.read(buffer,{type:'array'})
        const sheetName = work.SheetNames[0];
        if(sheetName){
            const sheet  = work.Sheets[sheetName]
            const data = xlsx.utils.sheet_to_json(sheet,{defval:null})
             return data
        }
    }
    private deepclone(obj:any){
        return JSON.parse(JSON.stringify(obj));
    }
    public async parse(file:Blob){ //返回一个string[]的内容
        const data = await this.readExecl(file)
       return data?.map((item)=>{
           if(item &&item instanceof Object){
              const res =this.deepclone(item)
              return JSON.stringify(res)
           }
           return item
        })
    }
}