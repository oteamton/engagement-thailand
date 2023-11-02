export interface FormData {
    name: string;
    surname: string;
    email: string;
    organization_name: string;
    address: string;
    city: string;
    province: string;
    postcode: string;
    country: string;
    phone: string;
    receipt_name: string;
    tax_number: string;
    receipt_address: string;
}

export interface CustomFieldData {
    name: string;
    placeholder: string;
}

export interface ContactDetails {
    name: string;
    surname: string;
    email: string;
    phone: string;
    lineId: string;
}

export interface UpgradeRole {
    orgName: string;
    perName: string;
    roleId: string;
    roleTypeId: string;

    user_name: string;
    user_surname: string;
    user_email: string;
    user_phone: string;
    user_lineId?: string;

    contact_name: string;
    contact_surname: string;
    contact_email: string;
    contact_phone: string;
    contact_lineId?: string;

    representative_name: string;
    representative_surname: string;
    representative_email: string;
    representative_phone: string;
    representative_lineId?: string;

    alternate_name: string;
    alternate_surname: string;
    alternate_email: string;
    alternate_phone: string;
    alternate_lineId?: string;

    receipt_name: string;
    receipt_taxNumber: string;
    receipt_address: string;
    receipt_province: string;
    receipt_postcode: string;
    receipt_country: string;
    receipt_city: string;

    address: string;
    city: string;
    province: string;
    postcode: string;
    country: string;

}