import { readFile, writeFile } from 'node:fs/promises';

export const readJsonArray = async (filePath) => {
  let content;

  try {
    content = await readFile(filePath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  if (content.trim() === '') return [];

  let data;

  try {
    data = JSON.parse(content);
  } catch {
    data = null;
  }

  if (!Array.isArray(data)) {
    throw new Error(`El archivo ${filePath} debe contener un array JSON válido`);
  }

  return data;
};

export const writeJsonArray = async (filePath, data) => {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
};
