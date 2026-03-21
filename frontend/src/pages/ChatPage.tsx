import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getMyChats, getMessages, sendMessage as apiSendMessage,
  Chat, Message, getCurrentUser, timeAgo,
} from '../services/authService';

export default function ChatPage() {
  const [params] = useSearchParams();
  const initialChatId = params.get('chatId');

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await getMyChats();
      setChats(res.data);
      if (initialChatId) {
        const chat = res.data.find((c) => c.id === parseInt(initialChatId));
        if (chat) selectChat(chat);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat: Chat) => {
    setActiveChat(chat);
    try {
      const res = await getMessages(chat.id);
      setMessages(res.data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;
    try {
      const res = await apiSendMessage(activeChat.id, newMessage.trim());
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.buyer.id === currentUser?.id ? chat.seller : chat.buyer;
  };

  if (loading) return <div className="main-content"><div className="spinner" /></div>;

  return (
    <div className="main-content">
      <div className="chat-layout">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>💬 Messages</h2>
          </div>
          {chats.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <p>No conversations yet</p>
            </div>
          ) : (
            chats.map((chat) => {
              const other = getOtherUser(chat);
              return (
                <div
                  key={chat.id}
                  className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => selectChat(chat)}
                  id={`chat-item-${chat.id}`}
                >
                  <div className="chat-item-avatar">{other.name.charAt(0)}</div>
                  <div className="chat-item-info">
                    <h4>{other.name}</h4>
                    <p>{chat.listing.title}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Main */}
        <div className="chat-main">
          {activeChat ? (
            <>
              <div className="chat-header">
                <h3>{getOtherUser(activeChat).name}</h3>
                <p>{activeChat.listing.title}</p>
              </div>

              <div className="chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender.id === currentUser?.id ? 'sent' : 'received'}`}
                  >
                    <div>{msg.content}</div>
                    <div className="message-time">{timeAgo(msg.timestamp)}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  id="chat-message-input"
                />
                <button className="btn btn-primary" onClick={handleSend} id="chat-send-btn">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <div className="icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a chat from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
