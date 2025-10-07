import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Settings, 
  Plus, 
  MessageSquare, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Folder,
  Wrench
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const Sidebar = ({ 
  open, 
  onToggle, 
  chats, 
  currentChat, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat 
}) => {
  const location = useLocation()
  const [hoveredChat, setHoveredChat] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Folder, label: 'Projects', path: '/projects', disabled: true },
    { icon: Wrench, label: 'Tools', path: '/tools', disabled: true },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-70 bg-sidebar border-r border-sidebar-border flex flex-col h-full"
        >
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">Pishoo AI</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={onNewChat}
              className="w-full justify-start bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Navigation */}
          <div className="px-4 pb-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.disabled ? '#' : item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm transition-colors
                    ${item.disabled 
                      ? 'text-sidebar-foreground/50 cursor-not-allowed' 
                      : location.pathname === item.path
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }
                  `}
                  onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Chat History */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 pb-2">
              <h3 className="text-sm font-medium text-sidebar-foreground/70">Recent Chats</h3>
            </div>
            
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-1 pb-4">
                {chats.length === 0 ? (
                  <div className="text-center py-8 text-sidebar-foreground/50">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chats yet</p>
                    <p className="text-xs mt-1">Start a new conversation</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`
                        group relative flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors
                        ${currentChat?.id === chat.id
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }
                      `}
                      onClick={() => onChatSelect(chat)}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                    >
                      <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {truncateTitle(chat.title)}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60">
                          {formatDate(chat.createdAt)}
                        </p>
                      </div>
                      
                      {(hoveredChat === chat.id || currentChat?.id === chat.id) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-sidebar-foreground/60 hover:text-destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this chat? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteChat(chat.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </motion.aside>
      )}
      
      {/* Collapsed sidebar toggle */}
      {!open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed left-4 top-4 z-10"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
