'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperClipIcon, AcademicCapIcon, PhotoIcon, LightBulbIcon, MagnifyingGlassIcon, EllipsisHorizontalIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'image' | 'file'
  attachments?: string[]
}

interface QuickAction {
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

  const quickActions: QuickAction[] = [
    {
      id: 'files',
      label: 'Add photos & files',
      icon: <PaperClipIcon className="w-5 h-5" />,
      description: 'Upload images or documents'
    },
    {
      id: 'study',
      label: 'Study and learn',
      icon: <AcademicCapIcon className="w-5 h-5" />,
      description: 'Get help with learning topics'
    },
    {
      id: 'image',
      label: 'Create image',
      icon: <PhotoIcon className="w-5 h-5" />,
      description: 'Generate images from text'
    },
    {
      id: 'think',
      label: 'Think longer',
      icon: <LightBulbIcon className="w-5 h-5" />,
      description: 'Deep analysis and reasoning'
    },
    {
      id: 'research',
      label: 'Deep research',
      icon: <MagnifyingGlassIcon className="w-5 h-5" />,
      description: 'Comprehensive research and analysis'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateBotResponse = (userMessage: string, actionType?: string): string => {
    // Enhanced response simulation based on action type
    if (actionType === 'study') {
      return "I'd be happy to help you learn! What specific topic would you like to study? I can break down complex concepts, provide explanations, create study guides, or help with practice questions."
    }
    if (actionType === 'image') {
      return "I understand you'd like to create an image. Please describe what you'd like me to generate - be as detailed as possible about the style, colors, composition, and subject matter."
    }
    if (actionType === 'think') {
      return "I'm engaging my deeper reasoning capabilities for this response. Let me think through this carefully and provide you with a thorough, well-analyzed answer..."
    }
    if (actionType === 'research') {
      return "I'm conducting comprehensive research on your topic. I'll analyze multiple perspectives, gather relevant information, and provide you with a detailed, well-sourced response."
    }
    if (actionType === 'files') {
      return "I can see you've uploaded files. Let me analyze the content and provide insights or answer questions about what you've shared."
    }
    
    // Simple keyword-based responses
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello there! Nice to meet you. What would you like to chat about?"
    }
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! You can ask me questions, have a conversation, or use the quick actions to get specialized assistance."
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

  const handleQuickAction = (actionId: string) => {
    setShowQuickActions(false)
    
    if (actionId === 'files') {
      fileInputRef.current?.click()
      return
    }

    const action = quickActions.find(a => a.id === actionId)
    if (action) {
      const actionMessage: Message = {
        id: Date.now(),
        text: `Using ${action.label}: ${action.description}`,
        sender: 'user',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, actionMessage])
      setIsTyping(true)

      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: simulateBotResponse('', actionId),
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
                    <PaperClipIcon className="w-4 h-4 mr-2 text-gray-500" />
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

            {/* Quick Actions Menu */}
            {showQuickActions && (
              <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="flex flex-col items-center p-4 text-center rounded-lg hover:bg-white transition-colors border border-gray-200 bg-white"
                    >
                      <div className="mb-2 text-gray-600">
                        {action.icon}
                      </div>
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {action.label}
                      </div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {action.description}
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
                title="Quick actions"
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
              Press Enter to send, Shift+Enter for new line • Use + for quick actions
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
        {/* Trending Topics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h2>
          <div className="space-y-2">
            <button 
              onClick={() => handleTopicClick('Elections')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <span className="text-gray-800 text-sm font-medium">Elections</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Climate Change')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <span className="text-gray-800 text-sm font-medium">Climate Change</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Tech Giants')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <span className="text-gray-800 text-sm font-medium">Tech Giants</span>
            </button>
          </div>
        </div>

        {/* Related Stories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Stories</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleTopicClick('Election Updates')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <span className="text-gray-800 text-sm font-medium">Election Updates</span>
            </button>
            <button 
              onClick={() => handleTopicClick('Climate Summit')}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow text-left"
            >
              <div className="text-gray-800 text-sm font-medium">Climate Summit</div>
              <div className="text-gray-800 text-sm font-medium">Announced</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
