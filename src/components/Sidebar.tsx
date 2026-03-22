import React, { useState, useRef } from 'react';
import { useEditor } from '../store/EditorContext';
import { FileCode, FileJson, FileText, FileType2, File as FileIcon, Trash2, Edit2, Download, Plus, Upload } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { files, activeTabId, openFile, removeFile, renameFile, createFile, importFile, exportFile, sidebarOpen, toggleSidebar } = useEditor();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="w-4 h-4 text-yellow-400" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-green-400" />;
      case 'html':
      case 'htm':
        return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'css':
        return <FileType2 className="w-4 h-4 text-blue-400" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-300" />;
      default:
        return <FileIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (editName.trim()) {
      renameFile(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleCreateFile = () => {
    const name = prompt('Enter file name (e.g., index.js):', 'untitled.txt');
    if (name) {
      createFile(name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => importFile(file));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenFile = (id: string) => {
    openFile(id);
    if (window.innerWidth < 640) {
      toggleSidebar();
    }
  };

  return (
    <div className={`w-full sm:w-64 bg-[var(--bg-secondary)] text-[var(--text-primary)] flex flex-col h-full border-r border-[var(--border-color)] shrink-0 absolute sm:relative z-10 ${sidebarOpen ? 'flex' : 'hidden'}`}>
      <div className="p-3 text-xs font-semibold tracking-wider uppercase flex justify-between items-center group">
        <span>Explorer</span>
        <div className="flex gap-2">
          <button onClick={handleCreateFile} title="New File" className="hover:text-[var(--accent-color)]">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => fileInputRef.current?.click()} title="Upload File" className="hover:text-[var(--accent-color)]">
            <Upload className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={handleFileUpload} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {files.map(file => (
          <div 
            key={file.id}
            className={`group flex items-center px-3 py-1 cursor-pointer hover:bg-[var(--bg-tertiary)] ${activeTabId === file.id ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : ''}`}
            onClick={() => handleOpenFile(file.id)}
          >
            <div className="mr-2">{getIcon(file.name)}</div>
            
            {editingId === file.id ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRenameSubmit(file.id)}
                onKeyDown={(e) => handleKeyDown(e, file.id)}
                className="bg-[var(--bg-primary)] text-[var(--text-primary)] px-1 outline-none border border-[var(--accent-color)] w-full text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate flex-1 text-sm">{file.name}</span>
            )}
            
            <div className="hidden group-hover:flex items-center gap-1 ml-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditName(file.name);
                  setEditingId(file.id);
                }}
                className="hover:text-[var(--accent-color)]"
                title="Rename"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  exportFile(file.id);
                }}
                className="hover:text-[var(--accent-color)]"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete '${file.name}'?`)) {
                    removeFile(file.id);
                  }
                }}
                className="hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <div className="p-4 text-center text-sm text-[var(--text-secondary)]">
            No files found.<br/>
            <button onClick={handleCreateFile} className="text-[var(--accent-color)] hover:underline mt-2">Create one</button> or <button onClick={() => fileInputRef.current?.click()} className="text-[var(--accent-color)] hover:underline">upload</button>.
          </div>
        )}
      </div>
    </div>
  );
};
