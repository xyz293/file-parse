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
  组件内置加载态 + 防抖 / 防重复提交
  快速跳页输入超过总页数的数字
  页码为非数字 / 负数
///////

*/