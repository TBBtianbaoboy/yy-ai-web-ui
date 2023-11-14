import React, { useState } from 'react';
import { ReactNode } from 'react';
import { downloadAgentApi } from '@/services/download';

import { Button, notification } from 'antd';
import { ButtonProps } from 'antd';

import { extend } from 'umi-request';
import { LOGIN_TOKEN } from '@/utils/constant';

interface OptionsProps {
  loading: boolean;
}

interface FileProps {
  params?: object;
  children?: (options: OptionsProps) => ReactNode;
  style?: any;
  accept?: string;
  method?: string;
  callback?: () => void;
  title?: string;
  header?: object;
  onClick?: () => object;
  ButtonProps?: ButtonProps;
}

// const DownloadFile = (props: FileProps) => {
//     const {
//         children,
//         style = {},
//         callback = () => {},
//         title = '导出数据',
//         ButtonProps = {},
//     } = props;

const downFile = (blob: any, fileName: any) => {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    let link: any = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
    link = null;
  }
};

export const downloadTmpl = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  // const token = localStorage.getItem(LOGIN_TOKEN)

  const request = extend({
    credentials: 'include', // 默认请求是否带上cookie
    // headers:[["Authorization",`nas ${token}`]],
  });
  // if (loading) return;
  // setLoading(true);

  request(downloadAgentApi, {
    method: 'POST',
    responseType: 'blob',
    getResponse: true,
  }).then(({ data, response }) => {
    // 读取blob对象
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (data.type === 'application/json') {
        notification.error({
          message: '错误',
          description: fileReader.result,
        });
      } else {
        const contentDisposition = response.headers.get('content-disposition');
        let [fileName = ''] = contentDisposition?.split('=').slice(-1) || '';
        fileName = fileName.replace(`utf-8''`, '');
        const blob = new Blob([data]);
        downFile(blob, decodeURI(fileName));
      }
    };
    fileReader.readAsText(data);
  });
  // .then(() => callback())
  // .finally(() => {
  //     setLoading(false);
  // });
};

// return (
//     <div onClick={downloadTmpl} style={{display: 'inline-block', ...style}}>
//         {children ? (
//             children({loading})
//         ) : (
//             <Button loading={loading} {...ButtonProps}>
//                 {title}
//             </Button>
//         )}
//     </div>
// );
// };

// export default DownloadFile;
