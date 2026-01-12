import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import { memo } from 'react';

interface InputProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'control'> {
  name: FieldPath<T>;
  control: Control<T>;
}

function InputComponent<T extends FieldValues>({ name, control, ...textFieldProps }: InputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={error?.message}
          fullWidth
        />
      )}
    />
  );
}

export const Input = memo(InputComponent) as typeof InputComponent;

