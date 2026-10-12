import { useState } from "react";
import { STATUS_OPTIONS } from "../config/constants";

const EMPTY = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  technology: "",
  joiningDate: "",
  status: STATUS_OPTIONS[0],
};

export default function FresherForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY;
    const values = { ...EMPTY };
    Object.keys(EMPTY).forEach((k) => { values[k] = initial[k] ?? EMPTY[k]; });
    return values;
  });
  const [errors, setErrors] = useState({});

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.employeeId.trim()) err.employeeId = "Employee ID is required";
    if (!form.name.trim()) err.name = "Name is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email";
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) err.phone = "Enter 10 digits";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {};
    Object.keys(EMPTY).forEach((k) => { payload[k] = form[k].trim(); });
    payload.joiningDate = payload.joiningDate || null;
    onSubmit(payload);
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div className="field">
      <label>{label}</label>
      <input type={type} name={name} value={form[name]} onChange={change} placeholder={placeholder} />
      {errors[name] && <small className="error-text">{errors[name]}</small>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid-2">
        {Field({ label: "Employee ID *", name: "employeeId", placeholder: "EMP001" })}
        {Field({ label: "Name *", name: "name", placeholder: "Arun Kumar" })}
        {Field({ label: "Email", name: "email", placeholder: "arun@company.com" })}
        {Field({ label: "Phone", name: "phone", placeholder: "9876543210" })}
        {Field({ label: "Technology", name: "technology", placeholder: "Java, React" })}
        {Field({ label: "Joining Date", name: "joiningDate", type: "date" })}
      </div>
      <div className="field">
        <label>Status</label>
        <select name="status" value={form.status} onChange={change}>
		{(STATUS_OPTIONS.includes(form.status) ? STATUS_OPTIONS : [form.status, ...STATUS_OPTIONS])
		  .map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}