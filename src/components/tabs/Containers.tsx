import { useState } from "react";
import { Container } from "../../model/container"
import { Box } from "@mui/system";
import AddContainer from "../fabs/AddContainer";
import { Button, Card, CardActions, CardContent, CardHeader, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
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
        <CardContent>
            <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid item xs={12}>
                    <Typography variant="caption" component="div">Image</Typography>
                    <code>{container.image}</code>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" component="div">Command / Args</Typography>
                    <code>{container.command?.join(' ')}{container.args?.join(' ')}</code>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" component="div">Environment Variables</Typography>
                    {container.env?.map((env, i) => <div key={`env-${i}`}><code>{env.name}={env.value}</code></div>)}
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" component="div">Volume Mounts</Typography>
                    {container.volumeMounts?.map((vm, i) => <div key={`vm-${i}`}><code>{vm.name} in {vm.path}</code></div>)}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" component="div">Endpoints</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Target port</TableCell>
                                <TableCell>Exposure</TableCell>
                                <TableCell>Path</TableCell>
                                <TableCell>Protocol</TableCell>
                                <TableCell>Secure</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                container.endpoints.map((endpoint, i) => <TableRow key={`endpoint-${i}`}>
                                    <TableCell>{endpoint.name}</TableCell>
                                    <TableCell>{endpoint.targetPort}</TableCell>
                                    <TableCell>{endpoint.exposure}</TableCell>
                                    <TableCell>{endpoint.path}</TableCell>
                                    <TableCell>{endpoint.protocol}</TableCell>
                                    <TableCell>{endpoint.secure ? 'Yes' : 'No'}</TableCell>
                                </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </Grid>

                <Grid item xs={3}>
                    <Typography variant="caption" component="div">Memory Request</Typography>
                    <code>{container.memoryRequest}</code>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption" component="div">Memory Limit</Typography>
                    <code>{container.memoryLimit}</code>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption" component="div">CPU Request</Typography>
                    <code>{container.cpuRequest}</code>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="caption" component="div">CPU Limit</Typography>
                    <code>{container.cpuLimit}</code>
                </Grid>
                {container.configureSources && <>
                    <Grid item xs={6}>
                        <Typography variant="caption" component="div">Mount Sources</Typography>
                        <code>{container.mountSources ? 'Yes' : 'No'}</code>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" component="div">Mount Sources Into</Typography>
                        <code>{container.sourceMapping}</code>
                    </Grid>
                </>}
                <Grid item xs={6}>
                    <Typography variant="caption" component="div">Deployment Annotations</Typography>
                    {container.annotation.deployment && Object.keys(container.annotation.deployment)?.map((anno, i) => <div key={`dep-${i}`}><code>{anno}: {container.annotation.deployment[anno]}</code></div>)}
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" component="div">Service Annotations</Typography>
                    {container.annotation.service && Object.keys(container.annotation.service)?.map((anno, i) => <div key={`svc-${i}`}><code>{anno}: {container.annotation.service[anno]}</code></div>)}
                </Grid>
            </Grid>
        </CardContent>
        <CardActions>
            <Button color="error" onClick={() => onDeleteContainer(container.name)}>Delete</Button>
            <Button color="primary" onClick={() => onEditContainer(container.name)}>Edit</Button>
        </CardActions>
    </Card>
    )
}

export default Containers
