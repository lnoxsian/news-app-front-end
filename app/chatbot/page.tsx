'use client'

import { useState, useRef, useEffect } from 'react'
import { GlobeAltIcon, UserIcon, ComputerDesktopIcon, MapPinIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'image' | 'file'
  attachments?: string[]
}

interface NewsCategory {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const newsCategories: NewsCategory[] = [
    {
      id: 'world',
      label: 'World News',
      icon: <GlobeAltIcon className="w-5 h-5" />,
      description: 'International news and updates'
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: <UserIcon className="w-5 h-5" />,
      description: 'Latest sports news and scores'
    },
    {
      id: 'tech',
      label: 'Tech',
      icon: <ComputerDesktopIcon className="w-5 h-5" />,
      description: 'Technology and innovation news'
    },
    {
      id: 'local',
      label: 'Local',
      icon: <MapPinIcon className="w-5 h-5" />,
      description: 'Local news and events'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateBotResponse = (userMessage: string, categoryType?: string): string => {
    // Enhanced response simulation based on category type
    if (categoryType === 'world') {
      return "I'd be happy to share the latest world news! What specific region or international topic would you like to know about? I can provide updates on global politics, economics, conflicts, or other world events."
    }
    if (categoryType === 'sports') {
      return "Let me get you caught up on sports news! Are you interested in a particular sport or league? I can share recent scores, player updates, trade news, or upcoming games."
    }
    if (categoryType === 'tech') {
      return "Here's what's happening in the tech world! Would you like updates on specific companies, new product launches, AI developments, or other technology trends?"
    }
    if (categoryType === 'local') {
      return "I can help you with local news! While I don't have access to your specific location, I can discuss local news topics or help you find local news sources in your area."
    }
    
    // Simple keyword-based responses
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello there! Nice to meet you. What would you like to chat about?"
    }
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! You can ask me questions, have a conversation, or use the news categories to get the latest updates."
    }
    if (userMessage.toLowerCase().includes('weather')) {
      return "I don't have access to real-time weather data, but I'd be happy to chat about weather topics or help you find weather resources!"
    }
    
    const responses = [
      "That's an interesting question! Let me think about that.",
      "I understand what you're asking. Here's what I think...",
      "Thanks for your message! I'm here to help.",
      "That's a great point. Let me provide some information on that topic.",
      "I appreciate you reaching out. How else can I assist you?"
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleCategoryAction = (categoryId: string) => {
    setShowQuickActions(false)
    
    const category = newsCategories.find(c => c.id === categoryId)
    if (category) {
      const categoryMessage: Message = {
        id: Date.now(),
        text: `Show me ${category.label} updates`,
        sender: 'user',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, categoryMessage])
      setIsTyping(true)

      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: simulateBotResponse('', categoryId),
          sender: 'bot',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1500 + Math.random() * 2000)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() && selectedFiles.length === 0) return

    let messageText = inputText
    if (selectedFiles.length > 0) {
      const fileNames = selectedFiles.map(f => f.name).join(', ')
      messageText = inputText ? `${inputText}\n\nAttached files: ${fileNames}` : `Uploaded files: ${fileNames}`
    }

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: selectedFiles.length > 0 ? 'file' : 'text',
      attachments: selectedFiles.map(f => f.name)
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setSelectedFiles([])
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: simulateBotResponse(inputText, selectedFiles.length > 0 ? 'files' : undefined),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // 1-3 second delay
  }

  const handleTopicClick = (topic: string) => {
    const topicMessage: Message = {
      id: Date.now(),
      text: `Tell me about ${topic}`,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, topicMessage])
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: simulateBotResponse(`Tell me about ${topic}`, 'research'),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500 + Math.random() * 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            AI Chatbot
          </h1>
          <p className="text-gray-600 text-sm">
            Chat with our AI assistant. Ask questions, get help, or just have a conversation!
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.attachments.map((fileName, idx) => (
                        <span key={idx} className="text-xs bg-gray-700 text-gray-100 px-2 py-1 rounded">
                          📎 {fileName}
                        </span>
                      ))}
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-gray-300'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-2 rounded-lg max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    <XMarkIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="truncate max-w-32">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* News Categories Menu */}
            {showQuickActions && (
              <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {newsCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryAction(category.id)}
                      className="flex flex-col items-center p-4 text-center rounded-lg hover:bg-white transition-colors border border-gray-200 bg-white"
                    >
                      <div className="mb-2 text-gray-600">
                        {category.icon}
                      </div>
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {category.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {/* Quick Actions Toggle */}
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className={`p-2 rounded-lg transition-colors ${
                  showQuickActions 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="News categories"
              >
                {showQuickActions ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <PlusIcon className="w-5 h-5" />
                )}
              </button>

              {/* Message Input */}
              {/* Message Input */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900 min-h-[44px] max-h-32"
                rows={1}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={(!inputText.trim() && selectedFiles.length === 0) || isTyping}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line • Use + for news categories
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
        {/* News Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">News Categories</h2>
          <div className="space-y-2">
            <button 
              onClick={() => handleTopicClick('World News')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left flex items-center"
            >
              <GlobeAltIcon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-800 text-sm font-medium">World News</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Sports')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left flex items-center"
            >
              <UserIcon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-800 text-sm font-medium">Sports</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Technology')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left flex items-center"
            >
              <ComputerDesktopIcon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-800 text-sm font-medium">Tech</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Local News')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left flex items-center"
            >
              <MapPinIcon className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-800 text-sm font-medium">Local</span>
            </button>
          </div>
        </div>

        {/* Recent Headlines */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Headlines</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleTopicClick('Breaking: Major Tech Announcement')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <span className="text-gray-800 text-sm font-medium">Breaking: Major Tech Announcement</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Sports Championship Results')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <div className="text-gray-800 text-sm font-medium">Sports Championship</div>
              <div className="text-gray-800 text-sm font-medium">Results</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
