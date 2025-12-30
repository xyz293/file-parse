import type {FileType,Parse} from '../type/parse.ts'

export class Baseparse<T=any> implements Parse<T>{
   async validate(content:Blob){
       try{
         const data =await content.text()
          if(!data){
              return ''
          }
          return data
       }
       catch{
        return ''
       }
   }
   async parse(content: string ,key:string){
       try{
             
         return null
            
          //一会会使用工厂模式去写解析过程
       }
       catch{
          return null
       }
   }
}
/*
import {Pagination, ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import {Flex} from 'antd';
import styles from './index.module.less';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void
}

export const CommonPagination: React.FC<PaginationProps> = ({page, pageSize, total, onChange}) => {
  return (
    <div className={styles.pageContainer}>
      <Flex justify={'space-between'} align={"center"}>
        <div>共{total}条</div>
        {total > 50 && <ConfigProvider locale={zhCN} theme={{
          token: {
            colorBorder: "#DDE0EE",
            colorText: "rgba(0, 0, 0, 0.65)",
          },
        }}>
            <Pagination
                className={styles.paginationStyle}
                total={total}
                current={page}
                pageSize={pageSize}
                pageSizeOptions={[50, 100]}
                showSizeChanger
                showQuickJumper
                onChange={(page, pageSize) => {
                  onChange(page, pageSize)
                }}
            />
        </ConfigProvider>}

      </Flex>
    </div>
  );
}



*/