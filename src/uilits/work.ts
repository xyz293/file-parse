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
  import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { init, EChartsType } from 'echarts/core';
import { EChartsOption } from 'echarts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  BrushComponent,
  ToolboxComponent,
  VisualMapComponent,
} from 'echarts/components';
import { LineChart, BarChart, PieChart, ScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DEFAULT_COLOR } from '@/config/color';
import { LabelLayout } from 'echarts/features';

// 按需注册
import * as echarts from 'echarts/core';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  ToolboxComponent,
  BrushComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  PieChart,
  LabelLayout,
  ScatterChart,
  VisualMapComponent,
]);

export interface EChartsRef {
  getInstance: () => EChartsType | null
  resize: () => void;
  dataZoom: () => void;
}

// 定义组件 Props 类型
export interface EChartsProps {
  option: EChartsOption; // 使用显式导入的类型
  style?: React.CSSProperties;
  className?: string;
  onEvents?: Record<string, (params: any) => void>;
  legendColor?: string[];
}

export const ECharts = forwardRef<EChartsRef, EChartsProps>(
  ({ option, style, className, onEvents, legendColor = DEFAULT_COLOR }, ref: ForwardedRef<EChartsRef>) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<EChartsType | null>(null);
    const currentEventsRef = useRef<Record<string, Function>>({});

    useImperativeHandle(ref, () => ({
      getInstance: () => chartInstance.current,
      resize: () => {
        chartInstance.current?.resize();
      },
      dataZoom: () => {
        chartInstance.current?.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'dataZoomSelect',
          dataZoomSelectActive: true,
        });
        chartInstance.current?.off('restore').on('restore', function () {
          // 1. 这里可以重新构建一个全新的 option
          // 2. 或者直接重置数据缩放等状态
          chartInstance.current?.setOption(option, { notMerge: true }); // 使用全新的配置对象
          // 如果需要，也可以重置数据缩放状态
          chartInstance.current?.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'dataZoomSelect',
            dataZoomSelectActive: true,
          });
        });
      },
    }));

    // 初始化图表实例
    useEffect(() => {
      if (chartRef.current) {
        chartInstance.current = init(chartRef.current);
        const resizeHandler = () => chartInstance.current?.resize();
        window.addEventListener('resize', resizeHandler);

        return () => {
          window.removeEventListener('resize', resizeHandler);
          chartInstance.current?.dispose();
          chartInstance.current = null;
        };
      }
    }, []);

    // 处理option更新
    useEffect(() => {
      if (chartInstance.current && option) {
        const finalOption = {
          color: legendColor,
          ...option
        };
        // 避免不必要的重新渲染
        chartInstance.current.setOption(finalOption, {
          replaceMerge: ['series', 'xAxis', 'yAxis', 'grid'], // 仅替换必要部分

        });
      }
    }, [option]);

    // 处理事件更新
    useEffect(() => {
      if (!chartInstance.current) return;

      // 解绑旧事件
      Object.entries(currentEventsRef.current).forEach(([eventName, handler]) => {
        chartInstance.current?.off(eventName, handler);
      });

      // 绑定新事件
      if (onEvents) {
        currentEventsRef.current = { ...onEvents };
        Object.entries(onEvents).forEach(([eventName, handler]) => {
          chartInstance.current?.on(eventName, handler);
        });
      } else {
        currentEventsRef.current = {};
      }

      // 清理函数 - 确保卸载时解绑事件
      return () => {
        Object.entries(currentEventsRef.current).forEach(([eventName, handler]) => {
          chartInstance.current?.off(eventName, handler);
        });
      };
    }, [onEvents]);

    return (
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '400px',
          ...style,
        }}
        className={className}
      ></div>
    );
  });

*/