import { Box, Button, Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import { Volume } from "../../model/volume";
import AddVolume from "../fabs/AddVolume";
import AddVolumeForm from "../forms/AddVolumeForm";

export const emptyVolume: Volume = {
    name: '',
    ephemeral: false,
    size: ''
}

function Volumes({
    volumes,
    onDeleteVolume,
    onCreateVolume,
    onSaveVolume,
}: {
    volumes: Volume[],
    onDeleteVolume: (name: string) => void,
    onCreateVolume: (volume: Volume) => Promise<boolean>
    onSaveVolume: (volume: Volume) => Promise<boolean>
}) {
    const [displayForm, setDisplayForm] = useState(false);
    const [editedVolume, setEditedVolume] = useState<Volume>(emptyVolume);

    const handleAddVolume = () => {
        setEditedVolume(emptyVolume);
        setDisplayForm(true);
    };
    
    const handleCreateVolume = (volume: Volume) => {
        const result = onCreateVolume(volume);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleSaveVolume = (volume: Volume) => {
        const result = onSaveVolume(volume);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleEditVolume = (name: string) => {
        setEditedVolume(getVolumeByName(name));
        setDisplayForm(true);
    }

    const getVolumeByName = (name: string): Volume => {
        const result = volumes.filter(r => r.name == name)[0];
        return result;
    }

    return <>
        {!displayForm && <Box sx={{textAlign: "right"}}>
            <AddVolume onAddVolume={handleAddVolume}/>
        </Box>}
        {!displayForm && <VolumesList 
            volumes={volumes} 
            onDeleteVolume={onDeleteVolume}
            onEditVolume={handleEditVolume}
        />}
        { displayForm && <AddVolumeForm
            volume={editedVolume}
            onCancel={() => setDisplayForm(false) } 
            onCreate={ (volume: Volume) => handleCreateVolume(volume) } 
            onSave={(volume: Volume) => handleSaveVolume(volume) }
        />}
    </>
}

function VolumesList({
    volumes,
    onDeleteVolume,
    onEditVolume
}: {
    volumes: Volume[],
    onDeleteVolume: (name: string) => void,
    onEditVolume: (name: string) => void
}) {
    const displayVolumes = () => {
        return volumes.map((volume: Volume) => {
            return (
                <ListItem key={`volume-${volume.name}`}>
                    <ListItemText>
                        <VolumeItem
                            volume={volume}
                            onDeleteVolume={onDeleteVolume}
                            onEditVolume={onEditVolume}
                        />
                    </ListItemText>
                </ListItem>
            )
        })
    }

    return (
        <List>
            {displayVolumes()}
        </List> 
    )
}

function VolumeItem({
    volume,
    onDeleteVolume,
    onEditVolume
}: {
    volume: Volume
    onDeleteVolume: (name: string) => void,
    onEditVolume: (name: string) => void
}) {
    return (
        <Card>
            <CardHeader
                title={volume.name}
                subheader="Volume"
            ></CardHeader>
        <CardContent><pre>{JSON.stringify(volume, null, 2)}</pre>
        </CardContent>
        <CardActions>
            <Button color="error" onClick={() => onDeleteVolume(volume.name)}>Delete</Button>
            <Button color="primary" onClick={() => onEditVolume(volume.name)}>Edit</Button>
        </CardActions>
    </Card>
    )
}

export default Volumes;
