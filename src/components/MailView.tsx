import { format } from 'date-fns';
import { ArrowLeft, Reply, Trash, MoreVertical } from 'lucide-react';

interface MailDetail {
    id: string;
    from: string;
    to: string;
    subject: string;
    date: string;
    body: string;
}

interface MailViewProps {
    mail: MailDetail;
    onBack: () => void;
    onReply: (mail: MailDetail) => void;
}

export default function MailView({ mail, onBack, onReply }: MailViewProps) {
    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="p-2 hover:bg-secondary rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-full">
                        <Trash className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">1 of many</span>
                    <button className="p-2 hover:bg-secondary rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
                <h1 className="text-xl md:text-2xl font-normal mb-6 md:mb-8">{mail.subject}</h1>

                <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
                    <div className="flex items-start space-x-3 md:space-x-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                            {mail.from[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                                <span className="font-bold text-sm truncate">{mail.from.split('<')[0]}</span>
                                <span className="text-[10px] md:text-xs text-gray-500 truncate mt-1 md:mt-0">&lt;{mail.from.match(/<(.+)>/)?.[1] || mail.from}&gt;</span>
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500">to {mail.to}</div>
                        </div>
                    </div>
                    <div className="flex items-center md:items-end flex-col w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-2 md:pt-0">
                        <div className="text-[10px] md:text-xs text-gray-500">
                            {format(new Date(mail.date), 'MMM d, yyyy, h:mm a')}
                        </div>
                        <div className="flex items-center justify-end mt-2 space-x-2">
                            <button
                                onClick={() => onReply(mail)}
                                className="p-1 px-3 md:px-1 hover:bg-secondary rounded border border-gray-300 md:border-none"
                            >
                                <Reply className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="mail-content text-sm leading-relaxed overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: mail.body }}
                />

                <div className="mt-12 pt-8 border-t border-border">
                    <button
                        onClick={() => onReply(mail)}
                        className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-secondary font-medium"
                    >
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
