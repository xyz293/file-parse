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

import {ConfigProvider, Flex, Spin, Splitter, Tree, TreeProps} from "antd";
import {useRef} from "react";
import styles from "./index.module.less";
import openImg from "@/asset/opened.svg";
import closeImg from "@/asset/closed.svg";
import {DataNode} from 'antd/es/tree';
import {TreeProps as AntTreeProps} from 'antd';

export interface SplitterTreeProps {
  treeData: DataNode[], // tree 源数据
  rightContent: React.ReactNode | string | null, // 右侧内容
  leftHeader?: React.ReactNode | null, // 左侧header
  leftFooter?: React.ReactNode | null, // 左侧footer
  treeTitleRender?: (nodeData: DataNode) => React.ReactNode; // tree 节点的title渲染
  treeProps?: AntTreeProps; // tree 其他配置参数
  treeCheckable?: boolean; // tree 是否可勾选
  onTreeSelect?: TreeProps['onSelect']; // tree 节点被选中
  onTreeClick?: (e: React.MouseEvent) => void; // tree 节点被点击
  onTreeExpand?: TreeProps['onExpand']; // tree 节点展开
  onTreeLoadData?: TreeProps['loadData']; // tree 节点加载数据
  onTreeCheck?: TreeProps['onCheck']; // tree 节点被勾选
  leftPanelProps?: {
    defaultSize?: number | string;
    min?: number | string;
    max?: number | string;
  }; // 左侧panel的配置（splitter的左侧宽度）
  treeLoading?: boolean; // tree 加载状态
  treeContainerStyle?: React.CSSProperties; // tree 容器样式
  contentStyle?: React.CSSProperties; // 右侧内容样式（style）
  contentClassName?: string; // 右侧内容样式（classname）
}

export const SplitterTree = (props: SplitterTreeProps) => {

  const {
    treeData, leftHeader, leftFooter, onTreeExpand, onTreeSelect, onTreeClick, treeTitleRender, treeProps,
    treeCheckable, onTreeCheck, rightContent, treeContainerStyle, contentStyle, contentClassName, onTreeLoadData,
    treeLoading = false,
    leftPanelProps = {
      defaultSize: 270,
      min: "10%",
      max: "70%"
    }
  } = props;

  // 控制分割线显示和隐藏
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const splitterMouseEvent = (e: React.MouseEvent) => {

    if (splitContainerRef.current) {
      const splitterBar = splitContainerRef.current?.querySelector('.ant-splitter-bar');
      if (splitterBar) {
        (splitterBar as HTMLElement).style.opacity = e.type === 'mouseenter' ? "1" : "0";
      }
    }
  };

  return <div className={styles.splitterTreeContainer} ref={splitContainerRef}>
    <Splitter>
      <Splitter.Panel defaultSize={leftPanelProps.defaultSize}
                      min={leftPanelProps.min}
                      max={leftPanelProps.max}>
        <div className={styles.leftContainer}
             onMouseEnter={splitterMouseEvent}
             onMouseLeave={splitterMouseEvent}>
          <Flex vertical flex={1}>
            <div>
              {leftHeader && <div>{leftHeader}</div>}
              <Spin spinning={treeLoading}>
                <div className={styles.treeContainer}
                     style={{...treeContainerStyle}}
                     id={"treeContainer"}>
                  <ConfigProvider
                    theme={{
                      components: {
                        Tree: {
                          indentSize: 12,
                          nodeSelectedBg: "rgba(64, 158, 255, 0.10)",
                          titleHeight: 26
                        },
                      },
                    }}
                  >
                    <Tree
                      showIcon
                      blockNode
                      switcherIcon={(value) => {
                        if (value.expanded) {
                          return <img style={{paddingTop: 3}} src={openImg} alt={"close"}/>
                        }
                        return <img style={{paddingTop: 3}} src={closeImg} alt={"open"}/>
                      }}
                      treeData={treeData}
                      titleRender={treeTitleRender}
                      loadData={onTreeLoadData}
                      checkable={treeCheckable}
                      onCheck={onTreeCheck}
                      onSelect={onTreeSelect}
                      onClick={onTreeClick}
                      onExpand={onTreeExpand}
                      {...treeProps}
                    />
                  </ConfigProvider>
                </div>
              </Spin>
            </div>

            {leftFooter && <div className={styles.leftFooter}>{leftFooter}</div>}
          </Flex>
        </div>
      </Splitter.Panel>

      <Splitter.Panel>
        <div className={`${styles.rightContainer} ${contentClassName}`}
             style={{...contentStyle}}>
          {rightContent}
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>

}


*/