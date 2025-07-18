import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockChatMessages, mockUsers } from '../data/mockData';
import { Send, Paperclip, MoreVertical, Circle, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Simulate online users
  useEffect(() => {
    const otherUsers = mockUsers.filter(u => u.id !== user.id);
    setOnlineUsers(otherUsers);
    if (otherUsers.length > 0) {
      setSelectedUser(otherUsers[0]);
    }
  }, [user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      const message = {
        id: Date.now(),
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate response after 2 seconds
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          senderId: selectedUser.id,
          senderName: selectedUser.name,
          senderRole: selectedUser.role,
          message: "Thanks for the message! I'll get back to you soon.",
          timestamp: new Date(),
          read: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const filteredMessages = messages.filter(msg => 
    (msg.senderId === user.id && selectedUser) || 
    (msg.senderId === selectedUser?.id && selectedUser)
  );

  const getLastMessage = (userId) => {
    const userMessages = messages.filter(msg => 
      msg.senderId === userId || (msg.senderId === user.id && userId)
    );
    return userMessages[userMessages.length - 1];
  };

  const getUnreadCount = (userId) => {
    return messages.filter(msg => 
      msg.senderId === userId && !msg.read
    ).length;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-600';
      case 'doctor': return 'text-blue-600';
      case 'secretary': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600">Communicate with your team</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {onlineUsers.map(u => {
                const lastMessage = getLastMessage(u.id);
                const unreadCount = getUnreadCount(u.id);
                
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedUser?.id === u.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{u.name}</h4>
                          {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs capitalize ${getRoleColor(u.role)}`}>
                          {u.role}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {lastMessage.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{selectedUser.name}</h3>
                        <div className="flex items-center">
                          <Circle size={8} className="text-green-500 fill-current mr-1" />
                          <span className="text-xs text-gray-500">Online</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {filteredMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === user.id ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Paperclip size={20} className="text-gray-500" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a team member to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;