import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';

type tProps = {
  textContent: string;
};

export const ViewMarkdown = (props: tProps) => {
  const { textContent } = props;

  const handleCopy = () => {
    message.success('复制成功');
  };
  return (
    <ReactMarkdown
      children={textContent}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          const text = String(children).replace(/\n$/, '');
          return match ? ( // match 为 true 时，表示有代码块
            <div style={{ position: 'relative' }}>
              <SyntaxHighlighter // 代码高亮
                {...rest}
                PreTag="div"
                children={text}
                showLineNumbers={true}
                language={match[1]}
                style={vscDarkPlus}
              />
              <CopyToClipboard // 复制按钮
                text={text}
                onCopy={handleCopy}
              >
                <button style={{ background: '#ffffff' }}>复制</button>
              </CopyToClipboard>
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};
