import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
    name: PropTypes.string,
};

export default function RHFSelect({ name, items, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    fullWidth
                    value={field.value}
                    error={!!error}
                    helperText={error?.message}
                    {...other}
                    select
                >
                    {items.map(({ key, value }) => {
                        return (
                            <MenuItem key={key} value={value}>{key}</MenuItem>
                        )
                    })}
                </TextField>
            )}
        />
    );
}
