import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, PrismTheme } from 'prism-react-renderer';
import { Check, Copy, ExternalLink } from 'lucide-react';

export interface MarkdownRendererProps {
  content: string;
}

/**
 * Custom Prism syntax-highlighting theme strictly adhering to the
 * TNNMC institutional palette (#2C7A7B crimson, #1B4E7B navy, #1E242B charcoal, #F8FAFC surface).
 */
const tnnmcPrismTheme: PrismTheme = {
  plain: {
    color: '#1E242B',
    backgroundColor: '#F8FAFC',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#64748B',
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#475569',
      },
    },
    {
      types: ['keyword', 'tag', 'boolean', 'important', 'atrule'],
      style: {
        color: '#2C7A7B',
        fontWeight: '600',
      },
    },
    {
      types: ['property', 'attr-name', 'constant', 'symbol', 'deleted'],
      style: {
        color: '#2C7A7B',
      },
    },
    {
      types: ['string', 'char', 'attr-value', 'regex', 'inserted'],
      style: {
        color: '#1B4E7B',
      },
    },
    {
      types: ['function', 'class-name', 'selector'],
      style: {
        color: '#1E242B',
        fontWeight: '600',
      },
    },
    {
      types: ['number', 'variable', 'builtin'],
      style: {
        color: '#7C2D12',
      },
    },
  ],
};

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission errors in restricted iframes
    }
  };

  const displayLang = language || 'text';

  return (
    <div className="my-3.5 rounded-[6px] border border-[#DCE1E7] bg-[#F8FAFC] overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="px-3.5 py-1.5 bg-[#F1F5F9] border-b border-[#DCE1E7] flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] font-mono">
          {displayLang}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code block"
          className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-[#475569] hover:text-[#2C7A7B] hover:bg-white rounded-[4px] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
              <span className="text-[#15803D]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <Highlight
        theme={tnnmcPrismTheme}
        code={code}
        language={displayLang.toLowerCase()}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-3.5 text-[13px] leading-6 overflow-x-auto font-mono m-0`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <div className="space-y-3 text-[15px] text-[#1E242B] leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[18px] font-semibold text-[#1E242B] pt-2 pb-0.5 leading-7 border-b border-[#E2E8F0]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[16px] font-semibold text-[#1E242B] pt-2 pb-0.5 leading-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold text-[#1E242B] pt-1.5 leading-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[14px] font-semibold text-[#334155] pt-1 leading-5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-[15px] text-[#1E242B] leading-7">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[#1E242B]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#334155]">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 pl-5 list-disc marker:text-[#2C7A7B] text-[15px] text-[#334155] leading-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 pl-5 list-decimal marker:text-[#2C7A7B] marker:font-semibold text-[15px] text-[#334155] leading-6">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1 leading-6">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="pl-3.5 py-1 border-l-[3px] border-[#2C7A7B] bg-[#F8FAFC] text-[#334155] text-[14px] rounded-r-[4px]">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[#2C7A7B] hover:text-[#235F5F] hover:underline underline-offset-4 transition-colors duration-150"
            >
              <span>{children}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawCode = String(children).replace(/\n$/, '');
            const isMultiline = rawCode.includes('\n') || Boolean(match);

            if (isMultiline) {
              return (
                <CodeBlock
                  language={match ? match[1] : 'text'}
                  code={rawCode}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 text-[13px] font-mono font-medium text-[#2C7A7B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-[4px]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
