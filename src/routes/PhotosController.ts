import { readdir } from 'fs/promises';
import { join, normalize, isAbsolute } from 'path';
import { Body, Post, Route } from 'tsoa';

/**
 * Photos des utilisateurs
 */
@Route("/photos")
export class PhotosController {
  /**
   * Lister les photos sur le serveur
   */
  @Post()
  public async listPhotos(
    @Body() body: {
      path?: string;
    }
  ): Promise<{ files: string[] }> {
    try {
      const basePath = './assets';
      let fullPath = basePath;

      if (body.path) {
        // Normalize and secure the path
        const normalizedPath = normalize(body.path).replace(/^(\.\.(\/|\\|$))+/, '');
        
        // Ensure the path doesn't try to go above the base directory
        if (isAbsolute(normalizedPath) || normalizedPath.startsWith('..')) {
          throw new Error('Invalid path');
        }
        
        fullPath = join(basePath, normalizedPath);
      }

      const files = await readdir(fullPath);
      return { files };
    } catch (error) {
      throw new Error('Error listing files: ' + (error as Error).message);
    }
  }
}
