import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Sparkles, 
  User, 
  Copy, 
  RotateCcw, 
  Download,
  Upload,
  Menu,
  Settings as SettingsIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import MessageBubble from './MessageBubble'
import WelcomeScreen from './WelcomeScreen'

const ChatInterface = ({ 
  chat, 
  onUpdateChat, 
  onNewChat, 
  sidebarOpen, 
  onToggleSidebar 
}) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash')
  const textareaRef = useRef(null)
  const scrollAreaRef = useRef(null)

  const models = [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Fast and efficient' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Most capable' },
    { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro', description: 'Reliable and stable' },
  ]

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current && chat?.messages) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [chat?.messages])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const apiKey = localStorage.getItem('gemini-api-key')
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings')
      return
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    // Create new chat if none exists
    let currentChat = chat
    if (!currentChat) {
      currentChat = {
        id: Date.now().toString(),
        title: message.trim().substring(0, 50) + (message.trim().length > 50 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
        model: selectedModel
      }
      onNewChat(currentChat)
    }

    // Add user message
    const updatedMessages = [...(currentChat.messages || []), userMessage]
    onUpdateChat(currentChat.id, { 
      messages: updatedMessages,
      model: selectedModel 
    })

    setMessage('')
    setIsLoading(true)

    try {
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message.trim()
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API')
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.candidates[0].content.parts[0].text,
        timestamp: new Date().toISOString()
      }

      // Add assistant message
      onUpdateChat(currentChat.id, { 
        messages: [...updatedMessages, assistantMessage] 
      })

    } catch (error) {
      console.error('Error calling Gemini API:', error)
      toast.error(`Failed to send message: ${error.message}`)
      
      // Remove the user message on error
      onUpdateChat(currentChat.id, { messages: currentChat.messages })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const exportChat = () => {
    if (!chat || !chat.messages.length) {
      toast.error('No chat to export')
      return
    }

    const chatData = {
      title: chat.title,
      model: chat.model,
      createdAt: chat.createdAt,
      messages: chat.messages
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pishoo-chat-${chat.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Chat exported successfully')
  }

  const importChat = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const chatData = JSON.parse(e.target.result)
        const importedChat = {
          id: Date.now().toString(),
          title: chatData.title || 'Imported Chat',
          messages: chatData.messages || [],
          createdAt: new Date().toISOString(),
          model: chatData.model || 'gemini-1.5-flash'
        }
        
        onNewChat(importedChat)
        toast.success('Chat imported successfully')
      } catch (error) {
        toast.error('Failed to import chat: Invalid file format')
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  if (!chat) {
    return (
      <WelcomeScreen 
        onNewChat={onNewChat}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground truncate max-w-md">
                {chat.title}
              </h2>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              {models.find(m => m.value === (chat.model || selectedModel))?.label}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex flex-col">
                      <span>{model.label}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" onClick={exportChat}>
              <Download className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <label htmlFor="import-chat" className="cursor-pointer">
                <Upload className="w-4 h-4" />
                <input
                  id="import-chat"
                  type="file"
                  accept=".json"
                  onChange={importChat}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {chat.messages?.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLast={index === chat.messages.length - 1}
              />
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
              </div>
              <Card className="flex-1 p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] max-h-[200px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              size="sm"
              className="absolute right-2 bottom-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>
              {chat.messages?.length || 0} messages
            </span>
            <span>
              Press Ctrl+K for command palette
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
