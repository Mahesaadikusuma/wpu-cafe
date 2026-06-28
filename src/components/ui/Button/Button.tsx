interface PropTypes {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  color?: "primary" | "secondary" | "danger" | "outline";
}

const Button = (props: PropTypes) => {
  const {
    children,
    onClick,
    type = "button",
    disabled = false,
    className,
    color = "primary",
  } = props;

  const colorStyles = {
    primary: "bg-[#252422] hover:bg-[#3d3b38] text-white",
    secondary: "bg-gray-100 hover:bg-gray-300 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border border-slate-700 hover:bg-slate-700 hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${colorStyles[color]} flex justify-center items-center font-semibold cursor-pointer rounded-md px-[12px] py-[10px] ${className} ${disabled && "opacity-50 cursor-not-allowed"}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
