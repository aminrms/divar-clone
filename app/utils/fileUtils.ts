// src/utils/fileUtils.ts

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  AUDIO: 20 * 1024 * 1024, // 20MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  DEFAULT: 10 * 1024 * 1024, // 10MB
};

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
  AUDIO: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (file: File): FileValidationResult => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Get file type category
  const fileType = file.type.toLowerCase();
  let maxSize = FILE_SIZE_LIMITS.DEFAULT;

  if (fileType.startsWith('image/')) {
    maxSize = FILE_SIZE_LIMITS.IMAGE;
  } else if (fileType.startsWith('video/')) {
    maxSize = FILE_SIZE_LIMITS.VIDEO;
  } else if (fileType.startsWith('audio/')) {
    maxSize = FILE_SIZE_LIMITS.AUDIO;
  } else if (
    fileType.includes('pdf') ||
    fileType.includes('document') ||
    fileType.includes('word') ||
    fileType.includes('excel') ||
    fileType.includes('powerpoint')
  ) {
    maxSize = FILE_SIZE_LIMITS.DOCUMENT;
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (typeof bytes === 'string') bytes = Number(bytes)
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export const getFileTypeFromMime = (mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'file' => {
  const type = mimeType.toLowerCase();

  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (
    type.includes('pdf') ||
    type.includes('document') ||
    type.includes('word') ||
    type.includes('excel') ||
    type.includes('powerpoint') ||
    type.includes('text')
  ) {
    return 'document';
  }

  return 'file';
};

export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};