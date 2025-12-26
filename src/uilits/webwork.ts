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
  public run(data: any,type:string){
    let hasAssigned = false
      return new Promise((resolve, reject) => {
         for(let item of this.workerList){
         if(item.isActive===false){
             item.work.postMessage({
               data,
               type
             })
             item.isActive = true
             hasAssigned = true
             const onmessage = (e:MessageEvent) => {
                // 处理worker返回的消息
              item.isActive = false
              const task = this.getTask()
            if(task){ // 返回的是一个对象
              this.run(task.data,task.type).then(task.resolve).catch(task.reject)
              //这里通过递归进行，将需要返回的promise的resolve进行传递之后会返回我需要的值
            }
              resolve(e.data)
             }
             const err = (e:ErrorEvent) => {
                reject('worker error')
             }
             item.work.addEventListener('message', onmessage,{once: true})
             item.work.addEventListener('error', err)
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