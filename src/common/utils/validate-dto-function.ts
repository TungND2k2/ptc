import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsMongoIdOrWildcard(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMongoIdOrWildcard',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Allows "*" or a valid 24-character hexadecimal MongoDB ObjectId
          return (
            typeof value === 'string' &&
            (value === '*' ||
              value == undefined ||
              value == '' ||
              /^[a-f\d]{24}$/i.test(value))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid MongoDB ObjectId or "*"`;
        },
      },
    });
  };
}

export function IsFutureDateString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate > currentDate; // Checks if the date is in the future
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}
