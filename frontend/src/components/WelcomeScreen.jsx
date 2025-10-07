import { motion } from 'framer-motion'
import { 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Shield, 
  Globe,
  Menu,
  Plus,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const WelcomeScreen = ({ onNewChat, sidebarOpen, onToggleSidebar }) => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Conversations',
      description: 'Chat naturally with Google\'s powerful Gemini AI models'
    },
    {
      icon: Zap,
      title: 'Multiple Models',
      description: 'Choose from Gemini 1.5 Flash, Pro, and 1.0 Pro based on your needs'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your API key is stored locally in your browser, never on our servers'
    },
    {
      icon: Globe,
      title: 'Export & Import',
      description: 'Save your conversations as JSON files and import them anytime'
    }
  ]

  const quickActions = [
    'Write a creative story',
    'Explain a complex topic',
    'Help with coding',
    'Brainstorm ideas',
    'Analyze data',
    'Create content'
  ]

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
              <h2 className="font-semibold text-foreground">Welcome to Pishoo AI</h2>
            </div>
          </div>

          <Link to="/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Chat with Gemini AI
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of Google's Gemini AI models in a beautiful, 
              privacy-focused interface. Start a conversation and explore the possibilities.
            </p>

            <Button
              onClick={onNewChat}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Chat
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Try asking me to...
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-accent"
                    onClick={() => {
                      onNewChat()
                      // You could also pre-fill the message here if needed
                    }}
                  >
                    <span className="text-sm">{action}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold text-foreground mb-3">
                Getting Started
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  1. Add your Gemini API key in{' '}
                  <Link to="/settings" className="text-primary hover:underline">
                    Settings
                  </Link>
                </p>
                <p>2. Start a new chat and begin your conversation</p>
                <p>3. Use Ctrl+K to open the command palette for quick actions</p>
                <p>4. Export your chats as JSON files to keep them safe</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
