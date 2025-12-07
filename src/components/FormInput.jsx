const { EyeOff, Eye } = require("lucide-react");

export default function FormInput({
  id,
  label,
  icon: Icon,
  error,
  register,
  type = "text",
  placeholder,
  validation,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
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
        <input
          type={
            showPasswordToggle ? (showPassword ? "text" : "password") : type
          }
          id={id}
          {...register(id, validation)}
          className={`w-full pl-10 ${
            showPasswordToggle ? "pr-10" : "pr-3"
          } py-2.5 border ${
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-300 focus:border-red-500"
          } focus:outline-none text-sm`}
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}
