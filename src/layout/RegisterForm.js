import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
//formik
import { useFormik, Form, FormikProvider } from "formik";
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

export default function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false);

    const RegisterSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: RegisterSchema,
        onSubmit: (data, { setSubmitting, setErrors }) => {
            //signin(data.email, data.password, setSubmitting, setErrors);
        },
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
        formik;

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    return (
        <FormikProvider value={formik}>
            <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        autoComplete="username"
                        type="name"
                        label="User Name"
                        {...getFieldProps("name")}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                    />

                    <TextField fullWidth
                        autoComplete="email"
                        type="email"
                        label="Email address"
                        {...getFieldProps("email")}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email} />

                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        {...getFieldProps("password")}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Icon
                                            icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />

                    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                        Register
                    </LoadingButton>
                </Stack>
            </Form>
        </FormikProvider>
    );
}