import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { useEffect, useState } from 'react';
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import { db } from 'config/firebase';

const roles = ['Enable', 'Disable'];
const accessTypes = ['Basic Survey', 'Optional Survey', 'Users', 'Roles'];

export default function NewUserForm({ setEmpList, handleClickClose, role }) {
  const { t, i18n } = useTranslation();
  const { firebaseRegister, resetPassword } = useAuth();
  const scriptedRef = useScriptRef();

  return (
    <>
      <DialogContent>
        <Formik
          initialValues={{
            roleName: role?.roleName || '',
            roleStatus: role?.roleStatus || 'Enable',
            permissions: role?.permissions || {
              'Basic Survey': { view: false, add: false, edit: false, delete: false, viewCreatedByThem: false },
              'Optional Survey': { view: false, add: false, edit: false, delete: false, viewCreatedByThem: false },
              Users: { view: false, add: false, edit: false, delete: false, viewCreatedByThem: false },
              Roles: { view: false, add: false, edit: false, delete: false, viewCreatedByThem: false }
            },
            submit: null
          }}
          validationSchema={Yup.object().shape({
            roleName: Yup.string().required('Role Name is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (role) {
                // logic for edit existing role in firestore
                const roleDocRef = doc(db, 'roles', role.id);
                await updateDoc(roleDocRef, {
                  roleName: values.roleName,
                  roleStatus: values.roleStatus,
                  permissions: values.permissions
                });
                setEmpList((prevEmpList) =>
                  prevEmpList.map((item) =>
                    item.id === role.id ? { id: role.id, ...values } : item
                  )
                );
              } else {
                // logic for create new role in firestore
                const newRoleRef = await addDoc(collection(db, 'roles'), {
                  roleName: values.roleName,
                  roleStatus: values.roleStatus,
                  permissions: values.permissions
                });
                // console.log('New role added: ', newRoleRef);
                // Update the empList in the parent component
                setEmpList((prevEmpList) => [ { id: newRoleRef.id, ...values }, ...prevEmpList]);
              }

              setStatus({ success: true });
              setSubmitting(false);
              handleClickClose();
            } catch (err) {
              console.error(err);
              if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-signup">Role Name*</InputLabel>
                    <OutlinedInput
                      id="firstname-login"
                      type="roleName"
                      value={values.roleName}
                      name="roleName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="John"
                      fullWidth
                      error={Boolean(touched.roleName && errors.roleName)}
                    />
                  </Stack>
                  {touched.roleName && errors.roleName && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.roleName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="role-signup">Role Status*</InputLabel>
                    <FormControl fullWidth error={Boolean(touched.roleStatus && errors.roleStatus)}>
                      <Select
                        id="role-signup"
                        value={values.roleStatus}
                        name="roleStatus"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select Role Status</em>
                        </MenuItem>
                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {touched.role && errors.role && (
                      <FormHelperText error id="helper-text-role-signup">
                        {errors.role}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Access</TableCell>
                        <TableCell align="center">View</TableCell>
                        <TableCell align="center">Add</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                        <TableCell align="center">View Enter by them</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accessTypes.map((accessType) => (
                        <TableRow key={accessType}>
                          <TableCell component="th" scope="row">
                            {accessType}
                          </TableCell>
                          {['view', 'add', 'edit', 'delete', 'viewCreatedByThem'].map((permissionType) => (
                            <TableCell key={permissionType} align="center">
                              <Checkbox
                                checked={values.permissions[accessType][permissionType]}
                                onChange={(e) => setFieldValue(`permissions.${accessType}.${permissionType}`, e.target.checked)}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <DialogActions>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        {role ? t('Edit Role') : t('Create Role')}
                      </Button>
                    </AnimateButton>
                  </DialogActions>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </DialogContent>
    </>
  );
}