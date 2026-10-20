export function Field({
  label,
  name,
  required = false,
  type = "text",
  placeholder,
  wide = false,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "field wide" : "field"}>
      {label}
      {required && <span className="required"> *</span>}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={160}
      />
    </label>
  );
}
