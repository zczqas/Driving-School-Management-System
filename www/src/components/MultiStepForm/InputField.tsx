import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

interface Props {
  label: string;
  name: string;
  fieldProps?: Partial<TextFieldProps>;
}

const InputField = ({ label, name, fieldProps, ...props }: Props) => {
  const [field, meta] = useField(name);

  const textFieldProps: TextFieldProps = {
    label,
    ...field,
    ...props,
    ...fieldProps,
    error: meta.touched && Boolean(meta.error),
    helperText: meta.touched && meta.error,
  };

  return <TextField fullWidth {...textFieldProps} />;
};

export default InputField;
