import { toTypedSchema } from "@vee-validate/yup";
import { object, string } from "yup";

const yupLoginSchema = object({
  email: string().email("Invalid email address").required(),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required(),
});

export const loginSchema = toTypedSchema(yupLoginSchema);

export const registerSchema = toTypedSchema(
  yupLoginSchema.shape({
    name: string().required(),
  })
);
