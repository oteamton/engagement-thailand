import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { UpgradeRole, CustomFieldData } from "../../types/types";
import './styles.css';

type FormVisibility = {
    organization: boolean;
    individual: boolean;
}

type GroupVisibility = {
    personalInfo: boolean;
    orgInfo: boolean;
    contactInfo: boolean;
    institutionInfo: boolean;
    alternateInfo: boolean;
    representativeInfo: boolean;
    receiptInfo: boolean;
};

const inputGroups = [
    {
        fields: ["user_name", "user_surname", "user_email", "user_phone", "user_address", "user_city", "user_province", "user_country", "user_postcode"],
        name: "Personal Information",
        className: "personal-info",
    },
    {
        fields: ["orgName"],
        name: "Organization Info",
        className: "org-Info",
    },
    {
        fields: ["contact_name", "contact_surname", "contact_email", "contact_phone"],
        name: "Contact Info",
        className: "contact-Info",
    },
    {
        fields: ["alternate_name", "alternate_surname", "alternate_email", "alternate_phone"],
        name: "Alternate Info",
        className: "alternate-Info",
    },
    {
        fields: ["institution_name", "institution_addresss", "institution_city", "institution_province", "institution_postcode", "institution_country"],
        name: "Institution Info",
        className: "institution-Info",
    },
    {
        fields: ["representative_name", "representative_surname", "representative_email", "representative_phone"],
        name: "Representative Info",
        className: "representative-Info",
    },
    {
        fields: ["receipt_name", "receipt_taxNumber", "receipt_address", "receipt_city", "receipt_province", "receipt_country", "receipt_postcode"],
        name: "Receipt Info",
        className: "receipt-Info",
    }
]

// List of groups that should be excluded from the form organization
const exlucdedGroupsOrg = ["Institution Info",]
// List of groups that should be excluded from the form individual
const excludedGroupsInd = ["Organization Info", "Representative Info", "Alternate Info", "Contact Info",]

const JoinUs: React.FC = () => {
    const location = useLocation();
    const userData = location.state?.user;

    const initFormData: UpgradeRole = {
        orgName: "",
        user_name: "",
        user_surname: "",
        user_email: userData?.email || "",
        user_phone: "",
        user_lineId: "",
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
        receipt_postcode: "",
        receipt_country: "",
        receipt_city: "",
        roleId: "",
        roleTypeId: "",
        address: "",
        city: "",
        province: "",
        postcode: "",
        country: ""
    };
    const [formData, setFormData] = useState<UpgradeRole>(initFormData);
    const [errors, setErrors] = useState<Partial<UpgradeRole>>({});
    const [formVisible, setFormVisible] = useState<FormVisibility>({
        organization: false,
        individual: false,
    });
    const [formGroups, setFormGroups] = useState<{ [formType: string]: string[] }>({
        organization: inputGroups.filter((group) => !exlucdedGroupsOrg.includes(group.name)).map((group) => group.name),
        individual: inputGroups.filter((group) => !excludedGroupsInd.includes(group.name)).map((group) => group.name),
    });

    const [groupVisible, setGroupVisible] = useState<Partial<GroupVisibility>>({
        personalInfo: false,
        orgInfo: false,
        contactInfo: false,
        institutionInfo: false,
        alternateInfo: false,
        representativeInfo: false,
        receiptInfo: false,
    });

    // Toggle collapse and expand 
    const toggleGroup = (groupName: keyof GroupVisibility) => {
        setGroupVisible((prevVisible) => ({
            ...prevVisible,
            [groupName]: !prevVisible[groupName],
        }));
    }

    const fieldMapping: Record<string, CustomFieldData> = {
        orgName: { name: "Organization Name", placeholder: "Your organization name" },
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
        representative_name: { name: "Representative Name", placeholder: "Representative name" },
        representative_surname: { name: "Representative Surname", placeholder: "Representative surname" },
        representative_email: { name: "Representative Email", placeholder: "Representative email" },
        representative_phone: { name: "Representative Phone", placeholder: "Representative phone number" },
        representative_lineId: { name: "Representative Line ID", placeholder: "Representative Line ID" },
        alternate_name: { name: "Alternate Name", placeholder: "Alternate name" },
        alternate_surname: { name: "Alternate Surname", placeholder: "Alternate surname" },
        alternate_email: { name: "Alternate Email", placeholder: "Alternate email" },
        alternate_phone: { name: "Alternate Phone", placeholder: "Alternate phone number" },
        alternate_lineId: { name: "Alternate Line ID", placeholder: "Alternate Line ID" },
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

    const renderInputGroup = (group: any, groupIndex: number) => {
        // Check if the current group should be displayed based on selected
        const selectedFormType = formVisible.organization ? "organization" : "individual";
        const FormDisplay = formGroups[selectedFormType].includes(group.name);

        return (
            FormDisplay && (
                <div key={groupIndex} className={`input-group-${group.className}`} >
                    <h2 onClick={() => toggleGroup(group.name as keyof GroupVisibility)}>
                        {group.name}
                        <span className={groupVisible[group.name as keyof GroupVisibility] ? "arrow-up" : "arrow-down"}></span>
                    </h2>
                    <div className={`input-group-content ${groupVisible[group.name as keyof GroupVisibility] ? "open" : ""}`}>
                    {group.fields.map((key: string) => renderInputField(key))}
                    </div>
                    
                </div>
            )
        );
    };

    function pickFields(source: any, fields: string[]): Partial<UpgradeRole> {
        return fields.reduce((result, key) => {
            if (source[key] !== undefined) {
                result[key as keyof UpgradeRole] = source[key];
            }
            return result;
        }, {} as Partial<UpgradeRole>);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div>
            <div className="dp">
                <div className="b-title">
                    <h1>สิทธิประโยชน์</h1>
                    <p>มีสิทธิเข้าร่วมประชุมใหญ่เพื่อออกเสียงเลือกตั้งคณะกรรมการบริหารสมาคม (กรณีสมาชิกประเภทองค์กรได้รับ 2 สิทธิ สมาชิกประเภทบุคคลได้รับ 1 สิทธิ) มีสิทธิได้รับเลือกเป็นกรรมการบริหารสมาคมฯ และอนุกรรมการอื่นๆ ของสมาคมมีสิทธิประดับเครื่องหมายและสัญลักษณ์ของ EnT รับข่าวสารความเคลื่อนไหวเกี่ยวกับการทางานเพื่อสังคมของมหาวิทยาลัย</p>
                </div>
                <hr />
                <div className="bc">
                    <div id="orga">
                        <button id="org-btn" className="linkBtn" onClick={() => setFormVisible({ organization: true, individual: false })}>แบบฟอร์มสำหรับองค์กร / สถาบัน</button>
                        <ul>
                            <li>การพัฒนางานวิชาการเพื่อสังคมในองค์กรสมาชิก เช่น การให้คาปรึกษา ฝึกอบรม และประสานวิทยากรจากทั้งในและต่างประเทศมาแลกเปลี่ยนความรู้และประสบการณ์กับบุคลากร</li>
                            <li>การให้คาปรึกษาการเขียนผลงาน และการเสนอผลงานเพื่อความก้าวหน้าทางวิชาชีพของบุคลากรด้วยผลงานเพื่อสังคม</li>
                            <li>ร่วมเสนอแนะนโยบายและมาตรการต่างๆ เพื่อเสริมสร้าง Engagement ในประเทศไทยและ ASEAN</li>
                            <li>การส่งบุคลากรเข้าร่วมการประชุมสัมมนาของ EnT ในราคาสมาชิก (ไม่เกิน 2 คน)</li>
                            <li>การเตรียมความพร้อมของสมาชิกในการสมัครรับการประเมินด้าน Engagement ใน
                                ระดับนานาชาติและระดับนานาชาติ</li>
                            <li>การยกย่องและประกาศเกียรติคุณผลงานเพื่อสังคมของสมาชิกและองค์กรอื่นๆ ที่ดาเนินกิจกรรมเพื่อสังคม</li>
                        </ul>
                    </div>

                    <div id="pers">
                        <button id="per-btn" className="linkBtn" onClick={() => setFormVisible({ organization: false, individual: true })}>แบบฟอร์มสำหรับบุคคล</button>
                        <ul>
                            <li>การรับรองการใช้ประโยชน์ของผลงานวิชาการเพื่อสังคม (ในกรณีที่ผลงานนั้นๆ ได้รับการพิจารณาคัดเลือกเป็นกรณีศึกษาของ EnT)</li>
                            <li>การรับรองการใช้ประโยชน์ของผลงานวิชาการเพื่อสังคม (ในกรณีที่ผลงานนั้นๆ ได้รับการพิจารณาคัดเลือกเป็นกรณีศึกษาของ EnT)</li>
                            <li>การรับรองการใช้ประโยชน์ของผลงานวิชาการเพื่อสังคม (ในกรณีที่ผลงานนั้นๆ ได้รับการพิจารณาคัดเลือกเป็นกรณีศึกษาของ EnT)</li>
                            <li>ข้าร่วมการประชุมสัมมนาของ EnT ในอัตราสมาชิก ได้รับการสนับสนุนจาก EnT ในการไปเสนอผลงานวิชาการเพื่อสังคมในต่างประเทศ</li>
                            <li>ร่วมเป็นคณะผู้เชี่ยวชาญ ในประเด็นที่เกี่ยวข้อง</li>
                        </ul>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                {inputGroups.map((group, index) => renderInputGroup(group, index))}
            </form>

            <div className="form-action-btns">
                <button type="submit">Submit</button>
                <button type="button">Cancel</button>
            </div>

            <div className="dark-bg"></div>
        </div>
    );
};

export default JoinUs;