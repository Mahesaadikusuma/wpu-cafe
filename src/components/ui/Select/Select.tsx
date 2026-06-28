import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  name: string;
  required?: boolean;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const Select = (props: SelectProps) => {
  const { label, id, options, name, className, required = false } = props;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-bold text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className={`border border-gray-300 rounded-md p-2 text-gray-900 bg-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
        {...props}
      >
        <option value="">Pilih Opsi</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
