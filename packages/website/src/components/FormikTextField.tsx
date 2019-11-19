import React from 'react';
import { useField } from 'formik';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type FormikTextFieldProps = TextFieldProps & { name: string };

const FormikTextField: React.FC<FormikTextFieldProps> = ({
  children,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const error = meta.touched ? meta.error : undefined;

  return (
    <TextField error={!!error} helperText={error} {...field} {...props}>
      {children}
    </TextField>
  );
};

export default FormikTextField;
