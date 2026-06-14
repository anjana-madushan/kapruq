import ReactMarkdown from 'react-markdown';
import type { Message } from '@/types/chat';
import ProductCarousel from '@/components/products/ProductCarousel';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  if (!message.content && message.role === 'assistant') return null;

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-emerald-600 text-white'
              : 'rounded-tl-sm bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                h1: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
                h2: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
                h3: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
                code: ({ children }) => <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-700">{children}</code>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {message.products && message.products.length > 0 && (
          <ProductCarousel products={message.products} />
        )}
        <span className="px-1 text-[10px] text-zinc-400">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
