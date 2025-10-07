import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Sparkles, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MessageBubble = ({ message, isLast }) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast.success('Message copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-3 group ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser 
          ? 'bg-secondary text-secondary-foreground' 
          : 'bg-primary text-primary-foreground'
        }
      `}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <Card className={`
          p-4 relative
          ${isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border'
          }
        `}>
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className={`
              absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto
              ${isUser 
                ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
            `}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>

          {/* Message Text */}
          <div className="pr-8">
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md !mt-2 !mb-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code 
                          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" 
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    pre({ children }) {
                      return <>{children}</>
                    },
                    p({ children }) {
                      return <p className="mb-2 last:mb-0">{children}</p>
                    },
                    ul({ children }) {
                      return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    },
                    ol({ children }) {
                      return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    },
                    li({ children }) {
                      return <li className="ml-2">{children}</li>
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic mb-2">
                          {children}
                        </blockquote>
                      )
                    },
                    h1({ children }) {
                      return <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                    },
                    h2({ children }) {
                      return <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                    },
                    h3({ children }) {
                      return <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto mb-2">
                          <table className="min-w-full border-collapse border border-muted-foreground/20">
                            {children}
                          </table>
                        </div>
                      )
                    },
                    th({ children }) {
                      return (
                        <th className="border border-muted-foreground/20 px-2 py-1 bg-muted font-semibold text-left">
                          {children}
                        </th>
                      )
                    },
                    td({ children }) {
                      return (
                        <td className="border border-muted-foreground/20 px-2 py-1">
                          {children}
                        </td>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </Card>

        {/* Timestamp */}
        <div className={`
          text-xs text-muted-foreground mt-1 px-1
          ${isUser ? 'text-right' : 'text-left'}
        `}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
