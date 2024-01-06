import fs from 'fs';
import path from 'path';

class FileHelper {

  static getFileNamesInPath = async (file_path: string): Promise<Array<{ file_name: string, file_type: string }>> => {
    return new Promise((resolve, reject) => {
      let file_details: Array<{ file_name: string, file_type: string }> = [];
      fs.readdir(file_path, async (err, files) => {
        if (err) {
          reject(file_details);
        }
        if (!Array.isArray(files)) {
          resolve(file_details);
        }

        for (const file of files) {
          const file_type = await FileHelper.getFileType(file);
          file_details.push({
            file_name: file,
            file_type: file_type
          });
        }

        resolve(file_details);
      });
    });
  }

  static deleteFile = async (file_name: string) => {
    try {
      await fs.promises.unlink(file_name);
    } catch (err) {
      throw err;
    }
  }

  static checkExists = (file_path: string): boolean => {
    return fs.existsSync(file_path);
  }

  static getFileType = async (file_name: string): Promise<string> => {
    const extension = path.extname(file_name).toLowerCase();
    return extension;
  }
}



export { FileHelper };
