import { Inbox, Send, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    onCompose: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed?: boolean;
}

export default function Sidebar({ onCompose, activeTab, setActiveTab, isCollapsed }: SidebarProps) {
    const tabs = [
        { id: 'inbox', label: 'Inbox', icon: Inbox },
        { id: 'sent', label: 'Sent', icon: Send },
        { id: 'drafts', label: 'Drafts', icon: FileText },
    ];

    return (
        <aside className={cn(
            "flex flex-col p-2 md:p-4 space-y-4 h-full bg-[#f6f8fc] md:bg-transparent transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <button
                onClick={onCompose}
                className={cn(
                    "flex items-center justify-center space-x-0 md:space-x-3 bg-[#c2e7ff] hover:shadow-md transition-all text-[#001d35] rounded-2xl font-medium",
                    isCollapsed ? "w-12 h-12 p-0" : "px-6 py-4 w-fit"
                )}
            >
                <Plus className="w-6 h-6" />
                {!isCollapsed && <span className="hidden md:inline">Compose</span>}
                <span className="md:hidden">Compose</span>
            </button>

            <nav className="flex flex-col space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center px-3 py-2 md:px-4 md:py-3 rounded-full text-sm font-medium transition-colors",
                            isCollapsed ? "justify-center w-12 h-12" : "space-x-4",
                            activeTab === tab.id
                                ? "bg-[#d3e3fd] text-[#041e49]"
                                : "text-[#202124] hover:bg-[#e1e3e1]"
                        )}
                        title={isCollapsed ? tab.label : ''}
                    >
                        <tab.icon className={cn("w-5 h-5 flex-shrink-0", activeTab === tab.id ? "fill-current" : "")} />
                        {!isCollapsed && <span className="hidden md:inline">{tab.label}</span>}
                        <span className="md:hidden">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}
