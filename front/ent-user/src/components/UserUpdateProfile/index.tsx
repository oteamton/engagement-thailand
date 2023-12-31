import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './styles.css';
import { FormData, CustomFieldData } from "../../types/types";

const UpdateProfile: React.FC = () => {
    const location = useLocation();
    const userData = location.state?.user;

    // Initial state that matches the form
    const defaultFormData: FormData = {
        username: userData?.username,
        name: userData?.name || "",
        surname: userData?.surname || "",
        email: userData?.email || "",
        organization_name: userData?.organization_name || "",
        address: userData?.address || "",
        city: userData?.city || "",
        province: userData?.province || "",
        postcode: userData?.postcode || "",
        country: userData?.country || "",
        phone: userData?.phone || "",
        receipt_name: userData?.receipt_name || "",
        tax_number: userData?.tax_number || "",
        receipt_address: userData?.receipt_address || "",
    };
    function pickFields(source: any, fields: string[]): Partial<FormData> {
        return fields.reduce((result, key) => {
            if (source[key] !== undefined) {
                result[key as keyof FormData] = source[key];
            }
            return result;
        }, {} as Partial<FormData>);
    }

    const initialFormData = userData
        ? { ...defaultFormData, ...pickFields(userData, ['username', 'name', 'email', 'phone', 'address']) }
        : defaultFormData;

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const fieldMapping: Record<string, CustomFieldData> = {
        name: { name: "Name", placeholder: "Your name" },
        surname: { name: "Surname", placeholder: "Your surname" },
        email: { name: "Email", placeholder: "Your email" },
        organization_name: { name: "Organization", placeholder: "Example Co.,Ltd" },
        address: { name: "Address", placeholder: "Your address/street" },
        city: { name: "City", placeholder: "City" },
        province: { name: "Province", placeholder: "Province" },
        country: { name: "Country", placeholder: "Country" },
        postcode: { name: "Post", placeholder: "XXXXX" },
        phone: { name: "Phone", placeholder: "0XX-XXX-XXXX" },
        receipt_name: { name: "Receipt name", placeholder: "Receipt's name" },
        tax_number: { name: "Tax number", placeholder: "Tax number" },
        receipt_address: { name: "Receipt address", placeholder: "Receipt's address" },
    };

    const renderInputField = (key: string) => {
        let inputType = "text";
        if (key === "email") inputType = "email";

        const customField = fieldMapping[key] || [];
        const customName = customField.name || key;
        const customPlaceholder = customField.placeholder;

        const fieldError = errors[key as keyof FormData];
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
        // {
        //     fields: ["organization_name", "receipt_name", "tax_number", "receipt_address"],
        //     name: "Organization Details",
        //     className: "org-details",
        // },
    ]

    const renderInputGroup = (group: any, groupIndex: number) => (
        <div key={groupIndex} className={`input-group-${group.className}`}>
            <h2>{group.name}</h2>
            {group.className === 'personal-info' && <h3>{userData.username}</h3>}
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

            <div className="form-action-btns">
                <button type="submit">Update Profile</button>
                <button type="button" onClick={() => window.history.back()}>Cancel</button>
            </div>

            <div className="dark-bg"></div>
        </div>

    );
}

export default UpdateProfile;