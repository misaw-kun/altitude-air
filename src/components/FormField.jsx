import PropTypes from "prop-types";

const FormField = ({
  type,
  name,
  placeholder,
  width,
  value,
  onChange,
  error,
}) => {
  return (
    <>
      <input
        className={`p-3 border-2 ${
          error
            ? "border-red-500 bg-red-100 placeholder:text-red-300"
            : "border-gray-500"
        } rounded-md ${width} mb-3`}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </>
  );
};

FormField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  width: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormField;
