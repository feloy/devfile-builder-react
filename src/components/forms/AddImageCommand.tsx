import { Button, Card, CardActions, CardContent, CardHeader, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import AddImageForm from "./AddImageForm";
import { ImageCommand } from "../../model/imageCommand";
import { Image } from "../../model/image";
import { useEffect, useState } from "react";
import { commandIdPatternRegex } from "./consts";
import { emptyImage } from "../tabs/Images";

export interface ImageCommandToCreate {
    name: string,
    imageCmd: ImageCommand,
    images: Image[]
}

interface Invalid {
    nameField?: boolean
    imageField?: boolean
}

interface FormValue {
    name: string;
    component: string;
}

function AddImageCommand({
    imageNames,
    onCancel,
    onCreate
}: {
    imageNames: string[],
    onCancel: () => void,
    onCreate: (cmd: ImageCommandToCreate) => void
}) {
    const [ commandValue, setCommandValue] = useState<FormValue>({name: "", component: ""});
    const [ showNewImage, setShowNewImage ] = useState(false);
    const [ imageNamesList, setImageNamesList ] = useState(imageNames);
    const [ newImagetoCreate, setNewImageToCreate] = useState<Image | undefined>(undefined);

    // VALIDATION
    const [invalid, setInvalid] = useState<Invalid>({});
    const isInvalid = (): boolean => {
        return Object.keys(invalid).length != 0;
    }
    const computeInvalid = (value: FormValue): Invalid => {
        const inv = {} as Invalid;
        if (!isNameValid(value.name)) {
            inv.nameField = true;
        }
        if (!isImageValid(value.component)) {
            inv.imageField = true;
        }
        return inv;
    }

    useEffect(() => {
        setInvalid(computeInvalid(commandValue));
    }, [commandValue]);

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return commandIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-image-command');
    }

    // Image validation
    const [imageErrorMsg, setImageErrorMsg] = useState('');
    const isImageValid = (v: string): boolean => {
        return v != '' && v != '!';
    }
    const updateImageErrorMsg = (valid: boolean) => {
        setImageErrorMsg(valid ? '' : 'An Image must be selected');
    }

    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...commandValue, name: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const onImageChange = (v: string) => {
        const valid = isImageValid(v)
        updateImageErrorMsg(valid);
        setShowNewImage(v == "!");
        const newValue = {...commandValue, component: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const handleCreate = () => {
        const {name, ...imageCmd} = commandValue;
        const images = [];
        if (newImagetoCreate !== undefined) {
            images.push(newImagetoCreate);
        }
        onCreate({
            name,
            imageCmd,
            images
        });
    }

    // New resource
    const onNewImageCancel = () => {
        setShowNewImage(false);
        const newValue = {...commandValue, component: ''};
        setCommandValue(newValue);
    }

    const onNewImageCreate = (image: Image) => {        
        setNewImageToCreate(image);
        setImageNamesList([...imageNamesList, image.name]);
        onImageChange(image.name);
    }

    return (
        <Card>
            <CardHeader
                title="Add an Image Command"
                subheader="An Image command builds a container image and pushes it to a container registry."
            ></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            placeholder="Unique name to identify the command"
                            value={commandValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                            helperText={nameErrorMsg}
                            error={!!nameErrorMsg}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            fullWidth 
                            error={!!imageErrorMsg}
                        >
                            <InputLabel>Image *</InputLabel>
                            <Select
                                label="Image *"
                                value={commandValue.component}
                                onChange={(e) => onImageChange(e.target.value)}
                                onBlur={(e) => onImageChange(e.target.value)}
                            >
                                {imageNamesList.map(imageName => <MenuItem key={`image-${imageName}`} value={imageName}>{imageName}</MenuItem>)}
                                <MenuItem key="image-!" value="!">(new image)</MenuItem>
                            </Select>
                            <FormHelperText>{imageErrorMsg}</FormHelperText>
                        </FormControl>
                    </Grid>
                    {showNewImage && <Grid item xs={12}>
                        <AddImageForm
                            image={emptyImage}
                            onCancel={() => onNewImageCancel()}
                            onCreate={onNewImageCreate}
                            onSave={() => {}}
                        />
                    </Grid>}
                </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleCreate}>Create</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>    )
}

export default AddImageCommand;
