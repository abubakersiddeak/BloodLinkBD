import { ChevronDown } from "lucide-react";
import React from "react";

export default function FormSelect({
  id,
  label,
  icon: Icon,
  error,
  register,
  options,
  placeholder,
  validation,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-gray-700 text-sm mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon
            className={`w-4 h-4 ${error ? "text-red-400" : "text-gray-400"}`}
          />
        </div>
        <select
          id={id}
          disabled={disabled}
          {...register(id, validation)}
          className={`w-full pl-10 pr-8 py-2.5 border appearance-none ${
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-red-500"
          } focus:outline-none text-sm bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
