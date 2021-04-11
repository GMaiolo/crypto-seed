interface InputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}
export const Input = ({ label, value, placeholder, onChange }: InputProps) => {
  return (
    <div className="w-full md:w-full px-3 mb-6">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder={placeholder || ""}
        required
      />
    </div>
  );
};
