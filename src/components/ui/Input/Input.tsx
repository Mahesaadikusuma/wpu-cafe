import type { InputHTMLAttributes } from "react";

// Meng-extend atribut bawaan input HTML agar tidak perlu menulis ulang onChange, value, dsb.
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; // id dibuat wajib untuk aksesibilitas label (htmlFor)
  containerClassName?: string; // Class tambahan opsional khusus untuk div pembungkus
}

const Input = ({
  label,
  id,
  type = "text",
  className = "",
  containerClassName = "",
  required = false,
  ...props
}: InputProps) => {
  // Styling container: gap dikurangi agar proporsional
  const containerStyle = "flex flex-col gap-1.5 w-full";

  // Styling input: ditambah efek fokus (ring/border biru) agar lebih interaktif
  const inputStyle =
    "border border-gray-300 rounded-md p-2 text-gray-900 bg-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className={`${containerStyle} ${containerClassName}`}>
      <label htmlFor={id} className="text-sm font-bold text-gray-800">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className={`${inputStyle} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
