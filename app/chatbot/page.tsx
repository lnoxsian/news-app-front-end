'use client'

import { useState, useRef, useEffect } from 'react'
import { GlobeAltIcon, UserIcon, ComputerDesktopIcon, MapPinIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

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
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const headlines = [
    {
      id: 1,
      title: "Breaking: Major Tech Announcement",
      subtitle: "Revolutionary AI breakthrough changes everything",
      emoji: "🚨",
      category: "Technology",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Sports Championship Results",
      subtitle: "Unprecedented victory in international tournament",
      emoji: "🏆",
      category: "Sports",
      time: "4 hours ago"
    },
    {
      id: 3,
      title: "Climate Summit Updates",
      subtitle: "World leaders reach historic climate agreement",
      emoji: "🌍",
      category: "Environment",
      time: "6 hours ago"
    },
    {
      id: 4,
      title: "Election Results",
      subtitle: "Surprising outcomes reshape political landscape",
      emoji: "🗳️",
      category: "Politics",
      time: "8 hours ago"
    },
    {
      id: 5,
      title: "Market Updates",
      subtitle: "Stock markets hit record highs amid positive outlook",
      emoji: "📈",
      category: "Finance",
      time: "12 hours ago"
    }
  ]

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

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        // Move by 1 but ensure we don't go past the last group of 3
        return nextSlide >= headlines.length - 2 ? 0 : nextSlide;
      });
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [headlines.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const nextSlide = prev + 1;
      return nextSlide >= headlines.length - 2 ? 0 : nextSlide;
    });
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const prevSlideIndex = prev - 1;
      return prevSlideIndex < 0 ? Math.max(0, headlines.length - 3) : prevSlideIndex;
    });
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, headlines.length - 3))
  }

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-screen flex bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-8 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Chatbot
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Chat with our AI assistant. Ask questions, get help, or just have a conversation!
          </p>
        </div>

        {/* Recent Headlines Carousel */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 py-8">
          <div className="px-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 text-center">Recent Headlines</h3>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * (100/3)}%)` }}
              >
                {headlines.map((headline, index) => (
                  <div key={headline.id} className="w-1/3 flex-shrink-0 px-2">
                    <button 
                      onClick={() => handleTopicClick(headline.title)}
                      className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-left border border-gray-200 hover:border-gray-300 h-full"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{headline.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block px-2 py-1 bg-black text-white text-xs font-medium rounded-full">
                              {headline.category}
                            </span>
                            <span className="text-xs text-gray-500">{headline.time}</span>
                          </div>
                          <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
                            {headline.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {headline.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.max(1, headlines.length - 2) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
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

            {/* News Categories - Always Visible */}
            <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {newsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryAction(category.id)}
                    className="flex flex-col items-center p-3 text-center rounded-lg hover:bg-white hover:shadow-sm transition-all border border-gray-200 bg-white"
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

            <div className="flex space-x-2">
              {/* Message Input */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or click a news category above! 💬"
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
              Press Enter to send, Shift+Enter for new line • Click category buttons above to get news updates
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
