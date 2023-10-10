import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { componentIdPatternRegex } from "./consts";
import { Container } from "../../model/container";
import MultiTextInput from "../inputs/MultiTextInput";
import MultiKeyValueInput, { KeyValue } from "../inputs/MultiKeyValueInput";
import { Env } from "../../model/env";
import MultiVolumeMount from "../inputs/MultiVolumeMount";
import { VolumeMount } from "../../model/volumeMount";
import { Volume } from "../../model/volume";
import MultiEndpoint, { isEndpointValid } from "../inputs/MultiEndpoint";
import { Endpoint } from "../../model/endpoint";
import SourceMountConfiguration, { sourceMountConfig } from "../inputs/SourceMountConfiguration";

interface Invalid {
    nameField?: boolean
    imageField?: boolean
    commandField?: boolean
    argsField?: boolean
    envField?: boolean
    volumeMountsField?: boolean
    endpointsField?: boolean
}

function AddContainerForm({
    volumesNames,
    container,
    onCancel,
    onCreate,
    onSave
}: {
    volumesNames: string[],
    container: Container,
    onCancel: () => void,
    onCreate: (container: Container, volumesToCreate: Volume[]) => void,
    onSave: (container: Container, volumesToCreate: Volume[]) => void
}) {
    const [ containerValue, setContainerValue] = useState(container);
    const [editing, setEditing] = useState(container.name !== '');
    const [ volumesToCreate, setVolumesToCreate ] = useState<Volume[]>([]);
    
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
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-container');
    }
    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...containerValue, name: v};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);        
    }

    // Image validation
    const [imageErrorMsg, setImageErrorMsg] = useState('');
    const isImageValid = (v: string): boolean => {
        return v != '';
    }
    const updateImageErrorMsg = (valid: boolean) => {
        setImageErrorMsg(valid ? '' : 'Image is required');
    }
    const onImageChange = (v: string) => {
        const valid = isImageValid(v)
        updateImageErrorMsg(valid);
        const newValue = {...containerValue, image: v};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);
    }

    // Reset validation
    const computeInvalid = (container: Container): Invalid => {
        const inv = {} as Invalid;
        if (!isNameValid(container.name)) {
            inv.nameField = true;
        }
        if (!isImageValid(container.image)) {
            inv.imageField = true;
        }
        if (!isCommandValid(container.command)) {
            inv.commandField = true;
        }
        if (!isArgsValid(container.args)) {
            inv.argsField = true;
        }
        if (!isEnvValid(container.env)) {
            inv.envField = true;
        }
        if (!isVolumeMountsValid(container.volumeMounts)) {
            inv.volumeMountsField = true;
        }
        for (let i=0; i<container.endpoints.length; i++) {
            if (!isEndpointValid(container.endpoints[i])) {
                inv.endpointsField = true;
            }    
        }
        return inv;
    }

    const isCommandValid = (cmds: string[]): boolean => {
        return cmds?.filter(v => v == "").length == 0;
    }

    const onCommandChange = (cmds: string[]) => {
        const newValue = {...containerValue, command: cmds};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);
    }

    const isArgsValid = (args: string[]): boolean => {
        return args?.filter(v => v == "").length == 0;
    }

    const onArgsChange = (args: string[]) => {
        const newValue = {...containerValue, args: args};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);
    }

    const isEnvValid = (envs: Env[]): boolean => {
        return envs?.filter(env => env.name == "").length == 0;
    }

    const onEnvChange = (env: Env[]) => {
        const newValue = {...containerValue, env: env};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);
    }

    const isVolumeMountsValid = (mounts: VolumeMount[]): boolean => {
        return mounts?.filter(mount => mount.name == "" || mount.name == "!" || mount.path == "").length == 0;
    }

    const onVolumeMountsChange = (mounts: VolumeMount[]) => {
        const newValue = {...containerValue, volumeMounts: mounts};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);
    }

    const onEndpointsChange = (endpoints: Endpoint[]) => {
        const newValue = {...containerValue, endpoints: endpoints};
        setInvalid(computeInvalid(newValue));
        setContainerValue(newValue);
    }

    const onMemoryRequestChange = (v: string) => {
        const newValue = {...containerValue, memoryRequest: v};
        setContainerValue(newValue);
    }

    const onMemoryLimitChange =  (v: string) => {
        const newValue = {...containerValue, memoryLimit: v};
        setContainerValue(newValue);
    }

    const onCpuRequestChange = (v: string) => {
        const newValue = {...containerValue, cpuRequest: v};
        setContainerValue(newValue);
    }

    const onCpuLimitChange = (v: string) => {
        const newValue = {...containerValue, cpuLimit: v};
        setContainerValue(newValue);
    }

    const toSourceMountConfig = (container: Container) : sourceMountConfig => {
        return {
            configure: container.configureSources,
            mount: container.mountSources,
            directory: container.sourceMapping
        }
    }

    const handleSourceMountConfig = (cfg: sourceMountConfig) => {
        const newValue = {
            ...containerValue, 
            configureSources: cfg.configure,
            mountSources: cfg.mount,
            sourceMapping: cfg.directory
        };
        setContainerValue(newValue);
        
    }

    const onDeploymentAnnotationChange = (values:{ [key: string]: string; }) => {
        const newValue = {...containerValue, annotation: { ...containerValue.annotation, deployment: values }};
        setContainerValue(newValue);
    }

    const onServiceAnnotationChange = (values:{ [key: string]: string; }) => {
        const newValue = {...containerValue, annotation: { ...containerValue.annotation, service: values }};
        setContainerValue(newValue);
    }

    const resetValidation = (container: Container) => {
        setNameErrorMsg('');
        setInvalid(computeInvalid(container));
    }

    useEffect(() => {
        setContainerValue(container);
        setEditing(container.name != '');
        resetValidation(container);
    }, [container]);

    const handleClick = () => {
        if (editing) {
            onSave(containerValue, volumesToCreate);
        } else {
            onCreate(containerValue, volumesToCreate);
        }
    }

    const handleVolumesToCreate = (volumes: Volume[]) => {
        setVolumesToCreate(volumes);
    }
    
    const fromKeyValue = (o: KeyValue[]): { [key: string]: string } => {
        if (o == null || o.length == 0) {
          return {};
        }
        return o.reduce((acc: any, val: KeyValue) => { acc[val.name] = val.value; return acc; }, {});
    }
    
    const toKeyValue = (o: { [key: string]: string }): KeyValue[] => {
        if (o == null) {
          return [];
        }
        return Object.keys(o).map(k => ({ name: k, value: o[k]}));
    }
    
    return (
        <Card>
            <CardHeader
                title={editing ? `Edit the container "${container.name}"` : 'Add a Container'}
                subheader="A Container is used to execute shell commands into a specific environment. The entrypoint of the container must be a non-terminating command. You can use an image pulled from a registry or an image built by an Image command."
            ></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            disabled={editing}
                            placeholder="Unique name to identify the container"
                            value={containerValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                            helperText={nameErrorMsg}
                            error={!!nameErrorMsg}        
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Image *" fullWidth
                            placeholder="Image to start the container"
                            value={containerValue.image}
                            onChange={(e) => onImageChange(e.target.value)}
                            onBlur={(e) => onImageChange(e.target.value)}
                            helperText={imageErrorMsg}
                            error={!!imageErrorMsg}        
                        />
                    </Grid>

                    <Section
                        title="Command And Arguments"
                        subtitle="Command and Arguments can be used to override the entrypoint of the image" />

                    <Grid item container xs={12} spacing={2}>
                        <MultiTextInput
                            value={containerValue.command}
                            onChange={(cmds) => {onCommandChange(cmds)}}
                            label="Command"
                        ></MultiTextInput>
                    </Grid>
                    <Grid item container xs={12} spacing={2}>
                        <MultiTextInput
                            value={containerValue.args}
                            onChange={(args) => {onArgsChange(args)}}
                            label="Arg"
                        ></MultiTextInput>
                    </Grid>
                    
                    <Section
                        title="Environment Variables"
                        subtitle="Environment Variables to define in the running container" />
                    <Grid item container xs={12} spacing={2}>
                        <MultiKeyValueInput
                            value={containerValue.env}
                            onChange={(env) => {onEnvChange(env)}}
                            label="EnvVar"
                            keyLabel="Name"
                            valueLabel="Value"
                        />
                    </Grid>

                    <Section
                        title="Volume Mounts"
                        subtitle="Volumes to mount into the container's filesystem" />
                    <Grid item container xs={12} spacing={2}>
                        <MultiVolumeMount 
                            selection={volumesNames}
                            value={containerValue.volumeMounts} 
                            label="Volume Mount"
                            keyLabel="Volume"
                            valueLabel="Mount Path"
                            onChange={ (mounts) => {onVolumeMountsChange(mounts)} }
                            onVolumesToCreate={(volumes) => handleVolumesToCreate(volumes)}
                        />
                    </Grid>

                    <Section
                        title="Endpoints"
                        subtitle="Endpoints exposed by the container" />
                    <Grid item container xs={12} spacing={2}>
                        <MultiEndpoint
                            value={containerValue.endpoints}
                            onChange={(endpoints) => onEndpointsChange(endpoints)}
                        />
                    </Grid>

                    <Section
                        title="Resource Usage"
                        subtitle="CPU and Memory resources necessary for container's execution" />
                    <Grid item xs={6}>
                        <TextField
                            label="Memory Request" fullWidth
                            placeholder="memory requested for the container. Ex: 1Gi"
                            value={containerValue.memoryRequest}
                            onChange={(e) => onMemoryRequestChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Memory Limit" fullWidth
                            placeholder="memory limit for the container. Ex: 1Gi"
                            value={containerValue.memoryLimit}
                            onChange={(e) => onMemoryLimitChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="CPU Request" fullWidth
                            placeholder="CPU requested for the container. Ex: 500m"
                            value={containerValue.cpuRequest}
                            onChange={(e) => onCpuRequestChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="CPU Limit" fullWidth
                            placeholder="cpu limit for the container. Ex: 1"
                            value={containerValue.cpuLimit}
                            onChange={(e) => onCpuLimitChange(e.target.value)}
                        />
                    </Grid>

                    <Section
                        title="Sources"
                        subtitle="Declare if and how sources are mounted into the container's filesystem. By default, sources are automatically mounted into $PROJECTS_ROOT or /projects directory" />

                    <Grid item container xs={12} spacing={2}>
                        <SourceMountConfiguration
                            value={toSourceMountConfig(containerValue)}
                            onChange={(cfg: sourceMountConfig) => handleSourceMountConfig(cfg)}
                        />
                    </Grid>

                    <Section
                        title="Deployment Annotations"
                        subtitle="Annotations added to the Kubernetes Deployment created for running this container" />
                    <Grid item container xs={12} spacing={2}>
                        <MultiKeyValueInput
                            value={toKeyValue(containerValue.annotation.deployment)}
                            onChange={(annotations) => {onDeploymentAnnotationChange(fromKeyValue(annotations))}}
                            label="Deployment Annotation"
                            keyLabel="Name"
                            valueLabel="Value"
                        />
                    </Grid>

                    <Section
                        title="Service Annotations"
                        subtitle="Annotations added to the Kubernetes Service created for accessing this container" />
                    <Grid item container xs={12} spacing={2}>
                        <MultiKeyValueInput
                            value={toKeyValue(containerValue.annotation.service)}
                            onChange={(annotations) => {onServiceAnnotationChange(fromKeyValue(annotations))}}
                            label="Service Annotation"
                            keyLabel="Name"
                            valueLabel="Value"
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

function Section({
    title,
    subtitle
}: {
    title: string,
    subtitle: string
}) {
    return (
        <Grid item xs={12}>
            <Typography>{title}</Typography>
            <Typography variant="caption">{subtitle}</Typography>
        </Grid>
    )
}
export default AddContainerForm;
