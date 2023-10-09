import { useState } from "react";
import { Container } from "../../model/container"
import { Box } from "@mui/system";
import AddContainer from "../fabs/AddContainer";
import { Button, Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import AddContainerForm from "../forms/AddContainerForm";
import { Volume } from "../../model/volume";

export const emptyContainer: Container = {
    name: '',
    image: '',
    command: [],
    args: [],
    memoryLimit: '',
    memoryRequest: '',
    cpuLimit: '',
    cpuRequest: '',
    volumeMounts: [],
    annotation: {deployment: {}, service: {}},
    endpoints: [],
    env: [],
    configureSources: false,
    mountSources: false,
    sourceMapping: ''
}

function Containers({
    volumesNames,
    containers,
    onDeleteContainer,
    onCreateContainer,
    onSaveContainer,
}: {
    volumesNames: string[],
    containers: Container[]
    onDeleteContainer: (name: string) => void,
    onCreateContainer: (container: Container, volumesToCreate: Volume[]) => Promise<boolean>
    onSaveContainer: (container: Container, volumesToCreate: Volume[]) => Promise<boolean>
}) {
    const [displayForm, setDisplayForm] = useState(false);
    const [editedContainer, setEditedContainer] = useState<Container>(emptyContainer);

    const handleAddContainer = () => {
        setEditedContainer(emptyContainer);
        setDisplayForm(true);
    };
    
    const handleCreateContainer = (container: Container, volumesToCreate: Volume[]) => {
        const result = onCreateContainer(container, volumesToCreate);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleSaveContainer = (container: Container, volumesToCreate: Volume[]) => {
        const result = onSaveContainer(container, volumesToCreate);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleEditContainer = (name: string) => {
        setEditedContainer(getContainerByName(name));
        setDisplayForm(true);
    }

    const getContainerByName = (name: string): Container => {
        const result = containers.filter(c => c.name == name)[0];
        return result;
    }


    return (
        <>
        {!displayForm && <Box sx={{textAlign: "right"}}>
            <AddContainer onAddContainer={handleAddContainer}/>
        </Box>}
        {!displayForm && <ContainersList 
            containers={containers} 
            onDeleteContainer={onDeleteContainer}
            onEditContainer={handleEditContainer}
        />}
        { displayForm && <AddContainerForm
            volumesNames={volumesNames}
            container={editedContainer}
            onCancel={() => setDisplayForm(false) } 
            onCreate={ (container: Container, volumesToCreate: Volume[]) => handleCreateContainer(container, volumesToCreate) }
            onSave={(container: Container, volumesToCreate: Volume[]) => handleSaveContainer(container, volumesToCreate) }
        />}
        </>
    )
}

function ContainersList({
    containers,
    onDeleteContainer,
    onEditContainer
}: {
    containers: Container[],
    onDeleteContainer: (name: string) => void,
    onEditContainer: (name: string) => void
}) {
    const displayContainers = () => {
        return containers.map((container: Container) => {
            return (
                <ListItem key={`container-${container.name}`}>
                    <ListItemText>
                        <ContainerItem
                            container={container}
                            onDeleteContainer={onDeleteContainer}
                            onEditContainer={onEditContainer}
                        />
                    </ListItemText>
                </ListItem>
            )
        })
    }

    return (
        <List>
            {displayContainers()}
        </List> 
    )
}

function ContainerItem({
    container,
    onDeleteContainer,
    onEditContainer
}: {
    container: Container
    onDeleteContainer: (name: string) => void,
    onEditContainer: (name: string) => void
}) {
    return (
        <Card>
            <CardHeader
                title={container.name}
                subheader="Container"
            ></CardHeader>
        <CardContent><pre>{JSON.stringify(container, null, 2)}</pre>
        </CardContent>
        <CardActions>
            <Button color="error" onClick={() => onDeleteContainer(container.name)}>Delete</Button>
            <Button color="primary" onClick={() => onEditContainer(container.name)}>Edit</Button>
        </CardActions>
    </Card>
    )
}

export default Containers
