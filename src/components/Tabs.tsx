import React from 'react';
import { useEditor } from '../store/EditorContext';
import { X } from 'lucide-react';

export const Tabs: React.FC = () => {
  const { files, openTabs, activeTabId, setActiveTab, closeTab } = useEditor();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex bg-[var(--bg-secondary)] overflow-x-auto border-b border-[var(--border-color)] scrollbar-hide">
      {openTabs.map(tabId => {
        const file = files.find(f => f.id === tabId);
        if (!file) return null;
        
        const isActive = activeTabId === tabId;
        
        return (
          <div 
            key={tabId}
            className={`flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] border-r border-[var(--border-color)] cursor-pointer group ${
              isActive ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-t-2 border-t-[var(--accent-color)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
            onClick={() => setActiveTab(tabId)}
          >
            <span className="truncate flex-1 text-sm">{file.name}</span>
            <button 
              className={`p-0.5 rounded-md hover:bg-[var(--bg-tertiary)] ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tabId);
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
