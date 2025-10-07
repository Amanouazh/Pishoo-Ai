import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { 
  Settings as SettingsIcon,
  Key,
  Palette,
  Info,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  Github,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [autoSave, setAutoSave] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key') || ''
    const savedFontSize = localStorage.getItem('pishoo-font-size') || 'medium'
    const savedAutoSave = localStorage.getItem('pishoo-auto-save') !== 'false'
    const savedSoundEnabled = localStorage.getItem('pishoo-sound-enabled') === 'true'

    setApiKey(savedApiKey)
    setFontSize(savedFontSize)
    setAutoSave(savedAutoSave)
    setSoundEnabled(savedSoundEnabled)
  }, [])

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim())
      toast.success('API key saved successfully')
    } else {
      localStorage.removeItem('gemini-api-key')
      toast.success('API key removed')
    }
  }

  const clearApiKey = () => {
    setApiKey('')
    localStorage.removeItem('gemini-api-key')
    toast.success('API key cleared')
  }

  const saveFontSize = (size) => {
    setFontSize(size)
    localStorage.setItem('pishoo-font-size', size)
    document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px'
    toast.success('Font size updated')
  }

  const saveAutoSave = (enabled) => {
    setAutoSave(enabled)
    localStorage.setItem('pishoo-auto-save', enabled.toString())
    toast.success(`Auto-save ${enabled ? 'enabled' : 'disabled'}`)
  }

  const saveSoundEnabled = (enabled) => {
    setSoundEnabled(enabled)
    localStorage.setItem('pishoo-sound-enabled', enabled.toString())
    toast.success(`Sound ${enabled ? 'enabled' : 'disabled'}`)
  }

  const exportSettings = () => {
    const settings = {
      fontSize,
      autoSave,
      soundEnabled,
      theme,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pishoo-settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Settings exported successfully')
  }

  const importSettings = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result)
        
        if (settings.fontSize) saveFontSize(settings.fontSize)
        if (typeof settings.autoSave === 'boolean') saveAutoSave(settings.autoSave)
        if (typeof settings.soundEnabled === 'boolean') saveSoundEnabled(settings.soundEnabled)
        if (settings.theme) setTheme(settings.theme)
        
        toast.success('Settings imported successfully')
      } catch (error) {
        toast.error('Failed to import settings: Invalid file format')
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This will remove all chats, settings, and API keys.')) {
      localStorage.clear()
      setApiKey('')
      setFontSize('medium')
      setAutoSave(true)
      setSoundEnabled(false)
      toast.success('All data cleared')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <SettingsIcon className="w-5 h-5 text-primary mr-2" />
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="keys" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            {/* API Keys Tab */}
            <TabsContent value="keys" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="w-5 h-5" />
                      <span>Gemini API Key</span>
                    </CardTitle>
                    <CardDescription>
                      Your API key is stored locally in your browser and never sent to our servers.
                      Get your free API key from{' '}
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        Google AI Studio
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Input
                            id="api-key"
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <Button onClick={saveApiKey}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={clearApiKey}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </div>

                    {apiKey && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✓ API key is configured and ready to use
                        </p>
                      </div>
                    )}

                    {!apiKey && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          ⚠ No API key configured. You won't be able to chat until you add one.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Theme Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="w-5 h-5" />
                      <span>Appearance</span>
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select value={fontSize} onValueChange={saveFontSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Behavior */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chat Behavior</CardTitle>
                    <CardDescription>
                      Configure how the chat interface behaves
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-save chats</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save chat history to local storage
                        </p>
                      </div>
                      <Switch
                        checked={autoSave}
                        onCheckedChange={saveAutoSave}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sound notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sounds for message notifications
                        </p>
                      </div>
                      <Switch
                        checked={soundEnabled}
                        onCheckedChange={saveSoundEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Export, import, or clear your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={exportSettings}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Settings
                      </Button>
                      
                      <Button variant="outline" asChild>
                        <label htmlFor="import-settings" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Settings
                          <input
                            id="import-settings"
                            type="file"
                            accept=".json"
                            onChange={importSettings}
                            className="hidden"
                          />
                        </label>
                      </Button>

                      <Button variant="destructive" onClick={clearAllData}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="w-5 h-5" />
                      <span>About Pishoo AI</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <SettingsIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Pishoo AI</h3>
                        <p className="text-muted-foreground">Version 1.0.0</p>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="secondary">React</Badge>
                          <Badge variant="secondary">Tailwind CSS</Badge>
                          <Badge variant="secondary">Gemini AI</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Chat with Google's Gemini AI models</li>
                        <li>• Privacy-first design with local storage</li>
                        <li>• Export and import chat history</li>
                        <li>• Dark and light theme support</li>
                        <li>• Responsive design for all devices</li>
                        <li>• Command palette for quick actions</li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Links</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Gemini AI
                          </a>
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-xs text-muted-foreground">
                      <p>
                        Built with ❤️ using React, Tailwind CSS, and Google's Gemini AI.
                        Your privacy is our priority - all data is stored locally in your browser.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Settings
