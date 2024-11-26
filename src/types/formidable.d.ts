declare module 'formidable' {
    import { IncomingMessage } from 'http';
  
    interface File {
      size: number;
      filepath: string;
      originalFilename: string | null;
      mimetype: string | null;
      hash?: string | null;
      lastModifiedDate?: Date;
    }
  
    interface Fields {
      [key: string]: string | string[];
    }
  
    interface Files {
      [key: string]: File | File[];
    }
  
    interface FormidableOptions {
      uploadDir?: string;
      keepExtensions?: boolean;
      maxFileSize?: number;
      maxFields?: number;
      maxFieldsSize?: number;
      allowEmptyFiles?: boolean;
      filter?: (file: File) => boolean;
    }
  
    class IncomingForm {
      static IncomingForm: any;
      constructor(options?: FormidableOptions);
      parse(
        req: IncomingMessage,
        callback?: (
          err: Error | null,
          fields: Fields,
          files: Files
        ) => void
      ): void;
      on(event: string, callback: (...args: any[]) => void): this;
    }
  
    export = IncomingForm;
  }
  