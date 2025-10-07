import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import Settings from './components/Settings'
import CommandPalette from './components/CommandPalette'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [currentChat, setCurrentChat] = useState(null)
  const [chats, setChats] = useState([])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('pishoo-chats')
    if (savedChats) {
      setChats(JSON.parse(savedChats))
    }
  }, [])

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem('pishoo-chats', JSON.stringify(chats))
  }, [chats])

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      model: 'gemini-1.5-flash'
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChat(newChat)
  }

  const updateChat = (chatId, updates) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ))
    if (currentChat?.id === chatId) {
      setCurrentChat(prev => ({ ...prev, ...updates }))
    }
  }

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChat?.id === chatId) {
      setCurrentChat(null)
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar 
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            chats={chats}
            currentChat={currentChat}
            onChatSelect={setCurrentChat}
            onNewChat={createNewChat}
            onDeleteChat={deleteChat}
          />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ChatInterface 
                    chat={currentChat}
                    onUpdateChat={updateChat}
                    onNewChat={createNewChat}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  />
                } 
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <CommandPalette 
            open={commandPaletteOpen}
            onOpenChange={setCommandPaletteOpen}
            onNewChat={createNewChat}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
