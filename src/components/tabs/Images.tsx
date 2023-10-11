import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, List, ListItem, ListItemText, Typography } from "@mui/material"
import { Image } from "../../model/image"
import { useState } from "react";
import AddImage from "../fabs/AddImage";
import AddImageForm from "../forms/AddImageForm";

export const emptyImage: Image = {
    name: '',
    args: [],
    autoBuild: "undefined",
    buildContext: '',
    imageName: '',
    orphan: false,
    rootRequired: false,
    uri: ''
}

function Images({
    images,
    onDeleteImage,
    onCreateImage,
    onSaveImage,
}: {
    images: Image[],
    onDeleteImage: (name: string) => void,
    onCreateImage: (image: Image) => Promise<boolean>,
    onSaveImage: (image: Image) => Promise<boolean>
}) {
    const [displayForm, setDisplayForm] = useState(false);
    const [editedImage, setEditedImage] = useState<Image>(emptyImage);

    const handleAddImage = () => {
        setEditedImage(emptyImage);
        setDisplayForm(true);
    };
    
    const handleCreateImage = (image: Image) => {
        const result = onCreateImage(image);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleSaveImage = (image: Image) => {
        const result = onSaveImage(image);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleEditImage = (name: string) => {
        setEditedImage(getImageByName(name));
        setDisplayForm(true);
    }

    const getImageByName = (name: string): Image => {
        return images.filter(r => r.name == name)[0];
    }

    return <>
        {!displayForm && <Box sx={{textAlign: "right"}}>
            <AddImage onAddImage={handleAddImage}/>
        </Box>}
        {!displayForm && <ImagesList 
            images={images} 
            onDeleteImage={onDeleteImage}
            onEditImage={handleEditImage}
        />}
        {displayForm && <AddImageForm
            image={editedImage}
            onCancel={() => setDisplayForm(false) } 
            onCreate={ (image: Image) => handleCreateImage(image) } 
            onSave={(image: Image) => handleSaveImage(image) }
        />}
    </>
}

function ImagesList({
    images,
    onDeleteImage,
    onEditImage
}: {
    images: Image[],
    onDeleteImage: (name: string) => void,
    onEditImage: (name: string) => void
}) {
    const displayImages = () => {
        return images.map((image: Image) => {
            return (
                <ListItem key={`image-${image.name}`}>
                    <ListItemText>
                        <ImageItem
                            image={image}
                            onDeleteImage={onDeleteImage}
                            onEditImage={onEditImage}
                        />
                    </ListItemText>
                </ListItem>
            )
        })
    }

    return (
        <List>
            {displayImages()}
        </List> 
    )
}

function ImageItem({
    image,
    onDeleteImage,
    onEditImage
}: {
    image: Image,
    onDeleteImage: (name: string) => void,
    onEditImage: (name: string) => void
}) {
    return (
        <Card>
            <CardHeader
                title={image.name}
                subheader="Image"
            ></CardHeader>
        <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="caption" component="div">Build at Startup</Typography>
                    {image.autoBuild == 'always' && <div>Yes, forced</div>}
                    {image.autoBuild == 'undefined' && image.orphan && <div>Yes, the image is not referenced by any command</div>}
                    {image.autoBuild == 'undefined' && !image.orphan && <div>No, the image is referenced by a command</div>}
                    {image.autoBuild == 'never' && <div>No, disabled</div>}
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" component="div">Image Name</Typography>
                    <code>{image.imageName}</code>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" component="div">Dockerfile URI</Typography>
                    <code>{image.uri}</code>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" component="div">Build Context</Typography>
                    <code>{image.buildContext}</code>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" component="div">Root Required</Typography>
                    <code>{image.rootRequired ? 'Yes' : 'No'}</code>
                </Grid>
                {
                    image.args?.length > 0 && <DisplayArgs args={image.args}></DisplayArgs>
                }
            </Grid>

        </CardContent>
        <CardActions>
            <Button color="error" onClick={() => onDeleteImage(image.name)}>Delete</Button>
            <Button color="primary" onClick={() => onEditImage(image.name)}>Edit</Button>
        </CardActions>
    </Card>
    )
}

function DisplayArgs({args}: {args: string[]}) {
    return (
        <Grid item xs={8}>
            <Typography variant="caption" component="div">Build Args</Typography>
            {args.map((arg, i) => <div key={`arg-${i}`}>{arg}</div>)}
        </Grid>
    )
}
export default Images;
