import React from 'react';
import Select from 'react-select';

export default function SelectField({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={`Selecciona ${label.toLowerCase()}`}
      />
    </div>
  );
}
