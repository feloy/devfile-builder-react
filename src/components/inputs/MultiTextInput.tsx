import { Delete } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";

function MultiTextInput({
    value,
    onChange,
    label
}: {
    value: string[],
    onChange: (newValue: string[]) => void,
    label: string
}) {
    const [ values, setValues ] = useState(value ?? []);

    useEffect(() => {
        setValues(value ?? []);
    }, [value]);

    useEffect(() => {
        onChange(values);
    }, [values]);

    const addValue = () => {
        setValues([...values, '']);
    }

    const handleChange = (v: string, i: number) => {
        const a = [...values];
        a[i] = v;
        setValues(a);
    }

    const handleDelete = (i: number) => {
        const a = [...values];
        a.splice(i, 1);
        setValues(a);
    }

return <>
        {
            values.map((arg, i) => (
                <Grid item xs={3} key={`value-${i}`}>
                    <SingleTextInput
                        value={arg} 
                        onChange={(v: string) => {handleChange(v, i)}} 
                        onDelete={() => {handleDelete(i)}}
                        label={label}></SingleTextInput>
                </Grid>
                )
        )}
        <Grid item xs={3}>
            <Button onClick={addValue}>Add {label}</Button>
        </Grid>
    </>    
}

function SingleTextInput({
    value,
    onChange,
    onDelete,
    label
}: {
    value: string,
    onChange: (v: string) => void,
    onDelete: () => void,
    label: string
}) {
    const [errorMsg, setErrorMsg] = useState('');

    const isValid = (v: string) => {
        return v != "";        
    }

    const handleChange = (v: string) => {
        setErrorMsg(isValid(v) ? '' : `${label} cannot be empty`);
        onChange(v);
    }

    return (
        <FormControl variant="outlined">
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                type='text'
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => handleChange(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={onDelete}
                            edge="end"
                        ><Delete /></IconButton>
                    </InputAdornment>
                }
                label={label}
                error={errorMsg != ''}
            />
            {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
        </FormControl>
    )

}

export default MultiTextInput;
