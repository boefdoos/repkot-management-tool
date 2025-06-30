// components/FormComponents.tsx
import React, { useState } from 'react';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
}

export function FormField({ label, error, required, children, description }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export function TextInput({ 
  label, 
  error, 
  required, 
  description, 
  className = '',
  ...props 
}: TextInputProps) {
  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <input
        {...props}
        className={`form-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
    </FormField>
  );
}

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  description?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ 
  label, 
  value, 
  onChange, 
  error, 
  required, 
  description,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  className = '',
  ...props 
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    if (max !== undefined && newValue > max) return;
    if (newValue < min) return;
    onChange(newValue);
  };

  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          {...props}
          type="number"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          min={min}
          max={max}
          step={step}
          className={`form-input ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''} ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </FormField>
  );
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  error?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
}

export function SelectInput({ 
  label, 
  options, 
  error, 
  required, 
  description,
  placeholder = 'Selecteer een optie',
  className = '',
  ...props 
}: SelectInputProps) {
  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <select
        {...props}
        className={`form-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export function TextArea({ 
  label, 
  error, 
  required, 
  description, 
  className = '',
  ...props 
}: TextAreaProps) {
  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <textarea
        {...props}
        className={`form-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
    </FormField>
  );
}

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export function PasswordInput({ 
  label, 
  error, 
  required, 
  description, 
  className = '',
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`form-input pr-10 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
    </FormField>
  );
}

interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export function CheckboxInput({ 
  label, 
  description, 
  error,
  className = '',
  ...props 
}: CheckboxInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            {...props}
            type="checkbox"
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">
            {label}
          </label>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600 ml-7">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  description?: string;
}

export function RadioGroup({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  error, 
  required, 
  description 
}: RadioGroupProps) {
  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={`${name}-${option.value}`} className="font-medium text-gray-700">
                {option.label}
              </label>
              {option.description && (
                <p className="text-gray-500">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </FormField>
  );
}

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export function DateInput({ 
  label, 
  error, 
  required, 
  description, 
  className = '',
  ...props 
}: DateInputProps) {
  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <input
        {...props}
        type="date"
        className={`form-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
    </FormField>
  );
}

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export function TimeInput({ 
  label, 
  error, 
  required, 
  description, 
  className = '',
  ...props 
}: TimeInputProps) {
  return (
    <FormField 
      label={label} 
      error={error} 
      required={required} 
      description={description}
    >
      <input
        {...props}
        type="time"
        className={`form-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
    </FormField>
  );
}

// Validation helpers
export const validators = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Dit veld is verplicht';
    }
    return null;
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Voer een geldig e-mailadres in';
    }
    return null;
  },

  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Minimaal ${min} karakters vereist`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Maximaal ${max} karakters toegestaan`;
    }
    return null;
  },

  min: (min: number) => (value: number) => {
    if (value < min) {
      return `Waarde moet minimaal ${min} zijn`;
    }
    return null;
  },

  max: (max: number) => (value: number) => {
    if (value > max) {
      return `Waarde mag maximaal ${max} zijn`;
    }
    return null;
  },

  phone: (value: string) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    if (value && !phoneRegex.test(value)) {
      return 'Voer een geldig telefoonnummer in';
    }
    return null;
  }
};

// Hook for form validation
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, Array<(value: any) => string | null>>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const setTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  };

  const validateField = (field: keyof T, value: any) => {
    const rules = validationRules[field] || [];
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        return false;
      }
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
    return true;
  };

  const validateAll = () => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const field in validationRules) {
      const rules = validationRules[field] || [];
      for (const rule of rules) {
        const error = rule(values[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, field) => {
        acc[field as keyof T] = true;
        return acc;
      }, {} as Partial<Record<keyof T, boolean>>)
    );

    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}
