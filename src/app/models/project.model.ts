import { slugify } from '../functions/slugify';

export interface Project {
  id: string;
  name: string;
  path: string;
  description: string;
  models: {
    [modelName: string]: {
      [fieldName: string]: {
        type: 'string' | 'number' | 'datetime' | 'boolean';
        placeholder: string;
        default: any;
      };
    };
  };
}
