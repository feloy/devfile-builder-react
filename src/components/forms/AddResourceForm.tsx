import { Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { Resource } from "../../model/resource";
import { useEffect, useState } from "react";
import { componentIdPatternRegex } from "./consts";

interface Invalid {
    nameField?: boolean
    uriField?: boolean
    inlinedField?: boolean
}

function AddResourceForm({
    resource,
    onCancel,
    onCreate,
    onSave
}: {
    resource: Resource,
    onCancel: () => void,
    onCreate: (resource: Resource) => void,
    onSave: (resource: Resource) => void
}) {
    const [ resourceValue, setResourceValue] = useState(resource);
    const [ useUri, setUseUri ] = useState(true);
    const [editing, setEditing] = useState(resource.name !== '');
    
    // VALIDATION
    const [invalid, setInvalid] = useState<Invalid>({});
    const isInvalid = (): boolean => {
        return Object.keys(invalid).length != 0;
    }

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return componentIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-resource');
    }
    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...resourceValue, name: v};
        setInvalid(computeInvalid(newValue));
        setResourceValue(newValue);        
    }

    // uri validation
    const [uriErrorMsg, setUriErrorMsg] = useState('');
    const isUriValid = (v: string): boolean => {
        return !useUri || v != "";
    }
    const updateUriErrorMsg = (valid: boolean) => {
        setUriErrorMsg(valid ? ''  : 'URI is required');
    }
    const onUriChange = (v: string) => {
        const valid = isUriValid(v)
        updateUriErrorMsg(valid);
        const newValue = {...resourceValue, uri: v};
        setInvalid(computeInvalid(newValue));
        setResourceValue(newValue);
    }

    // inlined validation
    const [inlinedErrorMsg, setInlinedErrorMsg] = useState('');
    const isInlinedValid = (v: string): boolean => {
        return useUri || v != "";
    }
    const updateInlinedErrorMsg = (valid: boolean) => {
        setInlinedErrorMsg(valid ? '' : 'Inlined content is required');
    }
    const onInlinedChange = (v: string) => {
        const valid = isInlinedValid(v)
        updateInlinedErrorMsg(valid);
        const newValue = {...resourceValue, inlined: v};
        setInvalid(computeInvalid(newValue));
        setResourceValue(newValue);
    }

    // Reset validation
    const computeInvalid = (resource: Resource): Invalid => {
        const inv = {} as Invalid;
        if (!isNameValid(resource.name)) {
            inv.nameField = true;
        }
        if (!isUriValid(resource.uri ?? '')) {
            inv.uriField = true;
        }
        if (!isInlinedValid(resource.inlined ?? '')) {
            inv.inlinedField = true;
        }
        return inv;
    }

    const resetValidation = (resource: Resource) => {
        setNameErrorMsg('');
        setUriErrorMsg('');
        setInlinedErrorMsg('');
        setInvalid(computeInvalid(resource));
    }

    useEffect(() => {
        setResourceValue(resource);
        setUseUri(resource.inlined == "");
        setEditing(resource.name != '');
        resetValidation(resource);
    }, [resource]);

    useEffect(() => {
        setInvalid(computeInvalid(resourceValue));
    }, [useUri]);

    const handleClick = () => {
        if (useUri) {
            resourceValue.inlined = '';
        } else {
            resourceValue.uri = '';
        }
        if (editing) {
            onSave(resourceValue);
        } else {
            onCreate(resourceValue);
        }
    }
    
    return (
        <Card>
            <CardHeader
                title={editing ? `Edit the resource "${resource.name}"` : 'Add a Resource'}
                subheader="A Resource defines a Kubernetes resource. Its definition can be given either by a URI pointing to a manifest file or by an inlined YAML manifest."
            ></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            disabled={editing}
                            placeholder="Unique name to identify the resource"
                            value={resourceValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                            helperText={nameErrorMsg}
                            error={!!nameErrorMsg}        
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Deploy at startup</FormLabel>
                            <RadioGroup row 
                                value={resourceValue.deployByDefault}
                                onChange={(e) => setResourceValue({...resourceValue, deployByDefault: e.target.value as Resource.DeployByDefaultEnum })}>
                                <FormControlLabel value="never" control={<Radio />} label="Never" />
                                <FormControlLabel value="undefined" control={<Radio />} label="If Orphan" />
                                <FormControlLabel value="always" control={<Radio />} label="Always" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Definition</FormLabel>
                            <RadioGroup row 
                                value={useUri ? "uri" : "inlined"}
                                onChange={(e) => setUseUri(e.target.value == 'uri')}>
                                <FormControlLabel value="uri" control={<Radio />} label="Specify URI" />
                                <FormControlLabel value="inlined" control={<Radio />} label="Inlined Content" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid hidden={!useUri} item xs={12}>
                        <TextField
                                label="URI *" fullWidth
                                placeholder="Reference to a YAML manifest"
                                value={resourceValue.uri}
                                onChange={(e) => onUriChange(e.target.value)}
                                onBlur={(e) => onUriChange(e.target.value)}
                                helperText={uriErrorMsg}
                                error={!!uriErrorMsg}        
                                />
                    </Grid>
                    <Grid hidden={useUri} item xs={12}>
                        <TextField
                                label="YAML manifest *" fullWidth multiline minRows={3} maxRows={7}
                                value={resourceValue.inlined}
                                onChange={(e) => onInlinedChange(e.target.value)}
                                onBlur={(e) => onInlinedChange(e.target.value)}
                                helperText={inlinedErrorMsg}
                                error={!!inlinedErrorMsg}        
                            />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleClick}>{editing ? "Save" : "Create" }</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddResourceForm;
