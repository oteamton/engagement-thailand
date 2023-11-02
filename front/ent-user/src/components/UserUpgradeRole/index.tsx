import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { UpgradeRole, CustomFieldData } from "../../types/types";

const JoinUs: React.FC = () => {
    const location = useLocation();
    const userData = location.state?.user;

    const initialFormData: UpgradeRole = {
        orgName: userData?.organization_name || "",
        perName: userData?.peronal_name || "",
        user_name: userData?.name || "",
        user_surname: userData?.surname || "",
        user_email: userData?.email || "",
        user_phone: userData?.phone || "",
        user_lineId: userData?.lineId || "",
        contact_name: "",
        contact_surname: "",
        contact_email: "",
        contact_phone: "",
        contact_lineId: "",
        representative_name: "",
        representative_surname: "",
        representative_email: "",
        representative_phone: "",
        representative_lineId: "",
        alternate_name: "",
        alternate_surname: "",
        alternate_email: "",
        alternate_phone: "",
        alternate_lineId: "",
        receipt_name: "",
        receipt_taxNumber: "",
        receipt_address: "",
        receipt_province: "",
        roleId: "",
        roleTypeId: "",
        receipt_postcode: "",
        receipt_country: "",
        receipt_city: "",
        address: "",
        city: "",
        province: "",
        postcode: "",
        country: ""
    };

    function pickFields(source: any, fields: string[]): Partial<UpgradeRole> {
        return fields.reduce((result, key) => {
            if (source[key] !== undefined) {
                result[key as keyof UpgradeRole] = source[key];
            }
            return result;
        }, {} as Partial<UpgradeRole>);
    }

    const [formData, setFormData] = useState<UpgradeRole>(initialFormData);
    const [errors, setErrors] = useState<Partial<UpgradeRole>>({});

    const fieldMapping: Record<string, CustomFieldData> = {
        orgName: { name: "Organization Name", placeholder: "Your organization name" },
        perName: { name: "Personal Name", placeholder: "Your personal name" },
        user_name: { name: "Name", placeholder: "Your name" },
        user_surname: { name: "Surname", placeholder: "Your surname" },
        user_email: { name: "Email", placeholder: "Your email" },
        user_phone: { name: "Phone", placeholder: "Your phone number" },
        user_lineId: { name: "Line ID", placeholder: "Your Line ID" },
        contact_name: { name: "Name", placeholder: "Your name" },
        contact_surname: { name: "Surname", placeholder: "Your surname" },
        contact_email: { name: "Email", placeholder: "Your email" },
        contact_phone: { name: "Phone", placeholder: "Your phone number" },
        contact_lineId: { name: "Line ID", placeholder: "Your Line ID" },
        representative_name: { name: "Name", placeholder: "Your name" },
        representative_surname: { name: "Surname", placeholder: "Your surname" },
        representative_email: { name: "Email", placeholder: "Your email" },
        representative_phone: { name: "Phone", placeholder: "Your phone number" },
        representative_lineId: { name: "Line ID", placeholder: "Your Line ID" },
        alternate_name: { name: "Name", placeholder: "Your name" },
        alternate_surname: { name: "Surname", placeholder: "Your surname" },
        alternate_email: { name: "Email", placeholder: "Your email" },
        alternate_phone: { name: "Phone", placeholder: "Your phone number" },
        alternate_lineId: { name: "Line ID", placeholder: "Your Line ID" },
        receipt_name: { name: "Name", placeholder: "Your name" },
        receipt_taxNumber: { name: "Tax Number", placeholder: "Your tax number" },
        receipt_address: { name: "Address", placeholder: "Your address" },
        receipt_province: { name: "Province", placeholder: "Your province" },
        roleId: { name: "Role ID", placeholder: "Your role ID" },
        roleTypeId: { name: "Role Type ID", placeholder: "Your role type ID" },
        receipt_postcode: { name: "Postcode", placeholder: "Your postcode" },
        receipt_country: { name: "Country", placeholder: "Your country" },
        receipt_city: { name: "City", placeholder: "Your city" },
        address: { name: "Address", placeholder: "Your address" },
        city: { name: "City", placeholder: "Your city" },
        province: { name: "Province", placeholder: "Your province" },
        postcode: { name: "Postcode", placeholder: "Your postcode" },
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
            fields: ["name", "surname", "email", "phone", "address", "city", "province", "country", "postcode"],
            name: "Personal Information",
            className: "personal-info",
        },
        {
            fields: ["orgName", "receipt_name", "tax_number", "receipt_address"],
            name: "Organization Details",
            className: "org-details",
        },
        {
            fields: ["contact_name", "contact_surname", "contact_email", "contact_phone", "contact_address", "contact_city", "contact_province", "contact_country", "contact_postcode"],
            name: "contact Details",
            className: "contact-details",
        },
        {
            fields: ["alternate_name", "alternate_surname", "alternate_email", "alternate_phone", "alternate_address", "alternate_city", "alternate_province", "alternate_country", "alternate_postcode"],
            name: "alternate Details",
            className: "alternate-details",
        },
        {
            field: ["representative_name", "representative_surname", "representative_email", "representative_phone", "representative_address", "representative_city", "representative_province", "representative_country", "representative_postcode"],
            name: "Representative Details",
            className: "representative-details",
        },
        {
            field: ["user_name", "user_surname", "user_email", "user_phone", "user_address", "user_city", "user_province", "user_country", "user_postcode"],
            name: "User Details",
            className: "user-details",
        },
        
    ]

    const renderInputGroup = (group: any, groupIndex: number) => (
        <div key={groupIndex} className={`input-group-${group.className}`}>
            <h2>{group.name}</h2>
            {group.fields.map((key: string) => renderInputField(key))}
        </div>
    );


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                {inputGroups.map((group, index) => renderInputGroup(group, index))}
            </form>
        </div>
    );
};

export default JoinUs;