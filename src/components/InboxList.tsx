import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface Message {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    date: string;
    isUnread: boolean;
}

interface InboxListProps {
    messages: Message[];
    onSelect: (id: string) => void;
    isLoading: boolean;
}

export default function InboxList({ messages, onSelect, isLoading }: InboxListProps) {
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        onClick={() => onSelect(msg.id)}
                        className={cn(
                            "flex items-center px-2 md:px-4 py-3 md:py-2 border-b border-border cursor-pointer hover:shadow-sm transition-shadow",
                            msg.isUnread ? "bg-white font-bold" : "bg-[#f2f6fc] font-normal"
                        )}
                    >
                        <div className="flex items-center space-x-2 md:space-x-4 w-1/3 md:w-1/4 truncate pr-2 md:pr-4">
                            <Star className="w-4 h-4 text-gray-400 flex-shrink-0 hidden xs:block" />
                            <span className="truncate text-xs md:text-sm">{msg.from?.split('<')[0] || 'Unknown'}</span>
                        </div>

                        <div className="flex-1 flex items-center min-w-0 pr-2 md:pr-4">
                            <span className="truncate text-xs md:text-sm mr-2">{msg.subject}</span>
                            <span className="truncate text-xs md:text-sm text-gray-500 font-normal hidden sm:inline">- {msg.snippet}</span>
                        </div>

                        <div className="w-16 md:w-24 text-right text-[10px] md:text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(msg.date), 'MMM d')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
