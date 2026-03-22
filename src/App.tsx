import React from 'react';
import { EditorProvider } from './store/EditorContext';
import { MenuBar } from './components/MenuBar';
import { Sidebar } from './components/Sidebar';
import { Tabs } from './components/Tabs';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';

export default function App() {
  return (
    <EditorProvider>
      <div className="flex flex-col h-screen w-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden">
        <MenuBar />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          
          <div className="flex flex-col flex-1 overflow-hidden bg-[var(--bg-primary)]">
            <Tabs />
            <Editor />
          </div>
        </div>
        
        <StatusBar />
      </div>
    </EditorProvider>
  );
}
