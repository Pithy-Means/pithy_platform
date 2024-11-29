// to compress image / video
import imageCompression from 'browser-image-compression';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export function validateFile(file: File): string | null {
    const validImageFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const validVideoFormats = ['video/mp4', 'video/webm', 'video/ogg'];
  
    if (![...validImageFormats, ...validVideoFormats].includes(file.type)) {
      return 'Invalid file format. Please upload JPG, PNG, GIF, or MP4 files.';
    }
  
    const isImage = validImageFormats.includes(file.type);
    const isVideo = validVideoFormats.includes(file.type);
    const fileType = isImage ? 'image' : isVideo ? 'video' : '';

    if (isImage && fileType === 'video') {
      return 'You have already selected a video. Please remove it before selecting an image.';
    }
  
    if (isVideo && fileType === 'image') {
      return 'You have already selected an image. Please remove it before selecting a video.';
    }
  
    return null;
    
};

    // Check if the file is an image
  export function isImage(file: File): boolean {
    const validImageFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    return validImageFormats.includes(file.type);
  };

  // Check if the file is a video
  export function isVideo(file: File): boolean {
    const validVideoFormats = ['video/mp4', 'video/webm', 'video/ogg'];
    return validVideoFormats.includes(file.type);
  };

  // Compressed image
  export const compressImage = async(file: File): Promise<File> => {
    const compressedImage = await imageCompression(file, {
      maxSizeMB: 3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  
    const compressedSize = compressedImage.size / (1024 * 1024); // in MB
    if (compressedSize > 3) {
      throw new Error('Image size is too large. Please upload an image less than 3MB.');
    }
  
    return compressedImage;
  };

  // Compressed video
  export const compressVideo = async (file: File): Promise<File> => {
    // const ffmpeg = createFFmpeg({ log: true });
    const ffmpeg = createFFmpeg({ log: process.env.NODE_ENV !== 'production' });

    await ffmpeg.load();
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  
    await ffmpeg.run('-i', file.name, '-b:v', '1M', '-preset', 'fast', 'output.mp4');
    const compressedVideo = ffmpeg.FS('readFile', 'output.mp4') as Uint8Array;
    const compressedBlob = new Blob([compressedVideo], { type: 'video/mp4' });
  
    const compressedSize = compressedBlob.size / (1024 * 1024); // in MB
    if (compressedSize > 10) {
      throw new Error('Video size is too large. Please upload a video less than 10MB.');
    }
  
    return new File([compressedBlob], 'compressed.mp4', { type: 'video/mp4' });
  };
