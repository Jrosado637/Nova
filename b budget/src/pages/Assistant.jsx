
import React, { useState, useRef, useEffect } from "react";
import { InvokeLLM } from "@/api/integrations";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User as UserIcon, Crown, Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your personal financial advisor assistant. I can help you with general budgeting advice, saving strategies, and financial education. Please note that I'm not a licensed financial advisor and my suggestions are for educational purposes only - always consult with a qualified professional for personalized financial advice. What would you like to discuss today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [hasPremium, setHasPremium] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUser();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      // In a real app, you'd check if user has premium subscription
      setHasPremium(userData.subscription === "premium");
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!hasPremium) {
      // Show premium required message
      setMessages(prev => [...prev, 
        {
          role: "user",
          content: input,
          timestamp: new Date()
        },
        {
          role: "assistant", 
          content: "I'd love to help you with that! The Financial Assistant is a premium feature that costs $2.99/month. With premium access, you'll get general financial education, budgeting tips, and saving strategies. Please remember that I'm not a licensed financial advisor - my suggestions are for educational purposes only.",
          timestamp: new Date(),
          isPremiumRequired: true
        }
      ]);
      setInput("");
      return;
    }

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await InvokeLLM({
        prompt: `You are a helpful, supportive financial education assistant for people who struggle with budgeting and money management. 

        IMPORTANT DISCLAIMERS YOU MUST ALWAYS FOLLOW:
        - You are NOT a licensed financial advisor, accountant, or investment professional
        - Your advice is for EDUCATIONAL PURPOSES ONLY
        - Always remind users to consult with qualified financial professionals for personalized advice
        - Do not provide specific investment recommendations or tax advice
        - Focus on general budgeting tips, saving strategies, and financial literacy education
        
        Be encouraging, understanding, and practical in your educational content. Use simple language and break down complex concepts. 
        
        Always be empathetic - remember this person might have anxiety or stress about money.
        
        User question: ${userMessage}
        
        Provide helpful, educational information that's encouraging and supportive, while maintaining appropriate disclaimers.`,
        add_context_from_internet: false
      });

      // Add disclaimer to response
      const responseWithDisclaimer = response + "\n\n*Please remember: This is general educational information only. I'm not a licensed financial advisor. For personalized financial advice, please consult with a qualified professional.*";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: responseWithDisclaimer,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    }

    setIsLoading(false);
  };

  const handleUpgrade = async () => {
    // In a real app, this would redirect to payment processor
    alert("Upgrade functionality would redirect to payment processor");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="p-6 border-b border-white/10 dark:border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Assistant</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Feature
                </Badge>
                {hasPremium && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {!hasPremium && (
            <Button 
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade - $2.99/mo
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <Card className={`max-w-md ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' 
                  : message.isPremiumRequired
                    ? 'glass-card border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20'
                    : 'glass-card'
              }`}>
                <CardContent className="p-4">
                  {message.isPremiumRequired && (
                    <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Premium Required</span>
                    </div>
                  )}
                  <p className={`${
                    message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {message.content}
                  </p>
                  {message.isPremiumRequired && (
                    <Button 
                      onClick={handleUpgrade}
                      className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Get Premium Access
                    </Button>
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </CardContent>
              </Card>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10 dark:border-gray-700/30">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasPremium ? "Ask me anything about your finances..." : "Upgrade to premium to chat with the assistant..."}
            disabled={isLoading}
            className="flex-1 dark:bg-gray-800/50"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {!hasPremium && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Get general financial education and budgeting tips for just $2.99/month
          </p>
        )}
      </div>
    </div>
  );
}
