import type {Basecash,Cashdata} from '../type/cash.ts'
export  class LRU <T=any> implements Basecash<T> {
    private cash =new Map<string,Cashdata<T>>()
    private static instance:LRU
    static getInstance():LRU<any>{   //这里是防止内存在同一块使用的缓存不变
                                      //使用filename进行获取缓存
        if(!LRU.instance){
            LRU.instance =new LRU()
        }
        return LRU.instance
    }
    has(key:string){
       if(this.cash.has(key)){
           const data =this.cash.get(key)
           if(data&&data.time>Date.now()){
                return true
           }
           this.delete(key)
           return false
       }
       else {
        return false
       }
    }
    get(key: string) {
        if(this.cash.has(key)){
           const data =this.cash.get(key)
           if(data &&data.time>Date.now()){
                this.delete(key)
                this.set(key,data)
                return data
           }
        }
        return null
        
    }
    set(key:string,data:any){
         const cash ={
            data:data,
            time:Date.now()+1000*60*5,
            lastAccess:0
         }
         this.cash.set(key,cash)
    }
    delete(key:string){
        this.cash.delete(key)

    }
}
/*
// 定义双向链表节点
class ListNode {
  constructor(key, value) {
    this.key = key; // 需存储key，删除尾节点时要同步删除Map中的键
    this.value = value;
    this.prev = null;   //前一个结点
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // 缓存容量
    this.map = new Map(); // 键 -> 链表节点
    // 虚拟头尾节点（简化边界处理）
    this.head = new ListNode(null, null);
    this.tail = new ListNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 辅助函数：将节点移到链表头部（标记为最近使用）
  moveToHead(node) {
    // 先移除当前节点的原连接
    this.removeNode(node);
    // 插入到head之后
    this.addToHead(node);
  }

  // 辅助函数：移除某个节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // 辅助函数：将节点插入到head之后
  addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // 辅助函数：删除尾节点（最少使用），并返回其key（用于删除Map中的键）
  removeTail() {
    const tailNode = this.tail.prev;
    this.removeNode(tailNode);
    return tailNode.key;
  }

  // 获取缓存值
  get(key) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      this.moveToHead(node); // 访问后移到头部
      return node.value;
    }
    return -1;
  }

  // 插入/更新缓存
  put(key, value) {
    if (this.map.has(key)) {
      // 键已存在：更新值 + 移到头部
      const node = this.map.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      // 键不存在：创建新节点
      const newNode = new ListNode(key, value);
      this.map.set(key, newNode);
      this.addToHead(newNode);

      // 容量超限：删除尾节点
      if (this.map.size > this.capacity) {
        const tailKey = this.removeTail();
        this.map.delete(tailKey);
      }
    }
  }
}
*/