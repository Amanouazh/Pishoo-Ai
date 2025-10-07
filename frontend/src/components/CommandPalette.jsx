import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  Plus,
  Settings,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Sidebar,
  Trash2,
  Copy,
  Home
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { toast } from 'sonner'

const CommandPalette = ({ 
  open, 
  onOpenChange, 
  onNewChat, 
  onToggleSidebar 
}) => {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('')
    }
  }, [open])

  const commands = [
    {
      group: 'Actions',
      items: [
        {
          icon: Plus,
          label: 'New Chat',
          shortcut: 'Ctrl+N',
          action: () => {
            onNewChat()
            onOpenChange(false)
            toast.success('New chat started')
          }
        },
        {
          icon: Sidebar,
          label: 'Toggle Sidebar',
          shortcut: 'Ctrl+B',
          action: () => {
            onToggleSidebar()
            onOpenChange(false)
          }
        },
        {
          icon: Download,
          label: 'Export Current Chat',
          action: () => {
            // This would need to be passed down from parent
            onOpenChange(false)
            toast.info('Select a chat to export')
          }
        },
        {
          icon: Upload,
          label: 'Import Chat',
          action: () => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.json'
            input.onchange = (e) => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  try {
                    const chatData = JSON.parse(event.target.result)
                    // This would need to be handled by parent
                    toast.success('Chat imported successfully')
                  } catch (error) {
                    toast.error('Failed to import chat')
                  }
                }
                reader.readAsText(file)
              }
            }
            input.click()
            onOpenChange(false)
          }
        }
      ]
    },
    {
      group: 'Navigation',
      items: [
        {
          icon: Home,
          label: 'Go to Home',
          action: () => {
            navigate('/')
            onOpenChange(false)
          }
        },
        {
          icon: Settings,
          label: 'Open Settings',
          shortcut: 'Ctrl+,',
          action: () => {
            navigate('/settings')
            onOpenChange(false)
          }
        }
      ]
    },
    {
      group: 'Theme',
      items: [
        {
          icon: Sun,
          label: 'Light Theme',
          action: () => {
            setTheme('light')
            onOpenChange(false)
            toast.success('Switched to light theme')
          }
        },
        {
          icon: Moon,
          label: 'Dark Theme',
          action: () => {
            setTheme('dark')
            onOpenChange(false)
            toast.success('Switched to dark theme')
          }
        },
        {
          icon: Monitor,
          label: 'System Theme',
          action: () => {
            setTheme('system')
            onOpenChange(false)
            toast.success('Using system theme')
          }
        }
      ]
    },
    {
      group: 'Quick Prompts',
      items: [
        {
          icon: Copy,
          label: 'Explain this concept',
          action: () => {
            onNewChat()
            onOpenChange(false)
            // Could pre-fill with prompt
          }
        },
        {
          icon: Copy,
          label: 'Write a summary',
          action: () => {
            onNewChat()
            onOpenChange(false)
          }
        },
        {
          icon: Copy,
          label: 'Help with coding',
          action: () => {
            onNewChat()
            onOpenChange(false)
          }
        },
        {
          icon: Copy,
          label: 'Brainstorm ideas',
          action: () => {
            onNewChat()
            onOpenChange(false)
          }
        }
      ]
    }
  ]

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.items.length > 0)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Type a command or search..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filteredCommands.map((group, groupIndex) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item, itemIndex) => (
                <CommandItem
                  key={`${group.group}-${itemIndex}`}
                  onSelect={item.action}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {item.shortcut}
                    </kbd>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {groupIndex < filteredCommands.length - 1 && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

export default CommandPalette
