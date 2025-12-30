import { useEffect, useRef, useState } from 'react';
import { convertBinToDocument, createEditorView } from '@/onlyoffice-comp/lib/x2t';
import { initializeOnlyOffice } from '@/onlyoffice-comp/lib/utils';
import { setDocmentObj, getDocmentObj, getOnlyOfficeLang } from '@/onlyoffice-comp/lib/document-state';
import { editorManager } from '@/onlyoffice-comp/lib/editor-manager';
import { ONLYOFFICE_EVENT_KEYS, FILE_TYPE, ONLYOFFICE_ID, ONLYOFFICE_CONTAINER_CONFIG } from '@/onlyoffice-comp/lib/const';
import { onlyofficeEventbus } from '@/onlyoffice-comp/lib/eventbus';
import { Spin, Button, Upload, message } from 'antd';
import { UploadOutlined, FileAddOutlined, SaveOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import styles from './index.module.less';

export interface OnlyOfficeProps {
  fileName?: string;
}

export const OnlyOffice: React.FC<OnlyOfficeProps> = ({ fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const initializedRef = useRef(false);
  const [force, forceUpdate] = useState(0);

  // 创建或打开文档
  const handleView = async (fileName: string, file?: File) => {
    setError(null);
    try {
      setDocmentObj({ fileName, file });
      // 确保环境已初始化
      await initializeOnlyOffice();
      
      const { fileName: currentFileName, file: currentFile } = getDocmentObj();
      // 传入 editorManager，让 createEditorInstance 内部处理销毁和重建
      await createEditorView({
        file: currentFile,
        fileName: currentFileName,
        isNew: !currentFile,
        readOnly: readOnly,
        lang: getOnlyOfficeLang(),
        containerId: ONLYOFFICE_ID,
        editorManager: editorManager,
      });
      
      // 强制更新UI，显示按钮
      forceUpdate((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      console.error('Document operation failed:', err);
    }
  };

  // 导出文档
  const handleExport = async () => {
    try {
      const binData = await editorManager.export();
      const result = await convertBinToDocument(binData.binData, binData.fileName, FILE_TYPE.DOCX, binData.media);
      
      // 下载文件
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = binData.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('文档导出成功');
    } catch (err) {
      console.error('导出失败:', err);
      message.error('导出失败');
    }
  };

  // 切换只读模式
  const toggleReadOnly = async () => {
    const newReadOnly = !readOnly;
    setReadOnly(newReadOnly);
    try {
      await editorManager.setReadOnly(newReadOnly);
      message.success(newReadOnly ? '已切换到只读模式' : '已切换到编辑模式');
    } catch (err) {
      setError('切换模式失败');
      console.error('Failed to toggle read-only mode:', err);
      message.error('切换模式失败');
    }
  };

  // 处理文件上传
  const handleFileChange = (file: UploadFile) => {
    if (file.originFileObj) {
      handleView(file.name, file.originFileObj as File);
    }
    return false; // 阻止默认上传行为
  };

  useEffect(() => {
    const init = async () => {
      try {
        // 统一初始化所有资源
        await initializeOnlyOffice();
        // 默认加载空 Word 文档
        if (!initializedRef.current && !editorManager.exists()) {
          initializedRef.current = true;
          await handleView('新建文档.docx');
        }
      } catch (err) {
        console.error('Failed to initialize OnlyOffice:', err);
        setError('无法加载编辑器组件');
      }
    };

    init();

    onlyofficeEventbus.on(ONLYOFFICE_EVENT_KEYS.DOCUMENT_READY, () => {
      forceUpdate((prev) => prev + 1);
    });

    // 监听 loading 状态变化
    const handleLoadingChange = (data: { loading: boolean }) => {
      setLoading(data.loading);
    };
    onlyofficeEventbus.on(ONLYOFFICE_EVENT_KEYS.LOADING_CHANGE, handleLoadingChange);

    return () => {
      onlyofficeEventbus.off(ONLYOFFICE_EVENT_KEYS.LOADING_CHANGE, handleLoadingChange);
      editorManager.destroy();
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* 工具栏 */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarContent}>
          <div className={styles.toolbarLeft}>
            <div className={styles.title}>文档编辑器</div>
          </div>

          <div className={styles.toolbarRight}>
            <Upload
              accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt"
              beforeUpload={handleFileChange}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>上传文档</Button>
            </Upload>
            
            <Button 
              icon={<FileAddOutlined />}
              onClick={() => handleView('新建文档.docx')}
            >
              新建 Word
            </Button>
            
            <Button 
              icon={<FileAddOutlined />}
              type="default"
              onClick={() => {
                message.info('请选择 docs 文件夹下的"xxxx井组批次排采方案模板.docx"文件', 3);
                templateInputRef.current?.click();
              }}
            >
              打开井组模板
            </Button>
            
            {editorManager.exists() && (
              <>
                <Button 
                  icon={<SaveOutlined />}
                  onClick={handleExport}
                  type="primary"
                >
                  导出
                </Button>
                <Button 
                  icon={readOnly ? <LockOutlined /> : <UnlockOutlined />}
                  onClick={toggleReadOnly}
                  type={readOnly ? 'default' : 'primary'}
                >
                  {readOnly ? '只读模式' : '编辑模式'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className={styles.error}>
          <p>错误：{error}</p>
        </div>
      )}

      {/* 编辑器容器 */}
      <div className={`${ONLYOFFICE_CONTAINER_CONFIG.PARENT_CLASS_NAME} ${styles.editorContainer}`}>
        <div 
          id={ONLYOFFICE_ID} 
          className={styles.editor}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>

      {/* 加载遮罩 */}
      {loading && (
        <div className={styles.loading}>
          <Spin size="large" tip="加载中..." />
        </div>
      )}
      
      {/* 隐藏的文件输入 - 上传文档 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleView(file.name, file);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        }}
      />
      
      {/* 隐藏的文件输入 - 打开模板 */}
      <input
        ref={templateInputRef}
        type="file"
        accept=".docx"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.name.includes('井组') || file.name.includes('模板')) {
              message.success(`已打开模板：${file.name}`);
            }
            handleView(file.name, file);
            if (templateInputRef.current) templateInputRef.current.value = '';
          }
        }}
      />
    </div>
  );
}

