import React from "react"
import { Control, Controller, FieldPath } from "react-hook-form"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { z } from "zod"
import { Field, FieldContent, FieldError, FieldLabel } from "./ui/field"
const authFormSchema = (type: string) =>
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: type === "sign-up" ? z.string().optional() : z.string().min(3),
    lastName: type === "sign-up" ? z.string().optional() : z.string().min(3),
    address1:
      type === "sign-up" ? z.string().optional() : z.string().min(5).max(50),
    dateOfBirth: type === "sign-up" ? z.string().optional() : z.string().min(3),
    state:
      type === "sign-up" ? z.string().optional() : z.string().min(2).max(2),
    postalCode:
      type === "sign-up" ? z.string().optional() : z.string().min(3).max(6),
      city:
            type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    ssn: type === "sign-up" ? z.string().optional() : z.string().min(3),
  })
const formSchema = authFormSchema("sign-up")
interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>
  name: FieldPath<z.infer<typeof formSchema>>
  placeholder: string
  label: string
  type: string
}

const CustomInput = ({
  control,
  name,
  placeholder,
  label,
  type,
}: CustomInputProps) => {
  return (
    <Field>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <div className="form-item">
            <FieldLabel className="form-label">
              {label}
            </FieldLabel>
            <FieldContent>
              <Input
                type={type}
                className="input-class"
                {...field}
                placeholder={placeholder}
              />
            </FieldContent>
            {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
            )}
          </div>
        )}
      />
    </Field>
  )
}
export default CustomInput
