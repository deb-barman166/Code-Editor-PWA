import React, { useEffect, useRef } from 'react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEditor } from '../store/EditorContext';

export const Editor: React.FC = () => {
  const { files, activeTabId, updateFileContent, theme } = useEditor();
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  const activeFile = files.find(f => f.id === activeTabId);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('my-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e',
        }
      });
      monaco.editor.defineTheme('my-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#fffffe',
        }
      });
      monaco.editor.setTheme(theme === 'vs-dark' ? 'my-dark' : 'my-light');
    }
  }, [monaco, theme]);

  const handleEditorDidMount = (editor: any, monacoInstance: any) => {
    editorRef.current = editor;
    
    // Add custom keybindings
    editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS, () => {
      // Save is automatic, but we can add a visual cue here if needed
      console.log('Saved');
    });
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)] flex-col gap-4">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="w-24 h-24 opacity-20 grayscale" />
        <p>Select a file to start editing</p>
        <p className="text-xs">Or create a new file from the sidebar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <MonacoEditor
        height="100%"
        language={activeFile.language}
        theme={theme === 'vs-dark' ? 'my-dark' : 'my-light'}
        value={activeFile.content}
        onChange={(value) => updateFileContent(activeFile.id, value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
        }}
        className="absolute inset-0"
      />
    </div>
  );
};
