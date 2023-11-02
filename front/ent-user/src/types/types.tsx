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

export interface AddressDetails {
    address: string;
    city: string;
    province: string;
    postcode: string;
    country: string;
}

interface ReceiptDetails {
    name: string;
    taxNumber: string;
    address: AddressDetails;
}

export interface UpgradeRoleProps {
    orgName: string;
    perName: string;
    roleId: string;
    roleTypeId: string;

    address: AddressDetails;
    user: Partial<ContactDetails>;
    contractor: ContactDetails;
    representative: ContactDetails;
    alternate: ContactDetails;
    receipt: ReceiptDetails;
}