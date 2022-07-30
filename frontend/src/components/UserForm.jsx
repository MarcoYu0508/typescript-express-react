import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField, RHFSelect } from './hook-form';

import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Iconify from './Iconify';

export default function UserForm({ intent, onSubmit, creatingUser, newUser, updateUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const UserSchema = () => {
    if (intent === "Update") {
      return Yup.object().shape({
        name: Yup.string().required('請輸入名稱!'),
        account: Yup.string().required('請輸入帳號!'),
        password: Yup.string(),
        role: Yup.number().required('請選擇角色').typeError("請選擇角色")
      });
    } else {
      return Yup.object().shape({
        name: Yup.string().required('請輸入名稱!'),
        account: Yup.string().required('請輸入帳號!'),
        password: Yup.string().required('請輸入密碼!'),
        role: Yup.number().required('請選擇角色').typeError("請選擇角色")
      });
    }
  }

  const defaultValues = () => {
    if (intent === "Create") {
      return {
        name: newUser.name ? newUser.name : '',
        account: newUser.account ? newUser.account : '',
        password: newUser.password ? newUser.password : '',
        role: newUser.role >= 0 ? newUser.role : '',
      };
    } else if (intent === "Update") {
      return {
        name: updateUser.name ? updateUser.name : '',
        account: updateUser.account ? updateUser.account : '',
        password: '',
        role: updateUser.role >= 0 ? updateUser.role : '',
      };
    } else {
      return {
        name: "",
        account: "",
        password: "",
        role: "",
      }
    }
  }

  const methods = useForm({
    resolver: yupResolver(UserSchema()),
    defaultValues: defaultValues(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch
  } = methods;

  const submit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if (intent === "Create") {
      const subscription = watch((data) => creatingUser(data));
      return () => subscription.unsubscribe();
    }
  }, [creatingUser, intent, watch]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(submit)} >
      <Stack spacing={3}>
        <RHFTextField name="name" label="名稱" />
        <RHFTextField name="account" label="帳號" />

        <RHFTextField
          name="password"
          label="密碼"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFSelect name="role" label="角色" items={[
          { key: "Developer", value: 0 },
          { key: "Admin", value: 1 },
          { key: "Normal", value: 2 }
        ]} />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ my: 2 }}>
        {intent}
      </LoadingButton>
      {error && <div className="error">{error}</div>}
    </FormProvider>
  );
}