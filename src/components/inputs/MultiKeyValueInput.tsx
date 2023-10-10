import { Delete } from "@mui/icons-material";
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Env } from "../../model/env";

function MultiKeyValueInput({
    value,
    onChange,
    label,
    keyLabel,
    valueLabel
}: {
    value: Env[],
    onChange: (newValue: Env[]) => void,
    label: string,
    keyLabel: string,
    valueLabel: string
}) {
    const [ values, setValues ] = useState<Env[]>(value ?? []);

    useEffect(() => {
        setValues(value ?? []);
    }, [value]);

    useEffect(() => {
        onChange(values);
    }, [values]);

    const addValue = () => {
        setValues([...values, {name: '', value: ''}]);
    }

    const handleKeyChange = (v: string, i: number) => {
        const a = [...values];
        a[i].name = v;
        setValues(a);
    }

    const handleValueChange = (v: string, i: number) => {
        const a = [...values];
        a[i].value = v;
        setValues(a);
    }

    const handleDelete = (i: number) => {
        const a = [...values];
        a.splice(i, 1);
        setValues(a);
    }

return <>
        {
            values.map((kv, i) => (
                <SingleKeyValueInput
                    key={`keyvalue-${i}`}
                    value={kv} 
                    onKeyChange={(v: string) => {handleKeyChange(v, i)}} 
                    onValueChange={(v: string) => {handleValueChange(v, i)}} 
                    onDelete={() => {handleDelete(i)}}
                    keyLabel={keyLabel}
                    valueLabel={valueLabel}
                    />
                )
        )}
        <Grid item xs={3}>
            <Button onClick={addValue}>Add {label}</Button>
        </Grid>
    </>    
}

function SingleKeyValueInput({
    value,
    onKeyChange,
    onValueChange,
    onDelete,
    keyLabel,
    valueLabel
}: {
    value: Env,
    onKeyChange: (v: string) => void,
    onValueChange: (v: string) => void,
    onDelete: () => void,
    keyLabel: string,
    valueLabel: string
}) {
    const [keyErrorMsg, setKeyErrorMsg] = useState('');

    const isKeyValid = (v: string) => {
        return v != "";        
    }

    const handleKeyChange = (v: string) => {
        setKeyErrorMsg(isKeyValid(v) ? '' : `${keyLabel} cannot be empty`);
        onKeyChange(v);
    }

    const handleValueChange = (v: string) => {
        onValueChange(v);
    }

    return (<>
        <Grid item xs={3}>
            <TextField
                fullWidth
                value={value.name}
                onChange={(e) => handleKeyChange(e.target.value)}
                onBlur={(e) => handleKeyChange(e.target.value)}
                label={keyLabel}
                error={keyErrorMsg != ''}
                helperText={keyErrorMsg}
                />
        </Grid>
        <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel>{valueLabel}</InputLabel>
                <OutlinedInput
                    type='text'
                    value={value.value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onBlur={(e) => handleValueChange(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onDelete}
                                edge="end"
                            ><Delete /></IconButton>
                        </InputAdornment>
                    }
                    label={valueLabel}
                />
            </FormControl>
        </Grid>
    </>)

}

export default MultiKeyValueInput;
