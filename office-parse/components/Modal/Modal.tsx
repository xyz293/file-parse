import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Breakpoint, Button, Modal, Space } from 'antd';
import styles from './index.module.less';

export interface ModalProps {
  visible: boolean;
  title?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  destroyOnHidden?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  width?: string | number | Breakpoint;
  centered?: boolean;
  confirmLoading?: boolean;
  footer?: React.ReactNode | null;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
}

export const CommonModal: React.FC<ModalProps> = ({
  visible,
  title,
  content,
  children,
  destroyOnHidden,
  footer,
  onCancel,
  onOk,
  okText = '确定',
  cancelText = '取消',
  width,
  centered = true,
  confirmLoading = false,
  style,
  bodyStyle,
  footerStyle,
}) => {
  const footerStyles = {
    padding: '10px 24px',
    ...footerStyle,
  }


  const defaultFooter = () => {
    return (
      <div className={styles.default_footer}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button className={styles.defaultBtn} type="primary" onClick={onOk} loading={confirmLoading}>
            确定
          </Button>
        </Space>
      </div>
    )
  }
  return (

    <Modal
      open={visible}
      closeIcon={false}
      onCancel={onCancel}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      maskClosable={false}
      destroyOnHidden={destroyOnHidden}
      footer={null}
      width={width}
      centered={centered}
      confirmLoading={confirmLoading}
      style={style}
      styles={{
        footer: footerStyles,
      }}
      className={styles.customModal}
    >
      <div className={styles.modalHeader}>
        <span className={styles.title}>{title}</span>
        <CloseOutlined className={styles.close} onClick={onCancel} />
      </div>
      <div className={styles.modalBody} style={bodyStyle}>
        {content || children}
      </div>
      {footer !== null && <div className={styles.modalFooter}>
        {footer || defaultFooter()}
      </div>}
    </Modal>
  );
};


