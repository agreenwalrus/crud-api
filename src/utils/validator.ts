import { type } from 'os';
import { VALIDATION_MASK, VALIDATION_REQUIRED, VALIDATION_TYPE } from './constats.js';
import { ValidationError } from './error.js';
import { ModelRestriction, arrayStringValidation } from './modelRestriction.js';

type Models = {
  [name: string]: { [key: string]: ModelRestriction };
};

class Validator {
  models: Models;

  constructor() {
    this.models = {
      user: {
        id: {
          type: 'string',
          required: false,
          private: false,
          mask: new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'),
        },
        username: { type: 'string', required: true, private: false },
        age: { type: 'number', required: true, private: false },
        hobbies: { type: 'Array<string>', required: true, private: false, typeValidation: arrayStringValidation },
      },
    };
  }

  validate(modelName: string, item: any, validatedKeys?: number) {
    const model = this.models[modelName];
    Object.keys(model)
      .filter((_, index) => validatedKeys === undefined || validatedKeys & (2 ** index))
      .forEach((key) => {
        const property = model[key];
        if (property.required && item[key] === undefined) {
          throw new ValidationError(key, VALIDATION_REQUIRED);
        } else if (item[key] !== undefined) {
          if (
            (property.typeValidation !== undefined && !property.typeValidation(item[key])) ||
            (property.typeValidation === undefined && property.type !== typeof item[key])
          ) {
            throw new ValidationError(key, `${VALIDATION_TYPE} ${property.type}`);
          }

          if (property.mask !== undefined && !property.mask.test(item[key])) {
            throw new ValidationError(key, VALIDATION_MASK);
          }
        }
      });
  }
}

export const validator = new Validator();
