export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[#E35336] text-white hover:opacity-90",
    secondary:
      "bg-[#F4A460] text-[#2B1B12] hover:opacity-90",
    outline:
      "border border-[#D2B48C] text-[#2B1B12]",
  };

  return (
    <button
      type={type}
      className={`px-5 py-2 rounded-lg transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}