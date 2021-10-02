import React from 'react'
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({ name, label, type, maxlength = null, minlength = null }) => {
    const {control} = useFormContext()
    // console.log("maxlenght: ", maxlength, " minlenght: ",minlength, " type: ",type)

    return (
        <Grid item xs={12} sm={6} >
            <Controller
            name={name}
            control={control}
            defaultValue=""
            rules={ 
                type === 'text' ? {required: ' is required', pattern: {value: /[A-Za-z]/, message: 'input a valid text'}, minLength : {value: minlength, message: `min length is ${minlength}` }, maxLength : {value: maxlength, message: `max length is ${maxlength}` } } 
                : type === 'email' ? {required: ' is required'} :{required: ' is required', minLength : {value: minlength, message: `the min length is ${minlength}`}, maxLength: {value: maxlength, message: `the max length is ${maxlength}`} } }
            render={({
                field,
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <TextField
                    label={label}
                    type={type === 'text' ? '' : `${type}`}
                    fullWidth
                    variant="outlined" 
                    {...field}
                    error={error}
                    helperText={error && `${label} ${error.message}`}
                />
            )}
            />
        </Grid>
    )
}

export default FormInput
