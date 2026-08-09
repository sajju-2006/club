import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, MessageCirclePlus } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const messagesEnd = useRef(null);
  const activeChatRef = useRef(null);

  const userId = user?.id || user?._id;

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    api.get('/messages/conversations').then((r) => setConversations(r.data));

    const s = io({ transports: ['websocket', 'polling'] });
    s.on('connect', () => s.emit('join', userId));
    s.on('newMessage', (msg) => {
      const chat = activeChatRef.current;
      const senderId = msg.sender._id || msg.sender;
      const receiverId = msg.receiver._id || msg.receiver;
      if (chat && (senderId === chat._id || receiverId === chat._id)) {
        setMessages((prev) => [...prev, msg]);
      }
      api.get('/messages/conversations').then((r) => setConversations(r.data));
    });
    return () => s.disconnect();
  }, [userId]);

  useEffect(() => {
    if (location.state?.startChat) {
      setActiveChat(location.state.startChat);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => {
    if (activeChat) {
      api.get(`/messages/${activeChat._id}`).then((r) => setMessages(r.data));
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (userQuery.length < 2) {
      setSearchUsers([]);
      return;
    }
    const timer = setTimeout(() => {
      api.get(`/search?q=${encodeURIComponent(userQuery)}`).then((r) => {
        setSearchUsers(r.data.people?.filter((p) => p._id !== userId) || []);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [userQuery, userId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChat) return;
    const { data } = await api.post('/messages', {
      receiverId: activeChat._id,
      content: newMsg,
    });
    setMessages((prev) => [...prev, data]);
    setNewMsg('');
    api.get('/messages/conversations').then((r) => setConversations(r.data));
  };

  const startChat = (person) => {
    setActiveChat(person);
    setShowNewChat(false);
    setUserQuery('');
    setSearchUsers([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-slate-500 text-sm">Chat with fellow students</p>
        </div>
        <button
          onClick={() => setShowNewChat(!showNewChat)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <MessageCirclePlus className="w-4 h-4" /> New Chat
        </button>
      </div>

      {showNewChat && (
        <div className="card p-4 mb-4">
          <input
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Search students by name..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none text-sm mb-2"
            autoFocus
          />
          {searchUsers.map((person) => (
            <button
              key={person._id}
              onClick={() => startChat(person)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left"
            >
              <img
                src={person.profilePic || `https://i.pravatar.cc/40?u=${person._id}`}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium text-sm">{person.fullName}</p>
                <p className="text-xs text-slate-400">{person.department}</p>
              </div>
            </button>
          ))}
          {userQuery.length >= 2 && searchUsers.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-2">No students found</p>
          )}
        </div>
      )}

      <div className="card overflow-hidden flex h-[calc(100vh-280px)] min-h-[400px]">
        <div className="w-80 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              <p>No conversations yet</p>
              <p className="mt-1">Click "New Chat" to start messaging</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.user._id}
                onClick={() => setActiveChat(conv.user)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left ${
                  activeChat?._id === conv.user._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <img
                  src={conv.user.profilePic || `https://i.pravatar.cc/40?u=${conv.user._id}`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{conv.user.fullName}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.lastMessage.content}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img
                  src={activeChat.profilePic || `https://i.pravatar.cc/40?u=${activeChat._id}`}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-semibold">{activeChat.fullName}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const senderId = msg.sender._id || msg.sender;
                  const isMine = senderId === userId;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-slate-700 rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEnd} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
                <button type="submit" className="btn-primary !p-2.5">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <p>Select a conversation or start a new chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
