
class webworkPool{
    private workerList :Worker[] = [] //为空闲的worker队列
    private maxWorkerNum: number
    private  script: string
    constructor(maxcount:number,script:string){
        this.maxWorkerNum = maxcount
        this.script = script
        this.init()
    }
    private init(){
        for(let i=0;i<this.maxWorkerNum;i++){  // 无论是不是在一个文件夹，创建的work都是不一样的
            const worker = new Worker(this.script)
            this.workerList.push(worker)
        }
    }
    public postTask(data:any[]|any){//这里的type是指，上传文件解析，还是axios请求
        if(this.workerList.length>0){
            const worker = this.workerList.shift()
            if(worker){
                worker.postMessage({data})
                return worker
            }
            return worker
        }

    }
    public destroy(){  //在任务完成后调用，销毁所有worker销毁其生命周期
        this.workerList.forEach((worker)=>{
            worker.terminate()
        })
        this.workerList = []
    }
}

export default webworkPool