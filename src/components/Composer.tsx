'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, Minus, Maximize2, Send, X as CloseIcon } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css'; // Use react-quill-new for better support or regular react-quill
import { FOOTER_HTML } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ComposerProps {
    onClose: () => void;
    onSend: (data: { to: string; cc?: string; bcc?: string; subject: string; body: string; threadId?: string; messageId?: string }) => void;
    replyTo?: {
        to: string;
        subject: string;
        threadId: string;
        messageId: string;
    };
}

export default function Composer({ onClose, onSend, replyTo }: ComposerProps) {
    const [to, setTo] = useState<string[]>(replyTo?.to ? [replyTo.to] : []);
    const [cc, setCc] = useState<string[]>([]);
    const [bcc, setBcc] = useState<string[]>([]);
    const [toInput, setToInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [bccInput, setBccInput] = useState('');
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject.replace(/^Re: /, '')}` : '');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [customFooter, setCustomFooter] = useState(FOOTER_HTML);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.signature_html) {
                    setCustomFooter(data.signature_html);
                }
            } catch (error) {
                console.error('Failed to load signature for preview');
            }
        };
        fetchSettings();
    }, []);

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    const addEmail = (type: 'to' | 'cc' | 'bcc', value: string) => {
        const email = value.trim().replace(/,$/, '');
        if (!email) return;
        if (type === 'to') setTo(prev => [...new Set([...prev, email])]);
        if (type === 'cc') setCc(prev => [...new Set([...prev, email])]);
        if (type === 'bcc') setBcc(prev => [...new Set([...prev, email])]);
    };

    const removeEmail = (type: 'to' | 'cc' | 'bcc', email: string) => {
        if (type === 'to') setTo(prev => prev.filter(e => e !== email));
        if (type === 'cc') setCc(prev => prev.filter(e => e !== email));
        if (type === 'bcc') setBcc(prev => prev.filter(e => e !== email));
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'to' | 'cc' | 'bcc', value: string, setter: (v: string) => void) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            addEmail(type, value);
            setter('');
        } else if (e.key === 'Backspace' && !value) {
            const list = type === 'to' ? to : type === 'cc' ? cc : bcc;
            if (list.length > 0) {
                removeEmail(type, list[list.length - 1]);
            }
        }
    };

    const handleSend = async () => {
        setIsSending(true);
        try {
            // Add any remaining text in inputs as emails
            const finalTo = [...to]; if (toInput) finalTo.push(toInput);
            const finalCc = [...cc]; if (ccInput) finalCc.push(ccInput);
            const finalBcc = [...bcc]; if (bccInput) finalBcc.push(bccInput);

            await onSend({
                to: finalTo.join(', '),
                cc: finalCc.length > 0 ? finalCc.join(', ') : undefined,
                bcc: finalBcc.length > 0 ? finalBcc.join(', ') : undefined,
                subject,
                body,
                threadId: replyTo?.threadId,
                messageId: replyTo?.messageId
            });
            onClose();
        } catch (error) {
            alert('Failed to send email');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={cn(
            "fixed transition-all duration-300 bg-white shadow-2xl z-50 flex flex-col border border-border overflow-hidden",
            isMaximized
                ? "inset-4 md:inset-10 w-auto h-auto rounded-xl"
                : isMinimized
                    ? "bottom-0 right-4 md:right-24 w-[250px] md:w-[300px] h-12 rounded-t-xl"
                    : "bottom-0 w-full md:w-[600px] h-full md:h-[500px] md:right-24 md:rounded-t-xl"
        )}>
            <div
                className="bg-[#f2f6fc] px-4 py-3 md:py-2 flex items-center justify-between border-b border-border cursor-pointer"
                onClick={() => isMinimized && setIsMinimized(false)}
            >
                <span className="text-sm font-medium truncate">{replyTo ? 'Reply' : 'New Message'}</span>
                <div className="flex items-center space-x-1 md:space-x-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); setIsMaximized(false); }}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    {!isMinimized && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); setIsMinimized(false); }}
                            className="p-1 hover:bg-gray-200 rounded hidden md:block"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <X className="w-5 h-5 md:w-4 md:h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="relative flex flex-wrap items-center px-4 py-1 border-b border-border group gap-1 min-h-[44px]">
                        <span className="text-sm text-gray-500 mr-1">To</span>
                        {to.map(email => (
                            <div key={email} className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-xs gap-1 group/chip hover:border-gray-400 transition-all">
                                <span>{email}</span>
                                <button onClick={() => removeEmail('to', email)} className="hover:bg-gray-200 rounded-full p-0.5">
                                    <CloseIcon className="w-3 h-3 text-gray-500" />
                                </button>
                            </div>
                        ))}
                        <input
                            type="text"
                            value={toInput}
                            onChange={(e) => setToInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'to', toInput, setToInput)}
                            onBlur={() => { if (toInput) { addEmail('to', toInput); setToInput(''); } }}
                            className="flex-1 min-w-[120px] py-2 text-sm outline-none bg-transparent"
                            placeholder={to.length === 0 ? "Recipients" : ""}
                        />
                        {!showCcBcc && (
                            <div className="absolute right-4 flex items-center space-x-2 text-xs text-gray-400 transition-opacity">
                                <button onClick={() => setShowCcBcc(true)} className="hover:text-gray-700 font-medium p-1">Cc</button>
                                <button onClick={() => setShowCcBcc(true)} className="hover:text-gray-700 font-medium p-1">Bcc</button>
                            </div>
                        )}
                    </div>

                    {showCcBcc && (
                        <>
                            <div className="flex flex-wrap items-center px-4 py-1 border-b border-border gap-1 min-h-[40px]">
                                <span className="text-sm text-gray-500 mr-1">Cc</span>
                                {cc.map(email => (
                                    <div key={email} className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-xs gap-1 group/chip">
                                        <span>{email}</span>
                                        <button onClick={() => removeEmail('cc', email)} className="hover:bg-gray-200 rounded-full p-0.5">
                                            <CloseIcon className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={ccInput}
                                    onChange={(e) => setCcInput(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'cc', ccInput, setCcInput)}
                                    onBlur={() => { if (ccInput) { addEmail('cc', ccInput); setCcInput(''); } }}
                                    className="flex-1 min-w-[120px] py-1 text-sm outline-none bg-transparent"
                                />
                            </div>
                            <div className="flex flex-wrap items-center px-4 py-1 border-b border-border gap-1 min-h-[40px]">
                                <span className="text-sm text-gray-500 mr-1">Bcc</span>
                                {bcc.map(email => (
                                    <div key={email} className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-xs gap-1 group/chip">
                                        <span>{email}</span>
                                        <button onClick={() => removeEmail('bcc', email)} className="hover:bg-gray-200 rounded-full p-0.5">
                                            <CloseIcon className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={bccInput}
                                    onChange={(e) => setBccInput(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'bcc', bccInput, setBccInput)}
                                    onBlur={() => { if (bccInput) { addEmail('bcc', bccInput); setBccInput(''); } }}
                                    className="flex-1 min-w-[120px] py-1 text-sm outline-none bg-transparent"
                                />
                            </div>
                        </>
                    )}
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="px-4 py-2 border-b border-border text-sm outline-none"
                    />

                    <div className="flex-1 overflow-y-auto px-4 py-2">
                        <ReactQuill
                            theme="snow"
                            value={body}
                            onChange={setBody}
                            modules={modules}
                        />
                        <div
                            dangerouslySetInnerHTML={{ __html: customFooter }}
                        />
                    </div>

                    <div className="p-4 flex items-center justify-between border-t border-border bg-white">
                        <button
                            onClick={handleSend}
                            disabled={isSending || !to || !subject}
                            className="flex items-center space-x-2 bg-primary hover:bg-[#1967d2] disabled:bg-gray-300 text-white px-6 py-2 rounded-full font-medium transition-colors"
                        >
                            {isSending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span>Send</span>
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
