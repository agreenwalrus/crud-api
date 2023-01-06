export type ModelRestriction = {
  type: string;
  required: boolean;
  private: boolean;
  mask?: RegExp;
  typeValidation?: (property: any) => boolean;
};

export function arrayStringValidation(property: any): boolean {
  return arrayValidation(property, 'string');
}

export function arrayValidation(property: Array<any>, type: string): boolean {
  return Array.isArray(property) && property.every((e: any) => typeof e === type);
}
