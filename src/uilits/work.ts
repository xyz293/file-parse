self.onmessage = async(event) => {
    const {data,type} = event.data
    if(type==='axios'){
        const res =await data
        self.postMessage({data:res})
    }
}