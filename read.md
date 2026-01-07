import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Radio,
  Space,
  type FormInstance,
  type FormItemProps,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { RangePicker } = DatePicker;

// 表单字段类型定义
export type FormFieldType = 'select' | 'input' | 'radio' | 'date' | 'dateRange' | 'custom';

// 表单单项配置接口
export interface FormItemConfig {
  /** 表单项标签 */
  label: React.ReactNode;
  /** 表单项名称 */
  name: string;
  /** 初始值 */
  initialValue?: any;
  /** 表单项类型 */
  type?: FormFieldType;
  /** 自定义渲染函数（当type为custom时使用） */
  render?: () => React.ReactNode;
  /** 表单项属性 */
  formItemProps?: FormItemProps;
  /** 输入组件属性 */
  componentProps?: Record<string, any>;
  /** 选择项选项（当type为select时使用） */
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
}

// 组件属性接口
export interface QueryFormProps {
  /** 表单项配置数组 */
  formItems: FormItemConfig[];
  /** 默认显示的表单项数量 */
  defaultVisibleCount?: number;
  /** 查询回调函数 */
  onSearch?: (values: Record<string, any>) => void;
  /** 重置回调函数 */
  onReset?: () => void;
  /** 表单实例引用 */
  formRef?: React.RefObject<FormInstance>;
  /** 是否显示展开/收起按钮 */
  showExpandToggle?: boolean;
  /** 自定义重置按钮文本 */
  resetText?: string;
  /** 自定义查询按钮文本 */
  searchText?: string;
  /** 表单布局 */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** 展开/收起回调 */
  onExpand?: (expanded: boolean) => void;
  /** 初始值 */
  initialValues?: Record<string, any>;

  componentProps?: Record<string, any>;
}

export const QueryForm: React.FC<QueryFormProps> = ({
  formItems,
  defaultVisibleCount = 3,
  onSearch,
  onReset,
  formRef,
  showExpandToggle = true,
  resetText = '重置',
  searchText = '查询',
  layout = 'inline',
  onExpand,
  initialValues = {},
  componentProps,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [form] = Form.useForm();
  const hasHiddenItems = formItems.length > defaultVisibleCount;
  const formItemWidth = 240;

  const formElRef = useRef<HTMLDivElement>(null); // 新增 ref

  // 同步外部formRef
  useEffect(() => {
    if (formRef && typeof formRef === 'object') {
      (formRef as React.MutableRefObject<FormInstance>).current = form;
    }
  }, [form, formRef]);

  // 计算可见项数
  const visibleCount = expanded ? formItems.length : defaultVisibleCount;

  // 渲染表单项组件
  const renderFormItem = (item: FormItemConfig) => {
    const { type = 'input', componentProps = {}, options = [] } = item;

    switch (type) {
      case 'input':
        return (
          <Input
            type="text"
            placeholder="请输入"
            allowClear
            style={{ width: formItemWidth }}
            {...componentProps}
          />
        );
      case 'select':
        return (
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            options={options}
            style={{ width: formItemWidth }}
            {...componentProps}
          />
        );
      case 'radio':
        return <Radio.Group options={options} style={{ width: formItemWidth }} {...componentProps} />;
      case 'date':
        return <DatePicker style={{ width: formItemWidth }} {...componentProps} />;
      case 'dateRange':
        return <RangePicker style={{ width: formItemWidth }} {...componentProps} />
      case 'custom':
        return item.render ? item.render() : null;
      default:
        return (
          <Input
            type="text"
            placeholder="请输入"
            allowClear
            style={{ width: formItemWidth }}
            {...componentProps}
          />
        );
    }
  };

  // 处理重置操作
  const handleReset = () => {
    onReset?.();
    setTimeout(() => {
      form.resetFields();
    }, 0);
  };
  // 处理查询操作
  const handleSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        onSearch?.(values);
      })
      .catch((error) => {
        console.error('表单验证失败:', error);
      });
  }, [form, onSearch]);

  // 在 Form 容器上添加键盘事件监听
  useEffect(() => {
    const formElement = formElRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 只在回车键且不在文本域中输入时触发查询
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
        // 排除多行文本输入的情况
        if (e.target.type !== 'textarea') {
          e.preventDefault();
          handleSearch();
        }
      }
    };

    if (formElement) {
      formElement.addEventListener('keydown', handleKeyDown as EventListener);
      return () => {
        formElement.removeEventListener('keydown', handleKeyDown as EventListener);
      };
    }
  }, [handleSearch]);

  // 处理展开/收起操作
  const toggleExpand = () => {
    setExpanded(!expanded);
    onExpand?.(!expanded);
  };

  return (
    <div ref={formElRef} className={`${styles.queryWrap} ${expanded ? styles.expandedForm : ''}`}>
      <Form
        form={form}
        layout={layout}
        className={styles.queryForm}
        autoComplete="off"
        initialValues={initialValues}
        {...componentProps}
      >
        <div className={`${styles.formItems}`}>
          {formItems.map((item, index) => (
            <Form.Item
              key={item.name || index.toString()}
              label={item.label}
              labelCol={{ flex: '120px' }}
              name={item.name}
              initialValue={item.initialValue}
              // 添加动态类名来控制显示/隐藏
              className={`
                ${item.formItemProps?.className || ''}
                ${index >= defaultVisibleCount && !expanded ? styles.hiddenItem : ''}
              `}
              {...item.formItemProps}
            >
              {renderFormItem(item)}
            </Form.Item>
          ))}
          <div className={styles.actionBar}>
            <Space>
              {showExpandToggle && hasHiddenItems && (
                <Button
                  type="link"
                  icon={expanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={toggleExpand}
                  className={styles.expandBtn}
                >
                  {expanded ? '收起' : '展开'}
                </Button>
              )}
              <Button onClick={handleReset} className={styles.resetBtn}>
                {resetText}
              </Button>
              <Button type="primary" onClick={handleSearch} className={styles.searchBtn}>
                {searchText}
              </Button>
            </Space>
          </div>
        </div>
      </Form>
    </div>
  );
};
