import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ExternalLink, ChevronDown, ChevronUp, Shield, Zap } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: Array<{ name: string; type: string; verified: boolean }>;
  suggestions?: Array<{ label: string; action: string }>;
}

interface ChatMessageProps {
  message: Message;
  onSuggestedAction?: (action: string, label: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestedAction }) => {
  const [showSources, setShowSources] = useState(false);

  const handleSuggestionClick = (suggestion: { label: string; action: string }) => {
    if (onSuggestedAction) {
      onSuggestedAction(suggestion.action, suggestion.label);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.type === 'user' 
              ? 'bg-gray-600 order-2' 
              : 'bg-gradient-to-r from-blue-500 to-teal-500 order-1'
          }`}>
            {message.type === 'user' ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Sparkles className="h-4 w-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`flex-1 ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
            <div className={`rounded-2xl p-4 ${
              message.type === 'user'
                ? 'bg-blue-500/20 border border-blue-500/30 ml-auto max-w-lg'
                : 'bg-white/5 border border-white/10'
            }`}>
              <p className="text-white leading-relaxed whitespace-pre-line">{message.content}</p>
              
              {/* Timestamp */}
              <p className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {/* AI Sources and Actions */}
            {message.type === 'ai' && (message.sources || message.suggestions) && (
              <div className="mt-4 space-y-3">
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setShowSources(!showSources)}
                      className="w-full px-4 py-3 flex items-center justify-between text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Verified Data Sources ({message.sources.length})</span>
                      </div>
                      {showSources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    
                    {showSources && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  source.verified ? 'bg-green-400' : 'bg-yellow-400'
                                }`}></div>
                                <span className="text-sm text-white">{source.name}</span>
                                <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
                                  {source.type}
                                </span>
                              </div>
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Suggested Actions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Suggested Actions</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 hover:from-blue-500/30 hover:to-teal-500/30 text-sm text-blue-300 hover:text-white rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;