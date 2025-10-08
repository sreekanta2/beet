/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Control,
  FieldError,
  useFormContext,
  UseFormSetError,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Checkbox } from "./ui/checkbox";

import { deleteImage, uploadImage } from "@/action/action.file-upload";
import { Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { RadioGroup } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  RADIO = "radio",
  FILE_UPLOAD = "fileUpload",
  SELECT_MULTI = "selectMulti",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  type?: string;
  value?: string;
  dateFormat?: string;
  showTimeSelect?: boolean;
  checked?: boolean;
  children?: React.ReactNode;
  onCheckedChange?: (name: string) => void;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType | undefined;
  setError?: UseFormSetError<any>;
  defaultValue?: string;
  required?: boolean;
  options?: {
    value: string;
    label: string;
    name?: string;
    id?: string;
    disabled?: boolean;
  }[];
  file?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | null | undefined;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  minLength?: number;
  maxLength?: number;
  loading?: boolean;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const RenderInput = ({
  field,
  props,
}: {
  field: any;
  props: CustomProps;
  fieldState: { error?: FieldError };
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      const [showPassword, setShowPassword] = useState(false);

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

      if (props.type === "password") {
        return (
          <div className="flex w-full rounded-md bg-background">
            {props.iconSrc && (
              <Image
                src={props.iconSrc}
                height={24}
                width={24}
                alt={props.iconAlt || "icon"}
                className="ml-2"
              />
            )}
            <div className="relative flex items-center w-full">
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={props.placeholder}
                  {...field}
                  className={`border pr-10 ${props.className} ${
                    props.disabled ? "font-medium text-default-900" : ""
                  }`}
                  disabled={props.disabled}
                />
              </FormControl>
              <button
                type="button"
                className="absolute right-3 text-muted-foreground hover:text-foreground"
                onClick={() => togglePasswordVisibility()}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        );
      }

      // Regular input field
      return (
        <div className="flex w-full rounded-md bg-background">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              type={props.type || "text"}
              placeholder={props.placeholder}
              {...field}
              className={`border ${
                props.disabled ? "text-sm text-default-900" : ""
              }`}
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.FILE_UPLOAD: {
      const [preview, setPreview] = useState<string | null>(
        typeof field.value === "string" ? field.value : null
      );

      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      const fileInputRef = useRef<HTMLInputElement>(null);

      const handleFileSelection = async (file: File) => {
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
        const maxSize = 3 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
          setError("Only JPG, PNG, and SVG files are allowed.");

          return;
        }
        if (file.size > maxSize) {
          setError("File size must not exceed 3MB.");

          return;
        }

        setError(null);
        setLoading(true);

        // Create a preview for the image
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const result = await uploadImage(formData); // ✅ call server action

          setPreview(result.secure_url);
          field.onChange(result.secure_url);
        } catch (err) {
          console.error("Upload error:", err);
          setError("Upload failed. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          handleFileSelection(file);
        }
      };

      const handleRemove = async () => {
        if (!preview) return;
        setLoading(true);
        try {
          // extract Cloudinary public_id from URL
          const parts = preview.split("/");
          const publicIdWithExt = parts[parts.length - 1];
          const publicId = publicIdWithExt.split(".")[0];

          await deleteImage(`uploads/${publicId}`);

          setPreview(null);
          field.onChange("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
          console.error("Delete error:", err);
          setError("Failed to delete image.");
        } finally {
          setLoading(false);
        }
      };

      return (
        <FormControl>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {/* Preview Image */}

              <>
                {" "}
                <div
                  className={`${
                    !props?.file
                      ? "w-32 h-32 rounded-full"
                      : "w-full border-dashed rounded-md"
                  }  overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100`}
                >
                  {loading ? (
                    <div className="flex flex-col items-center gap-2 p-4">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="text-xs text-gray-500">
                        Uploading...
                      </span>
                    </div>
                  ) : preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-xs mt-1">No image</span>
                    </div>
                  )}
                </div>
                {/* Upload Controls */}
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                  />

                  {!preview && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {!props?.file ? "Upload Picture" : "Choose File"}
                    </button>
                  )}

                  {preview && !loading && (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Remove
                    </button>
                  )}

                  <p className="text-xs text-gray-500">
                    JPG, PNG, WebP, or GIF. Max 3MB.
                  </p>
                </div>
              </>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-3 mt-2">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </FormControl>
      );
    }
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className=" "
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="BD"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone h-24"
            countries={["BD"]}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={props.checked}
              onCheckedChange={(isChecked) => {
                // Call parent handler to ensure only one is checked at a time
                if (props.onCheckedChange) {
                  props.onCheckedChange(props.name);
                }
                field.onChange(isChecked);
              }}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.RADIO:
      return (
        <FormControl>
          <RadioGroup
            onValueChange={(value) => field.onChange(value)}
            value={field.value}
            className="  flex items-center gap-x-2 "
          >
            {props.children}
          </RadioGroup>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-default-100 bg-background items-center z-[9999] ">
          {props?.iconSrc && (
            <div className="ml-2 w-6 h-6">
              <props.iconSrc />
            </div>
          )}

          <FormControl>
            <ReactDatePicker
              selected={field.value ? new Date(field.value) : null} // ✅ ensure it's Date
              onChange={(date: Date | null) => field.onChange(date)}
              placeholderText={props.placeholder}
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker   "
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <div className="w-full">
          <FormControl>
            <select
              {...field}
              disabled={props.disabled || props.loading} // disable when loading
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Loading state */}
              {props.loading ? (
                <option value="">Loading...</option>
              ) : (
                <>
                  <option value="">{`Select ${
                    props?.label ?? "Options"
                  }`}</option>
                  {props.options?.map((option) => (
                    <option
                      key={option?.value}
                      value={option?.value?.toString()}
                      disabled={option.disabled}
                    >
                      {option?.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT_MULTI:
      return (
        <div className="w-full">
          {/* Display selected labels above the select box */}
          {field.value?.length > 0 && (
            <div className="mb-2 text-sm text-gray-700">
              Selected:{" "}
              {props.options
                ?.filter((opt) => (field.value || []).includes(opt?.id || ""))
                .map((opt) => opt.label)
                .join(", ")}
            </div>
          )}

          <FormControl>
            <select
              className="w-full bg-background rounded-md border border-input px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-ring
                     disabled:cursor-not-allowed disabled:opacity-50"
              value=""
              onChange={(e) => {
                const val = e.target.value;
                const current: string[] = field.value || [];
                if (current.includes(val)) {
                  field.onChange(current.filter((v) => v !== val)); // remove id
                } else {
                  field.onChange([...current, val]); // add id
                }
              }}
              disabled={props?.disabled || props?.loading}
            >
              {/* Placeholder */}
              <option disabled value="">
                Select {props?.label ?? "Options"}
              </option>

              {/* Options */}
              {props?.loading ? (
                <option disabled>Loading...</option>
              ) : (
                props?.options?.map((option) => (
                  <option
                    key={option?.id}
                    value={option?.id} // store id
                    disabled={option?.disabled}
                  >
                    {option?.label}
                  </option>
                ))
              )}
            </select>
          </FormControl>
        </div>
      );

    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;
  const { setError } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const required = props.required || false;
        return (
          <FormItem className="flex-1 w-full">
            {props.fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel className="text-sm text-default-600">
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <RenderInput
              field={field}
              props={{ ...props, setError }}
              fieldState={fieldState}
            />
            {/* Display error message */}
            {fieldState.error && (
              <FormMessage className="shad-error">
                {fieldState.error.message}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};
export default CustomFormField;
