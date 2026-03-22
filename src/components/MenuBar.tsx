import React, { useState } from 'react';
import { useEditor } from '../store/EditorContext';
import { Menu, X, Moon, Sun, FolderOpen, Save, FilePlus, Download } from 'lucide-react';

export const MenuBar: React.FC = () => {
  const { toggleSidebar, toggleTheme, theme, createFile, importFile, exportFile, activeTabId, sidebarOpen } = useEditor();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCreateFile = () => {
    const name = prompt('Enter file name (e.g., index.js):', 'untitled.txt');
    if (name) createFile(name);
    setMenuOpen(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e: any) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        Array.from(files).forEach(file => importFile(file as File));
      }
    };
    input.click();
    setMenuOpen(false);
  };

  const handleExport = () => {
    if (activeTabId) {
      exportFile(activeTabId);
    }
    setMenuOpen(false);
  };

  return (
    <div className="h-10 bg-[var(--bg-tertiary)] text-[var(--text-primary)] flex items-center justify-between px-3 shrink-0 select-none border-b border-[var(--border-color)]">
      <div className="flex items-center gap-4 h-full">
        <button 
          onClick={toggleSidebar} 
          className="hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        
        <div className="hidden md:flex items-center gap-1 h-full">
          <div className="relative group h-full flex items-center">
            <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">File</button>
            <div className="absolute top-full left-0 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg rounded-md py-1 min-w-[200px] hidden group-hover:block z-50">
              <button onClick={handleCreateFile} className="w-full text-left px-4 py-1.5 hover:bg-[var(--accent-color)] hover:text-white text-sm flex items-center gap-2">
                <FilePlus className="w-4 h-4" /> New File
              </button>
              <button onClick={handleImport} className="w-full text-left px-4 py-1.5 hover:bg-[var(--accent-color)] hover:text-white text-sm flex items-center gap-2">
                <FolderOpen className="w-4 h-4" /> Open File...
              </button>
              <div className="h-px bg-[var(--border-color)] my-1"></div>
              <button onClick={handleExport} disabled={!activeTabId} className="w-full text-left px-4 py-1.5 hover:bg-[var(--accent-color)] hover:text-white text-sm flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-transparent">
                <Download className="w-4 h-4" /> Download Active File
              </button>
            </div>
          </div>
          
          <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">Edit</button>
          <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">View</button>
          <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">Go</button>
          <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">Run</button>
          <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">Terminal</button>
          <button className="px-2 py-1 hover:bg-[var(--bg-secondary)] rounded text-sm h-full flex items-center">Help</button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium hidden sm:block">Code Editor PWA</span>
        <button 
          onClick={toggleTheme} 
          className="hover:bg-[var(--bg-secondary)] p-1.5 rounded transition-colors ml-4"
          title="Toggle Theme"
        >
          {theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
