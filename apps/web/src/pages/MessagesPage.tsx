import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';

export const MessagesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const { speak } = useVoice();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    searchParams.get('conversation')
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchConversations = async () => {
      try {
        const res = await api.getConversations();
        setConversations(res.data || []);
        if (res.data?.length > 0 && !selectedConvId) {
          setSelectedConvId(res.data[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch conversations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!selectedConvId) return;

    let isMounted = true;
    const fetchMessages = async () => {
      if (document.hidden) return;
      try {
        const res = await api.getMessages(selectedConvId);
        if (isMounted) {
          setMessages(res.data || []);
        }
      } catch (err) {
        console.warn('Failed to load messages', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;
    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);
    try {
      const res = await api.sendMessage(selectedConvId, textToSend);
      setMessages((prev) => [...prev, res.data]);
    } catch (err: any) {
      setInputText(textToSend);
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === selectedConvId);

  return (
    <main className="w-full bg-background min-h-[calc(100vh-220px)] pb-8">
      <div className="max-w-5xl mx-auto px-margin md:px-margin-tablet py-space-md h-[calc(100vh-200px)]">
        <div className="h-full flex bg-surface-container-lowest rounded-xl border border-surface-container shadow-md overflow-hidden">
          {/* Conversations Sidebar */}
          <div
            className={`w-full sm:w-80 border-r border-surface-container flex flex-col ${
              selectedConvId ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-surface-container bg-surface-container-low flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">
                Farmer Messages
              </h2>
              <span className="font-label-md text-label-md bg-secondary-container text-on-secondary-container font-bold px-2.5 py-0.5 rounded-full">
                {conversations.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-surface-container">
              {conversations.length > 0 ? (
                conversations.map((c) => {
                  const isSelected = c.id === selectedConvId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected ? 'bg-surface-container' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {c.otherParticipant?.name ? c.otherParticipant.name[0] : 'F'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                            {c.otherParticipant?.name}
                          </span>
                          {c.lastMessageAt && (
                            <span className="font-label-md text-label-md text-on-surface-variant text-[11px]">
                              {new Date(c.lastMessageAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        {c.listing && (
                          <p className="font-label-md text-label-md text-secondary truncate mt-0.5 font-semibold">
                            🚜 {c.listing.titleEn || c.listing.titleMr}
                          </p>
                        )}
                        <p className="font-body-md text-body-md text-on-surface-variant truncate mt-0.5 text-xs">
                          {c.lastMessage || 'New inquiry'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center font-body-md text-on-surface-variant text-sm">
                  No conversations yet.
                </div>
              )}
            </div>
          </div>

          {/* Active Conversation Chat Window */}
          <div
            className={`flex-1 flex flex-col bg-surface-container-low ${
              !selectedConvId ? 'hidden sm:flex items-center justify-center' : 'flex'
            }`}
          >
            {selectedConvId && activeConversation ? (
              <>
                {/* Header */}
                <div className="p-3.5 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConvId(null)}
                      className="sm:hidden p-1.5 rounded-lg text-on-surface hover:bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-sm">
                      {activeConversation.otherParticipant?.name
                        ? activeConversation.otherParticipant.name[0]
                        : 'F'}
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                        {activeConversation.otherParticipant?.name}
                      </h3>
                      {activeConversation.listing && (
                        <span className="font-label-md text-label-md text-secondary font-semibold block">
                          {activeConversation.listing.titleEn || activeConversation.listing.titleMr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] p-3.5 rounded-2xl font-body-md text-sm shadow-xs ${
                            isMe
                              ? 'bg-primary text-on-primary rounded-br-none'
                              : 'bg-surface-container-lowest text-on-surface border border-surface-container rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed">{m.text}</p>
                          <div
                            className={`font-label-md text-[10px] mt-1 text-right ${
                              isMe ? 'text-on-primary-container' : 'text-on-surface-variant'
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-surface-container-lowest border-t border-surface-container flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message to farmer..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-full bg-surface-container-low border border-outline-variant font-body-md focus:outline-none focus:border-primary text-sm"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary px-5 py-3 rounded-full font-label-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Send</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center font-body-md text-on-surface-variant p-8">
                <span className="material-symbols-outlined text-5xl text-outline mb-2">chat</span>
                <p>Select a farmer conversation from the list to view messages.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
