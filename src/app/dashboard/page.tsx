'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import InboxList from '@/components/InboxList';
import MailView from '@/components/MailView';
import Composer from '@/components/Composer';
import SettingsModal from '@/components/SettingsModal';
import { Search, HelpCircle, Settings, Grid } from 'lucide-react';

export default function Dashboard() {
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
    const [selectedMail, setSelectedMail] = useState<any | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [replyTo, setReplyTo] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('inbox');
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMailLoading, setIsMailLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchInbox();
    }, [activeTab]);

    const fetchInbox = async (pageToken?: string) => {
        setIsLoading(true);
        try {
            const url = pageToken ? `/api/gmail/inbox?pageToken=${pageToken}` : '/api/gmail/inbox';
            const res = await fetch(url);
            if (res.status === 401) {
                window.location.href = '/'; // Redirect to landing page instead of direct login
                return;
            }
            const data = await res.json();
            setMessages(prev => pageToken ? [...prev, ...(data.messages || [])] : (data.messages || []));
            setNextPageToken(data.nextPageToken || null);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMail = async (id: string) => {
        setIsMailLoading(true);
        setSelectedMailId(id);
        try {
            const res = await fetch(`/api/gmail/read?id=${id}`);
            const data = await res.json();
            setSelectedMail(data);
        } catch (error) {
            console.error('Fetch mail error:', error);
        } finally {
            setIsMailLoading(false);
        }
    };

    const handleSend = async (data: any) => {
        const res = await fetch('/api/gmail/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to send');
        }
        fetchInbox();
    };

    const handleReply = (mail: any) => {
        setReplyTo({
            to: mail.from,
            subject: mail.subject,
            threadId: mail.threadId,
            messageId: mail.messageId,
        });
        setIsComposerOpen(true);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f6f8fc]">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-2 md:px-4 bg-[#f6f8fc] border-b border-transparent">
                <div className="flex items-center space-x-2 md:space-x-4 min-w-fit">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-secondary rounded-full cursor-pointer md:block"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-600"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
                    </button>
                    <div className="flex items-center space-x-2">
                        <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" alt="Gmail" className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-lg md:text-xl text-[#5f6368] font-medium hidden xs:block">Mail</span>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl mx-2 md:mx-4">
                    <div className="flex items-center bg-[#eaf1fb] px-3 py-2 md:px-4 md:py-3 rounded-full space-x-2 md:space-x-4 focus-within:bg-white focus-within:shadow-md transition-all">
                        <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search mail"
                            className="bg-transparent w-full outline-none text-sm text-gray-700"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-1 md:space-x-2">
                    <button className="p-2 hover:bg-secondary rounded-full hidden sm:block"><HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-600" /></button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 hover:bg-secondary rounded-full"
                    >
                        <Settings className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-full hidden sm:block"><Grid className="w-5 h-5 md:w-6 md:h-6 text-gray-600" /></button>
                    <div
                        onClick={() => {
                            if (confirm('Are you sure you want to sign out?')) {
                                window.location.href = '/api/auth/logout';
                            }
                        }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm md:text-base cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        U
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <div className={`
          absolute md:relative z-40 transition-all duration-300 ease-in-out h-full
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'}
        `}>
                    <Sidebar
                        onCompose={() => {
                            setReplyTo(null);
                            setIsComposerOpen(true);
                            if (windowWidth < 768) setIsSidebarOpen(false);
                        }}
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            if (windowWidth < 768) setIsSidebarOpen(false);
                        }}
                        isCollapsed={!isSidebarOpen && windowWidth >= 768 && windowWidth < 1024}
                    />
                </div>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 bg-white md:rounded-tl-2xl overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.1)] mx-0 md:mr-4 md:mb-4">
                    {selectedMailId && selectedMail ? (
                        <MailView
                            mail={selectedMail}
                            onBack={() => {
                                setSelectedMailId(null);
                                setSelectedMail(null);
                            }}
                            onReply={handleReply}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <InboxList
                                messages={messages}
                                onSelect={fetchMail}
                                isLoading={isLoading && messages.length === 0}
                            />
                            {nextPageToken && (
                                <div className="p-4 flex justify-center border-t border-border">
                                    <button
                                        onClick={() => fetchInbox(nextPageToken)}
                                        className="px-6 py-2 border border-gray-300 rounded-full hover:bg-secondary text-sm font-medium"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isMailLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}
                </main>
            </div>

            {isComposerOpen && (
                <Composer
                    onClose={() => setIsComposerOpen(false)}
                    onSend={handleSend}
                    replyTo={replyTo}
                />
            )}

            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
}
