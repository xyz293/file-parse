import {promise} from './parallel.ts'
self.onmessage = async(event) => {
   const res = await promise(event.data,event.type)
   self.postMessage(res) // 返回一个string[]的内容
}