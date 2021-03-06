import { memoize } from '@bigcommerce/memoize';
import { object, string, ObjectSchema, StringSchema } from 'yup';

import getAddressCustomFieldsValidationSchema, { AddressValidationSchemaOptions } from './getAddressCustomFieldsValidationSchema';
import { AddressFormValues } from './mapAddressToFormValues';

const ERROR_KEYS: { [fieldName: string]: string } = {
    countryCode: 'address.country',
    firstName: 'address.first_name',
    lastName: 'address.last_name',
    company: 'address.company_name',
    address1: 'address.address_line_1',
    address2: 'address.address_line_1',
    city: 'address.city',
    stateOrProvince: 'address.state',
    stateOrProvinceCode: 'address.state',
    postalCode: 'address.postal_code',
    phone: 'address.phone_number',
};

export default memoize(function getAddressValidationSchema({
    formFields,
    language,
}: AddressValidationSchemaOptions): ObjectSchema<Partial<AddressFormValues>> {
    const translate: (
        key: string,
        data?: any
    ) => string | undefined = (key, data) => language && language.translate(key, data);

    return object({
        ...formFields
            .filter(({ custom }) => !custom)
            .reduce((schema, { name, required }) => {
                schema[name] = string();

                if (required) {
                    schema[name] = schema[name].required(
                        translate(`${ERROR_KEYS[name]}_required_error`)
                    );
                }

                return schema;
            },
            {} as { [key: string]: StringSchema }
        ),
    }).concat(getAddressCustomFieldsValidationSchema({ formFields, language })) as ObjectSchema<Partial<AddressFormValues>>;
});
