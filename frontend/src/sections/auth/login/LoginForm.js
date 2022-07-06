import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
// auth
import AuthService from "../../../services/auth";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const LoginSchema = Yup.object().shape({
    account: Yup.string().required('請輸入帳號!'),
    password: Yup.string().required('請輸入密碼!'),
  });

  const defaultValues = {
    account: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await AuthService.login(data.account, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.response !== undefined) {
        if (err.response.data !== undefined) {
          const errors = err.response.data.errors;
          let errorsMessage = "";
          for (const key in errors) {
            errorsMessage += `${errors[key]}\n` ;
          }
          setError(errorsMessage);
        }
      } else {
        console.log("login error", err);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <Stack spacing={3}>
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
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ my: 2 }}>
        Login
      </LoadingButton>
      {error && <div className="error">{error}</div>}
    </FormProvider>
  );
}
