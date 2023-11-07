import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { UpgradeRole, CustomFieldData } from "../../../types/types";
import './styles.css';

type GroupVisibility = {
    userInfo: boolean;
    perInfo: boolean;
    institutionInfo: boolean;
    contactDetails: boolean;
    receiptDetails: boolean;
};

const PerForm: React.FC = () => {
    const location = useLocation();
    const userData = location.state?.user;

    const initFormData: UpgradeRole = {
        user_name: userData?.name || "",
        user_surname: userData?.surname || "",
        user_email: userData?.email || "",
        user_phone: userData?.phone || "",
        user_lineId: userData?.lineId || "",
        address: "",
        city: "",
        province: "",
        postcode: "",
        country: "",
        contact_name: "",
        contact_surname: "",
        contact_email: "",
        contact_phone: "",
        contact_lineId: "",
        institution_name: "",
        institution_addresss: "",
        institution_city: "",
        institution_province: "",
        institution_postcode: "",
        institution_country: "",
        receipt_name: "",
        receipt_taxNumber: "",
        receipt_address: "",
        receipt_province: "",
        receipt_postcode: "",
        receipt_country: "",
        receipt_city: "",
        roleId: "",
        roleTypeId: "",
    }
    function pickFields(source: any, fields: string[]): Partial<UpgradeRole> {
        return fields.reduce((result, key) => {
            if (source[key] !== undefined) {
                result[key as keyof UpgradeRole] = source[key];
            }
            return result;
        }, {} as Partial<UpgradeRole>);
    }

    const [formData, setFormData] = useState<UpgradeRole>(initFormData);
    const [errors, setErrors] = useState<Partial<UpgradeRole>>({});
    const [groupVisible, setGroupVisible] = useState<GroupVisibility>({
        userInfo: true,
        perInfo: true,
        institutionInfo: false,
        contactDetails: false,
        receiptDetails: false,
    });

    const toggleGroup = (groupName: keyof GroupVisibility) => {
        setGroupVisible((prevVisible) => ({
            ...prevVisible,
            [groupName]: !prevVisible[groupName],
        }));
    }

    const fieldMapping: Record<string, CustomFieldData> = {
        perName: { name: "Personal Name", placeholder: "Your personal name" },
        user_name: { name: "Name", placeholder: "Your user name" },
        user_surname: { name: "Surname", placeholder: "Your user surname" },
        user_email: { name: "Email", placeholder: "Your user email" },
        user_phone: { name: "Phone", placeholder: "Your user phone number" },
        user_lineId: { name: "Line ID", placeholder: "Your user Line ID" },
        user_address: { name: "Address", placeholder: "User address" },
        user_city: { name: "City", placeholder: "User city" },
        user_province: { name: "Province", placeholder: "User province" },
        user_postcode: { name: "Postcode", placeholder: "User postcode" },
        user_country: { name: "Country", placeholder: "User province" },
        contact_name: { name: "Contact Name", placeholder: "Contact name" },
        contact_surname: { name: "Contact Surname", placeholder: "Contact surname" },
        contact_email: { name: "Contact Email", placeholder: "Contact email" },
        contact_phone: { name: "Contact Phone", placeholder: "Contact phone number" },
        contact_lineId: { name: "Contact Line ID", placeholder: "Contact Line ID" },
        institution_name: { name: "Institution Name", placeholder: "Institution name" },
        institution_addresss: { name: "Institution Address", placeholder: "Institution address" },
        institution_city: { name: "Institution City", placeholder: "Institution city" },
        institution_province: { name: "Institution Province", placeholder: "Institution province" },
        institution_postcode: { name: "Institution Postcode", placeholder: "Institution postcode" },
        institution_country: { name: "Institution Country", placeholder: "Institution country" },
        receipt_name: { name: "Receipt Name", placeholder: "Receipt name" },
        receipt_taxNumber: { name: "Tax Number", placeholder: "Tax number" },
        receipt_address: { name: "Receipt Address", placeholder: "Receipt address" },
        receipt_province: { name: "Receipt Province", placeholder: "Receipt province" },
        receipt_postcode: { name: "Receipt Postcode", placeholder: "Receipt postcode" },
        receipt_city: { name: "Receipt City", placeholder: "Receipt city" },
        receipt_country: { name: "Receipt Country", placeholder: "Receipt country" },
        roleId: { name: "Role ID", placeholder: "Role ID" },
        roleTypeId: { name: "Role Type ID", placeholder: "Role Type ID" },
    };

    const renderInputField = (key: string) => {
        let inputType = "text";
        if (key === "email") inputType = "email";
        if (key === "password") inputType = "password";

        const customField = fieldMapping[key] || [];
        const customName = customField.name || key;
        const customPlaceholder = customField.placeholder;

        const fieldError = errors[key as keyof UpgradeRole];
        const inputClassName = fieldError ? 'invalid' : '';

        return (
            <div key={key} className={`form-group ${fieldError ? 'error' : ''}`}>
                <label htmlFor={key}>{customName}</label>
                <input
                    type={inputType}
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleChange}
                    placeholder={customPlaceholder}
                    className={inputClassName}
                />
            </div>
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const inputGroups = [
        {
            fields: ["user_name", "user_surname", "user_email", "user_phone", "user_address", "user_city", "user_province", "user_country", "user_postcode"],
            name: "Personal Information",
            className: "personal-info",
        },
        {
            fields: ["contact_name", "contact_surname", "contact_email", "contact_phone", "contact_lineId"],
            name: "Contact Details",
            className: "contact-details",
        },
        {
            fields: ["receipt_name", "receipt_taxNumber", "receipt_address", "receipt_province", "receipt_postcode", "receipt_city", "receipt_country"],
            name: "Receipt Details",
            className: "receipt-details",
        }
    ]

    return (
        <div>

        </div>
    )
}



export default PerForm;