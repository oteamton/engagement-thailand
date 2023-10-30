import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './styles.css';

interface OrgaFormData {
    name: string;
    surname: string;
    email: string;
    organization_name: string;
    address: string;
    city: string;
    provider: string;
    postcode: string;
    country: string;
    phone: string;
    receipt_name: string;
    tax_number: string;
    receipt_address: string;
}

const EditProfile: React.FC = () => {
    const location = useLocation();
    const userData = location.state?.user;

    // Initial state that matches the form
    const defaultFormData: OrgaFormData = {
        name: userData?.name || "",
        surname: userData?.surname || "",
        email: userData?.email || "",
        organization_name: userData?.organization_name || "",
        address: userData?.address || "",
        city: userData?.city || "",
        provider: userData?.provider || "",
        postcode: userData?.postcode || "",
        country: userData?.country || "",
        phone: userData?.phone || "",
        receipt_name: userData?.receipt_name || "",
        tax_number: userData?.tax_number || "",
        receipt_address: userData?.receipt_address || "",
    };
    function pickFields(source: any, fields: string[]): Partial<OrgaFormData> {
        return fields.reduce((result, key) => {
            if (source[key] !== undefined) {
                result[key as keyof OrgaFormData] = source[key];
            }
            return result;
        }, {} as Partial<OrgaFormData>);
    }

    const initialFormData = userData
        ? { ...defaultFormData, ...pickFields(userData, ['name', 'email', 'phone', 'address']) }
        : defaultFormData;

    const [formData, setFormData] = useState<OrgaFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<OrgaFormData>>({});

    const renderInputField = (key: string) => {
        let inputType = "text";
        if (key === "email") inputType = "email";
        if (key === "password") inputType = "password";

        // if(key === "organization_name") key_name = "Organization Name";
        const fieldError = errors[key as keyof OrgaFormData];
        const inputClassName = fieldError ? 'invalid' : '';

        return (
            <div key={key} className={`form-group ${fieldError ? 'error' : ''}`}>
                <label htmlFor={key}>{key.replace(/_/g, " ").charAt(0).toUpperCase() + key.replace(/_/g, "").slice(1)}</label>
                <input
                    type={inputType}
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key.replace(/_/g, "")}`}
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className="edit-profile-form">
            {/* Iterate over each field in ProfileData */}
            {Object.keys(formData).map((key) => renderInputField(key))}

            <div className="form-action-btns">
                <button type="submit">Update Profile</button>
                <button type="button">Cancel</button>
            </div>
        </form>
    );
}

export default EditProfile;