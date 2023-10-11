import { useEffect, useState } from "react";
import { Endpoint } from "../../model/endpoint";
import { Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { endpointNamePatternRegex } from "../forms/consts";
import { Delete } from "@mui/icons-material";

const emptyEndpoint: Endpoint = {
    name: '',
    targetPort: 0,
    exposure: '' as Endpoint.ExposureEnum,
    path: '',
    protocol: '' as Endpoint.ProtocolEnum,
    secure: false
    }

function MultiEndpoint({
    value,
    onChange
}: {
    value: Endpoint[],
    onChange: (endpoints: Endpoint[]) => void
}) {
    const [ values, setValues ] = useState<Endpoint[]>(value);

    useEffect(() => {
        onChange(values);
    }, [values]);

    const addValue = () => {
        setValues([...values, emptyEndpoint]);
    }

    const handleChange = (v: Endpoint, i: number) => {
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
            values.map((value, i) => {
                return (
                    <Grid key={`endpoint-${i}`} item container xs={12} spacing={2}>
                        <SingleEndpoint
                            value={value}
                            onChange={(v: Endpoint) => {handleChange(v, i)}}
                            onDelete={() => {handleDelete(i)}}
                        />
                    </Grid>
                )
            })
        }
        <Grid item xs={3}>
            <Button onClick={addValue}>Add Endpoint</Button>
        </Grid>
    </>
}

const isNameValid = (v: string): boolean => {
    return v.length <= 15 && endpointNamePatternRegex.test(v);
}

const isTargetPortValid = (v: number): boolean => {
    return v > 0;
}

export const isEndpointValid = (endpoint: Endpoint) => {
    return (isNameValid(endpoint.name) && isTargetPortValid(endpoint.targetPort));
}

function SingleEndpoint({
    value,
    onChange,
    onDelete
}: {
    value: Endpoint,
    onChange: (v: Endpoint) => void,
    onDelete: () => void
}) {
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-endpoint');
    }
    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        value = {...value, name: v};
        onChange(value);
    }

    const [targetPortErrorMsg, setTargetPortErrorMsg] = useState('');
    const updateTargetPortErrorMsg = (valid: boolean) => {
        setTargetPortErrorMsg(valid ? '' : 'Target Port must be positive');
    }
    const onTargetPortChange = (v: string) => {
        const valid = isTargetPortValid(Number(v))
        updateTargetPortErrorMsg(valid);
        value = {...value, targetPort: Number(v)};
        onChange(value);
    }

    const onExposureChange = (v: string) => {
        value = {...value, exposure: v as Endpoint.ExposureEnum};
        onChange(value);
    }

    const onPathChange = (v: string) => {
        value = {...value, path: v};
        onChange(value);
    }

    const onProtocolChange = (v: string) => {
        value = {...value, protocol: v as Endpoint.ProtocolEnum};
        onChange(value);
    }

    const onSecureChange = (c: boolean) => {
        value = {...value, secure: c};
        onChange(value);
    }

    return <>
       <Grid item xs={6}>
           <FormControl variant="outlined" fullWidth>
                <InputLabel>Name *</InputLabel>
                <OutlinedInput
                    type='text'
                    value={value.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    onBlur={(e) => onNameChange(e.target.value)}
                    error={!!nameErrorMsg}        
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onDelete}
                                edge="end"
                            ><Delete /></IconButton>
                        </InputAdornment>
                    }
                    label="Name *"
                />
                <FormHelperText>{nameErrorMsg}</FormHelperText>
            </FormControl>
       </Grid>
       <Grid item xs={3}>
           <TextField
                type="number"
                label="Target Port *" fullWidth
                value={value.targetPort}
                onChange={(e) => onTargetPortChange(e.target.value)}
                onBlur={(e) => onTargetPortChange(e.target.value)}
                helperText={targetPortErrorMsg}
                error={!!targetPortErrorMsg}
           />
        </Grid>
        <Grid item xs={3}>
            <FormControl fullWidth>
                <InputLabel>Exposure</InputLabel>
                <Select
                    label="Exposure"
                    value={value.exposure ?? ''}
                    onChange={(e) => onExposureChange(e.target.value)}
                    onBlur={(e) => onExposureChange(e.target.value)}
                >
                    <MenuItem key="default" value="">(default, public)</MenuItem>
                    {
                        ["public", "internal", "none"].map(v => {
                            return <MenuItem key={v} value={v}>{v}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
           <TextField
                label="Path" fullWidth
                value={value.path}
                onChange={(e) => onPathChange(e.target.value)}
                onBlur={(e) => onPathChange(e.target.value)}
           />
        </Grid>
        <Grid item xs={3}>
            <FormControl fullWidth>
                <InputLabel>Protocol</InputLabel>
                <Select
                    label="Protocol"
                    value={value.protocol ?? ''}
                    onChange={(e) => onProtocolChange(e.target.value)}
                    onBlur={(e) => onProtocolChange(e.target.value)}
                >
                    <MenuItem key="default" value="">(default, http)</MenuItem>
                    {
                        ["http", "https", "ws", "wss", "tcp", "udp"].map(v => {
                            return <MenuItem key={v} value={v}>{v}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={3}>
            <FormControlLabel
                control={<Checkbox />}
                label="Protocol is Secure"
                checked={value.secure}
                onChange={(_, checked: boolean) => onSecureChange(checked)}
            />
        </Grid>
    </>
}

export default MultiEndpoint;
