'use client';

import { useState, useEffect } from 'react';
import { X, Save, CheckCircle, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { FOOTER_HTML } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const [senderName, setSenderName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [signature, setSignature] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isHtmlMode, setIsHtmlMode] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings', { cache: 'no-store' });
            const data = await res.json();
            if (data) {
                setUserEmail(data.email || '');
                setSenderName(data.sender_name || '');
                setSignature(data.signature_html || FOOTER_HTML);
            }
        } catch (error) {
            console.error('Failed to fetch settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender_name: senderName, signature_html: signature }),
            });
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-medium">Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Display Name (Sender Name)</label>
                                    <input
                                        type="text"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        placeholder="e.g. Ibrar - Espdk"
                                        className="w-full px-4 py-3 bg-[#f1f3f4] border-transparent focus:bg-white focus:border-primary border-2 rounded-xl outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Account Email (Static)</label>
                                    <input
                                        type="text"
                                        value={userEmail}
                                        readOnly
                                        className="w-full px-4 py-3 bg-gray-100 border-transparent border-2 rounded-xl text-gray-500 text-sm cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Default HTML Code (RAW MODE)</label>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to reset to the default HTML code?')) {
                                                setSignature(FOOTER_HTML);
                                            }
                                        }}
                                        className="flex items-center text-xs text-primary hover:underline"
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Reset to Default
                                    </button>
                                </div>

                                <div className="border border-border rounded-xl overflow-hidden min-h-[400px] flex flex-col bg-white">
                                    <textarea
                                        value={signature}
                                        onChange={(e) => setSignature(e.target.value)}
                                        className="w-full flex-1 p-4 font-mono text-sm outline-none bg-gray-900 text-gray-100 resize-none"
                                        placeholder="Paste your HTML here (e.g. <div>...</div>)"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    <strong>Byte-for-byte:</strong> Whatever you paste here will be rendered exactly as-is in the composer and outgoing emails. No auto-formatting, no tables, no cleanup.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className="px-6 py-4 bg-[#f8f9fa] border-t border-border flex items-center justify-between">
                    <div className="flex items-center text-green-600 text-sm font-medium transition-opacity duration-300" style={{ opacity: showSuccess ? 1 : 0 }}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Settings saved successfully!
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 bg-primary hover:bg-[#1967d2] disabled:bg-gray-400 text-white px-8 py-2 rounded-full font-medium transition-all shadow-md active:scale-95"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
