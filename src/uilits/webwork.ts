import type { Basework } from '../type/parse.ts'
export class webworkPool{
  private workerList :Basework[] = [] //为空闲的worker队列
  private taskQueue :any[] = [] //为等待中的任务队列
  private maxWorkerCount : number
  private path: string
  constructor(maxWorkerCount : number,path: string){
    this.maxWorkerCount = maxWorkerCount
    this.path = path
     for(let index = 0; index < this.maxWorkerCount; index++) {
      this.workerList.push(this.createWorker())
    }
  }
  private createWorker(): Basework {
    const worker = {
      work: new Worker(this.path),
      isActive: false
    }
    worker.work.onmessage = (e) => {
       // 处理worker返回的消息
       worker.isActive = false
       const task = this.getTask()
       if(task){ // 返回的是一个对象
        worker.work.postMessage(task)
        worker.isActive = true
       }

    }
    return worker
  }
  private getTask(){
     return this.taskQueue.shift()
  }
  public run(data: any,type:string){
     for(let item of this.workerList){
         if(item.isActive===false){
             item.work.postMessage({
               data,
               type
             })
             item.isActive = true
             break
         }
     }
     this.assignTaskToWorker({data,type})
  }
  private assignTaskToWorker(data: any){ 
    this.taskQueue.push(data)
}
}
export default webworkPool