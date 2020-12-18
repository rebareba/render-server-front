import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {Table, Upload, message, Tag} from 'antd'
import {config} from '../../common/utils'
import {CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, CloseOutlined} from '@ant-design/icons'

const UPLOAD_STATUS = {
  uploading: 'uploading',
  done: 'done',
  error: 'error',
}

function Portal({children}: React.PropsWithChildren<any>) {
  return ReactDOM.createPortal(children, document.body)
}

type DeployProps = {
  rootPath: string
  onUpload?: (config: JSON) => void
}

export default function Deploy({children, rootPath, onUpload}: React.PropsWithChildren<DeployProps>) {
  const allFilsCount = useRef(-1)
  const [fileList, setFileList] = useState<any[]>([])
  const [renderKey, setRenderKey] = useState(1)

  useEffect(() => {
    const DONE_STATUS = 'done'
    const isAllDone = fileList.every((item) => item.status === DONE_STATUS)
    if (fileList.length === allFilsCount.current && isAllDone) {
      message.success('全部上传成功')
      allFilsCount.current = -1
      setRenderKey((key) => key + 1)
      checkRenderServerConfig(fileList)
    }

    function checkRenderServerConfig(fileList: any[]) {
      const RSC = 'render-server-config.json'
      const file = fileList.find((item) => item.name.endsWith(RSC))
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file.originFileObj, 'UTF-8')
        reader.onload = () => {
          const res = JSON.parse(reader.result as string)
          if (!file.name.startsWith(res.key)) {
            message.warn('render-server-config.json异常：key与资源前缀不一致')
            return
          }
          onUpload && onUpload(res)
        }
      }
    }
  }, [fileList, allFilsCount])

  return (
    <React.Fragment key={renderKey}>
      <Upload
        name="file"
        action={`${config.pathPrefix}/api/upload?path=${rootPath}`}
        directory={true}
        beforeUpload={(file, fileList) => {
          if (!file.webkitRelativePath.startsWith(rootPath) && rootPath !== 'init') {
            return Promise.reject()
          }
          allFilsCount.current = fileList.length
          return Promise.resolve()
        }}
        onChange={(info) => {
          setFileList(info.fileList)
        }}
        transformFile={(file) => {
          Object.defineProperties(file, {
            name: {
              value: file.webkitRelativePath,
            },
          })
          return file
        }}
        showUploadList={false}
      >
        {children}
      </Upload>
      {fileList.length > 0 && (
        <Portal>
          <div
            style={{
              position: 'fixed',
              zIndex: 1,
              right: 16,
              bottom: 0,
              width: 400,
              minHeight: 200,
              background: '#fff',
              boxShadow: '0 0 8px 1px #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            <div
              style={{padding: '4px 8px', background: '#62a3ff', color: '#fff', display: 'flex', alignItems: 'center'}}
            >
              <span style={{flex: 1}}>【{rootPath}】所有文件上传成功</span>
              <CloseOutlined
                onClick={() => {
                  setFileList([])
                  setRenderKey((key) => key + 1)
                }}
              />
            </div>
            <Table
              dataSource={fileList}
              rowKey="uid"
              scroll={{y: 500}}
              columns={[
                {
                  title: '文件名',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 100,
                  render: (text) => {
                    return {
                      [UPLOAD_STATUS.uploading]: (
                        <Tag icon={<SyncOutlined spin />} color="processing">
                          上传中
                        </Tag>
                      ),
                      [UPLOAD_STATUS.done]: (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          成功
                        </Tag>
                      ),
                      [UPLOAD_STATUS.error]: (
                        <Tag icon={<CloseCircleOutlined />} color="error">
                          失败
                        </Tag>
                      ),
                    }[text]
                  },
                },
              ]}
              size="small"
              pagination={false}
            />
          </div>
        </Portal>
      )}
    </React.Fragment>
  )
}
