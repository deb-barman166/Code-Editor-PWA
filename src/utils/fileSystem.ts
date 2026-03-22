import { get, set, del, keys } from 'idb-keyval';

export interface FileNode {
  id: string;
  name: string;
  content: string;
  language: string;
  lastModified: number;
}

const FILES_PREFIX = 'file_';

export const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
      return 'css';
    case 'py':
      return 'python';
    case 'cpp':
    case 'c':
    case 'h':
    case 'hpp':
      return 'cpp';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

export const saveFile = async (file: FileNode): Promise<void> => {
  await set(`${FILES_PREFIX}${file.id}`, file);
};

export const getFile = async (id: string): Promise<FileNode | undefined> => {
  return await get(`${FILES_PREFIX}${id}`);
};

export const deleteFile = async (id: string): Promise<void> => {
  await del(`${FILES_PREFIX}${id}`);
};

export const getAllFiles = async (): Promise<FileNode[]> => {
  const allKeys = await keys();
  const fileKeys = allKeys.filter((key) => typeof key === 'string' && key.startsWith(FILES_PREFIX));
  
  const files: FileNode[] = [];
  for (const key of fileKeys) {
    const file = await get(key as string);
    if (file) files.push(file);
  }
  
  return files.sort((a, b) => a.name.localeCompare(b.name));
};

export const generateId = () => Math.random().toString(36).substring(2, 15);
