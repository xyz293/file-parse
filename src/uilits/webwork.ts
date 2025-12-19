class webworkPool{
    private workerList: Worker[] = []; //为空闲的worker队列
    private taskQueue: ((worker: Worker) => void)[] = [];  //正在执行任务的队列
    private maxWorkerNum: number
    private  script: string
    private static instance: webworkPool
    constructor(maxcount:number,script:string){
        this.maxWorkerNum = maxcount
        this.script = script
        this.createWorker()
    }
    static getinstance(maxcount:number,script:string){  
        if(!webworkPool.instance){
            webworkPool.instance = new webworkPool(maxcount,script)
        }
        return webworkPool.instance
    }
    private createWorker():Worker[] {
         for(let i=0;i<this.maxWorkerNum;i++){
            const worker = new Worker(this.script)  // 无论是不是在一个文件夹，创建的work都是不一样的
            this.workerList.push(worker)
         }
         return this.workerList
    }
}

export default webworkPool