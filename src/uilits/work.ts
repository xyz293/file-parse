import {promise} from './parallel.ts'
self.onmessage = async(event) => {
  try{
    const res = await promise(event.data,event.type)
   self.postMessage(
   { res,
    message:'success'
   }
   ) // 返回一个string[]的内容
  }
  catch(error){
    self.postMessage({
   error:error,
    message:'error'
    })
  }
}