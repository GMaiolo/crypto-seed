interface DropdownOption {
  id: string;
  label: string;
}

interface DropdownProps {
  title: string;
  value: string;
  options: DropdownOption[];
  onSelect: (val: string) => void;
}
export const Dropdown = ({
  value,
  title,
  options,
  onSelect,
}: DropdownProps) => {
  return (
    <div className="w-full md:w-full px-3 mb-6">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {title}
      </label>
      <div className="flex-shrink w-full inline-block relative">
        <select
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          className="block appearance-none text-gray-600 w-full bg-white border border-gray-400 shadow-inner px-4 py-2 pr-8 rounded"
        >
          {options.map(({ id, label }) => (
            <option key={id} value={label}>
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute top-0 mt-3 right-0 flex items-center px-2 text-gray-600">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
