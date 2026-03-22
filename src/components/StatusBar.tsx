import React from 'react';
import { useEditor } from '../store/EditorContext';
import { Code, Check, Settings, Bell } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { files, activeTabId } = useEditor();
  const activeFile = files.find(f => f.id === activeTabId);

  return (
    <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-2 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
          <Code className="w-3.5 h-3.5" />
          <span>master*</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
          <Check className="w-3.5 h-3.5" />
          <span>Prettier</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {activeFile && (
          <>
            <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
              Ln 1, Col 1
            </div>
            <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
              Spaces: 2
            </div>
            <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
              UTF-8
            </div>
            <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
              {activeFile.language}
            </div>
          </>
        )}
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
          <Settings className="w-3.5 h-3.5" />
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
          <Bell className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
