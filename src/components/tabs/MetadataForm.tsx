import { useState } from 'react';

import { Box, Button, Grid, TextField } from '@mui/material';

import { Metadata } from "../../model/metadata";

function MetadataForm({
    metadata: metadata, 
    onApply
}: {
    metadata: Metadata;
    onApply: (value: Metadata) => void
}) {

    const [metadataValue, setMetadataValue] = useState(metadata);

    const [versionErrorMsg, setVersionErrorMsg] = useState('');
    const semverPattern = `^([0-9]+)\\.([0-9]+)\\.([0-9]+)(\\-[0-9a-z-]+(\\.[0-9a-z-]+)*)?(\\+[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?$`;
    const semverPatternRegex = new RegExp(semverPattern);

    const onVersionChange = (v: string) => {
        if (semverPatternRegex.test(v)) {
            setVersionErrorMsg('');
        } else {
            setVersionErrorMsg('Examples: 1.0.4, 1.4.7-alpha1')
        }
        setMetadataValue({...metadataValue, version: v});
    }

return <>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    label="Name" variant="outlined" fullWidth
                    placeholder="Unique name to identify the devfile"
                    value={metadataValue.name}
                    onChange={(e) => setMetadataValue({...metadataValue, name: e.target.value})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Version" variant="outlined" fullWidth
                    placeholder="Version of the devfile, semver-compatible" 
                    value={metadataValue.version}
                    onChange={(e) => onVersionChange(e.target.value) }
                    helperText={versionErrorMsg}
                    error={!!versionErrorMsg}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Display Name" variant="outlined" fullWidth
                    placeholder="Name to display instead of the unique name"
                    value={metadataValue.displayName}
                    onChange={(e) => setMetadataValue({...metadataValue, displayName: e.target.value})}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Description" variant="outlined" fullWidth
                    value={metadataValue.description}
                    onChange={(e) => setMetadataValue({...metadataValue, description: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Tags" variant="outlined" fullWidth
                    placeholder="Tags to help find the devfile in a registry" 
                    value={metadataValue.tags}
                    onChange={(e) => setMetadataValue({...metadataValue, tags: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Architectures" variant="outlined" fullWidth
                    placeholder="Ex: amd64,arm64,ppc64le,s390x" 
                    value={metadataValue.architectures}
                    onChange={(e) => setMetadataValue({...metadataValue, architectures: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Icon" variant="outlined" fullWidth
                    placeholder="Can be a URI or a relative path in the project" 
                    value={metadataValue.icon}
                    onChange={(e) => setMetadataValue({...metadataValue, icon: e.target.value})}
                    />
            </Grid>
            <Grid item xs={1}>
                <img width="56" src={metadataValue.icon} />
            </Grid>
            <Grid item xs={5}>
                <TextField
                    label="Global Memory Limit" variant="outlined" fullWidth
                    placeholder="Informative limit of memory used. Ex: 1Gi"
                    value={metadataValue.globalMemoryLimit}
                    onChange={(e) => setMetadataValue({...metadataValue, globalMemoryLimit: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Project Type" variant="outlined" fullWidth
                    placeholder="Ex: Framework of the project"
                    value={metadataValue.projectType}
                    onChange={(e) => setMetadataValue({...metadataValue, projectType: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Language" variant="outlined" fullWidth
                    placeholder="Language of the project"
                    value={metadataValue.language}
                    onChange={(e) => setMetadataValue({...metadataValue, language: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Website" variant="outlined" fullWidth
                    placeholder="Official website of the devfile"
                    value={metadataValue.website}
                    onChange={(e) => setMetadataValue({...metadataValue, website: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Provider" variant="outlined" fullWidth
                    placeholder="Information about the provider of the devfile"
                    value={metadataValue.provider}
                    onChange={(e) => setMetadataValue({...metadataValue, provider: e.target.value})}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Support URL" variant="outlined" fullWidth
                    placeholder="Link to a page providing support information"
                    value={metadataValue.supportUrl}
                    onChange={(e) => setMetadataValue({...metadataValue, supportUrl: e.target.value})}
                    />
            </Grid>
        </Grid>
        <Box margin="16px 0">
            <Button onClick={() => onApply(metadataValue)} variant="contained">Apply</Button>
        </Box>
    </>
}

export default MetadataForm
