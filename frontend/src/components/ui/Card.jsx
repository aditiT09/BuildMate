// src/components/ui/Card.jsx

export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        shadow-md
        border
        border-gray-100
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}