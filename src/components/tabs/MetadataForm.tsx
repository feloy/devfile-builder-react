import { useState } from 'react';

import { Box, Button, Grid, TextField } from '@mui/material';

import { Metadata } from "../../model/metadata";

interface props {
    metadata: Metadata;
    onApply: (value: Metadata) => void
}

function MetadataForm(props: props) {

    const [metadata, setMetadata] = useState(props.metadata);

    const onApply = () => {
        props.onApply(metadata);
    }    

    const [versionErrorMsg, setVersionErrorMsg] = useState('');
    const semverPattern = `^([0-9]+)\\.([0-9]+)\\.([0-9]+)(\\-[0-9a-z-]+(\\.[0-9a-z-]+)*)?(\\+[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?$`;
    const semverPatternRegex = new RegExp(semverPattern);

    const onVersionChange = (v: string) => {
        if (semverPatternRegex.test(v)) {
            setVersionErrorMsg('');
        } else {
            setVersionErrorMsg('Examples: 1.0.4, 1.4.7-alpha1')
        }
        setMetadata({...metadata, version: v});
    }

return <>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    label="Name" variant="outlined" fullWidth
                    placeholder="Unique name to identify the devfile"
                    value={metadata.name}
                    onChange={(e) => setMetadata({...metadata, name: e.target.value})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Version" variant="outlined" fullWidth
                    placeholder="Version of the devfile, semver-compatible" 
                    value={metadata.version}
                    onChange={(e) => onVersionChange(e.target.value) }
                    helperText={versionErrorMsg}
                    error={!!versionErrorMsg}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Display Name" variant="outlined" fullWidth
                    placeholder="Name to display instead of the unique name"
                    value={metadata.displayName}
                    onChange={(e) => setMetadata({...metadata, displayName: e.target.value})}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Description" variant="outlined" fullWidth
                    value={metadata.description}
                    onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Tags" variant="outlined" fullWidth
                    placeholder="Tags to help find the devfile in a registry" 
                    value={metadata.tags}
                    onChange={(e) => setMetadata({...metadata, tags: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Architectures" variant="outlined" fullWidth
                    placeholder="Ex: amd64,arm64,ppc64le,s390x" 
                    value={metadata.architectures}
                    onChange={(e) => setMetadata({...metadata, architectures: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Icon" variant="outlined" fullWidth
                    placeholder="Can be a URI or a relative path in the project" 
                    value={metadata.icon}
                    onChange={(e) => setMetadata({...metadata, icon: e.target.value})}
                    />
            </Grid>
            <Grid item xs={1}>
                <img width="56" src={metadata.icon} />
            </Grid>
            <Grid item xs={5}>
                <TextField
                    label="Global Memory Limit" variant="outlined" fullWidth
                    placeholder="Informative limit of memory used. Ex: 1Gi"
                    value={metadata.globalMemoryLimit}
                    onChange={(e) => setMetadata({...metadata, globalMemoryLimit: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Project Type" variant="outlined" fullWidth
                    placeholder="Ex: Framework of the project"
                    value={metadata.projectType}
                    onChange={(e) => setMetadata({...metadata, projectType: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Language" variant="outlined" fullWidth
                    placeholder="Language of the project"
                    value={metadata.language}
                    onChange={(e) => setMetadata({...metadata, language: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Website" variant="outlined" fullWidth
                    placeholder="Official website of the devfile"
                    value={metadata.website}
                    onChange={(e) => setMetadata({...metadata, website: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Provider" variant="outlined" fullWidth
                    placeholder="Information about the provider of the devfile"
                    value={metadata.provider}
                    onChange={(e) => setMetadata({...metadata, provider: e.target.value})}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Support URL" variant="outlined" fullWidth
                    placeholder="Link to a page providing support information"
                    value={metadata.supportUrl}
                    onChange={(e) => setMetadata({...metadata, supportUrl: e.target.value})}
                    />
            </Grid>
        </Grid>
        <Box margin="16px 0">
            <Button onClick={onApply} variant="contained">Apply</Button>
        </Box>
    </>
}

export default MetadataForm
