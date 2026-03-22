import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FileNode, getAllFiles, saveFile, deleteFile, generateId, getLanguageFromExtension } from '../utils/fileSystem';
import { get, set } from 'idb-keyval';

interface EditorState {
  files: FileNode[];
  openTabs: string[];
  activeTabId: string | null;
  theme: 'vs-dark' | 'light';
  sidebarOpen: boolean;
}

interface EditorContextType extends EditorState {
  createFile: (name: string) => Promise<void>;
  updateFileContent: (id: string, content: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  removeFile: (id: string) => Promise<void>;
  openFile: (id: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  importFile: (file: File) => Promise<void>;
  exportFile: (id: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadInitialState = async () => {
      const loadedFiles = await getAllFiles();
      setFiles(loadedFiles);

      const savedTabs = await get('openTabs');
      if (savedTabs) setOpenTabs(savedTabs);

      const savedActiveTab = await get('activeTabId');
      if (savedActiveTab && loadedFiles.find(f => f.id === savedActiveTab)) {
        setActiveTabId(savedActiveTab);
      } else if (savedTabs && savedTabs.length > 0) {
        setActiveTabId(savedTabs[0]);
      }

      const savedTheme = await get('theme');
      if (savedTheme) setTheme(savedTheme);
    };
    loadInitialState();
  }, []);

  useEffect(() => {
    set('openTabs', openTabs);
  }, [openTabs]);

  useEffect(() => {
    set('activeTabId', activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    set('theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const createFile = async (name: string) => {
    const newFile: FileNode = {
      id: generateId(),
      name,
      content: '',
      language: getLanguageFromExtension(name),
      lastModified: Date.now(),
    };
    await saveFile(newFile);
    setFiles(prev => [...prev, newFile].sort((a, b) => a.name.localeCompare(b.name)));
    openFile(newFile.id);
  };

  const updateFileContent = async (id: string, content: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      const updatedFile = { ...file, content, lastModified: Date.now() };
      await saveFile(updatedFile);
      setFiles(prev => prev.map(f => f.id === id ? updatedFile : f));
    }
  };

  const renameFile = async (id: string, newName: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      const updatedFile = { 
        ...file, 
        name: newName, 
        language: getLanguageFromExtension(newName),
        lastModified: Date.now() 
      };
      await saveFile(updatedFile);
      setFiles(prev => prev.map(f => f.id === id ? updatedFile : f).sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const removeFile = async (id: string) => {
    await deleteFile(id);
    setFiles(prev => prev.filter(f => f.id !== id));
    closeTab(id);
  };

  const openFile = (id: string) => {
    if (!openTabs.includes(id)) {
      setOpenTabs(prev => [...prev, id]);
    }
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tabId => tabId !== id);
      if (activeTabId === id) {
        setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
      }
      return newTabs;
    });
  };

  const setActiveTab = (id: string) => {
    setActiveTabId(id);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const importFile = async (file: File) => {
    const content = await file.text();
    const newFile: FileNode = {
      id: generateId(),
      name: file.name,
      content,
      language: getLanguageFromExtension(file.name),
      lastModified: Date.now(),
    };
    await saveFile(newFile);
    setFiles(prev => [...prev, newFile].sort((a, b) => a.name.localeCompare(b.name)));
    openFile(newFile.id);
  };

  const exportFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <EditorContext.Provider value={{
      files, openTabs, activeTabId, theme, sidebarOpen,
      createFile, updateFileContent, renameFile, removeFile,
      openFile, closeTab, setActiveTab, toggleTheme, toggleSidebar,
      importFile, exportFile
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
