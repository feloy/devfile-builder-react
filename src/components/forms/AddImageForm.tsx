import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { Image } from "../../model/image";
import { useEffect, useState } from "react";
import { componentIdPatternRegex } from "./consts";

interface Invalid {
    nameField?: boolean
    imageNameField?: boolean
    uriField?: boolean
}

function AddImageForm({
    image,
    onCancel,
    onCreate,
    onSave
}: {
    image: Image,
    onCancel: () => void,
    onCreate: (image: Image) => void,
    onSave: (image: Image) => void
}) {
    const [ imageValue, setImageValue] = useState(image);
    const [editing, setEditing] = useState(image.name !== '');

    // VALIDATION
    const [invalid, setInvalid] = useState<Invalid>({});
    const isInvalid = (): boolean => {
        return Object.keys(invalid).length != 0;
    }
    const computeInvalid = (image: Image): Invalid => {
        const inv = {} as Invalid;
        if (!isNameValid(image.name)) {
            inv.nameField = true;
        }
        if (!isUriValid(image.imageName)) {
            inv.imageNameField = true;
        }
        if (!isUriValid(image.uri)) {
            inv.uriField = true;
        }
        return inv;
    }

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return componentIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-image');
    }
    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...imageValue, name: v};
        setInvalid(computeInvalid(newValue));
        setImageValue(newValue);        
    }

    // ImageName validation
    const [imageNameErrorMsg, setImageNameErrorMsg] = useState('');
    const isImageNameValid = (v: string): boolean => {
        return v !== '';
    }
    const updateImageNameErrorMsg = (valid: boolean) => {
        setImageNameErrorMsg(valid ? '' : 'Image Name is required');
    }
    const onImageNameChange = (v: string) => {
        const valid = isImageNameValid(v)
        updateImageNameErrorMsg(valid);
        const newValue = {...imageValue, imageName: v};
        setInvalid(computeInvalid(newValue));
        setImageValue(newValue);        
    }

    // URI validation
    const [uriErrorMsg, setUriErrorMsg] = useState('');
    const isUriValid = (v: string): boolean => {
        return v !== '';
    }
    const updateUriErrorMsg = (valid: boolean) => {
        setUriErrorMsg(valid ? '' : 'Dockerfile URI is required');
    }
    const onUriChange = (v: string) => {
        const valid = isUriValid(v)
        updateUriErrorMsg(valid);
        const newValue = {...imageValue, uri: v};
        setInvalid(computeInvalid(newValue));
        setImageValue(newValue);
    }

    const onBuildContextChange = (v: string) => {
        const newValue = {...imageValue, buildContext: v};
        setImageValue(newValue);
    }

    const onRootRequiredChange = (checked: boolean) => {
        const newValue = {...imageValue, rootRequired: checked};
        setImageValue(newValue);
    }

    const handleClick = () => {
        if (editing) {
            onSave(imageValue);
        } else {
            onCreate(imageValue);
        }
    }

    const resetValidation = (image: Image) => {
        setNameErrorMsg('');
        setInvalid(computeInvalid(image));
    }

    useEffect(() => {
        setImageValue(image);
        setEditing(image.name != '');
        resetValidation(image);
    }, [image]);

    return <Card>
    <CardHeader
        title={editing ? `Edit the image "${image.name}"` : 'Add an Image'}
        subheader="An Image defines how to build a container image."
    ></CardHeader>
    <CardContent>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    required
                    label="Name" fullWidth
                    disabled={editing}
                    placeholder="Unique name to identify the image"
                    value={imageValue.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    onBlur={(e) => onNameChange(e.target.value)}
                    helperText={nameErrorMsg}
                    error={!!nameErrorMsg}        
                />
            </Grid>
            <Grid item xs={6}>
                <FormControl>
                    <FormLabel>Build at startup</FormLabel>
                    <RadioGroup row 
                        value={imageValue.autoBuild}
                        onChange={(e) => setImageValue({...imageValue, autoBuild: e.target.value as Image.AutoBuildEnum })}>
                        <FormControlLabel value="never" control={<Radio />} label="Never" />
                        <FormControlLabel value="undefined" control={<Radio />} label="If Orphan" />
                        <FormControlLabel value="always" control={<Radio />} label="Always" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    label="Image Name" fullWidth
                    placeholder="Reference to a container image"
                    value={imageValue.imageName}
                    onChange={(e) => onImageNameChange(e.target.value)}
                    onBlur={(e) => onImageNameChange(e.target.value)}
                    helperText={imageNameErrorMsg}
                    error={!!imageNameErrorMsg}        
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    required
                    label="Dockerfile URI" fullWidth
                    placeholder="Dockerfile used to build the image"
                    value={imageValue.uri}
                    onChange={(e) => onUriChange(e.target.value)}
                    onBlur={(e) => onUriChange(e.target.value)}
                    helperText={uriErrorMsg}
                    error={!!uriErrorMsg}        
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Build Context" fullWidth
                    placeholder="Directory from which the build will be executed"
                    value={imageValue.buildContext}
                    onChange={(e) => onBuildContextChange(e.target.value)}
                    onBlur={(e) => onBuildContextChange(e.target.value)}
                />
            </Grid>
            {/* TODO(feloy) Build Args */}
            <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Root Required"
                    checked={imageValue.rootRequired}
                    onChange={(_, checked: boolean) => onRootRequiredChange(checked)}
                />
            </Grid>
        </Grid>
    </CardContent>
    <CardActions>
        <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleClick}>{editing ? "Save" : "Create" }</Button>
        <Button onClick={onCancel}>Cancel</Button>
    </CardActions>
</Card>
}

export default AddImageForm;
