import type { Basework } from '../type/parse.ts'
import type {Task} from '../type/parse.ts'
export class webworkPool{
  private workerList :Basework[] = [] //为空闲的worker队列
  private taskQueue :Task[] = [] //为等待中的任务队列
  private maxWorkerCount : number
  private path: string
  private static instanc : webworkPool
  static getInstance(maxWorkerCount : number,path: string):webworkPool{
    if(!webworkPool.instanc){
      webworkPool.instanc =new webworkPool(maxWorkerCount,path)
    }
    return webworkPool.instanc
  }
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
       
    }
    return worker
  }
  private getTask(){
     return this.taskQueue.shift()
  }
  private assignTaskToWorkerDirectly(item:Basework,task:Task){
    /*
    依旧是将将上一个resolve，传参下去，
    之后在onmessage中进行判断，如果是success，就将resolve，传参下去，
    如果是error，就将reject，传参下去，
    */
     item.isActive = true
     item.work.postMessage({
       data:task.data,
       type:task.type
     })
     const onmessage = (e:MessageEvent) => {
           item.isActive = false
           if(e.data.message === 'success'){
             task.resolve(e.data)
           }
           if(this.taskQueue.length > 0){
             const nextTask = this.getTask()
             if(nextTask){
               this.assignTaskToWorkerDirectly(item,nextTask)
             }
           }
     }
     const err =()=>{
      task.reject("worker error")
     }
      item.work.addEventListener('message', onmessage,{once: true})
      item.work.addEventListener('error', err)

  }
  public run(data: any,type:string){
      return new Promise((resolve, reject) => {
        let hasAssigned = false
        /*
        将现有的worker进行分配任务，之后在onmessage中进行利用已经空闲的work进行分配任务
        */
         for(let item of this.workerList){
         if(item.isActive===false){
             hasAssigned = true
             this.assignTaskToWorkerDirectly(item,{data,type,resolve,reject})
             break
         }
     }
         if(!hasAssigned){
            this.assignTaskToWorker({data,type,resolve,reject})
            hasAssigned = true
         }
      })
  }
  private assignTaskToWorker(task: Task){ 
    this.taskQueue.push(task)
}
}
export default webworkPool