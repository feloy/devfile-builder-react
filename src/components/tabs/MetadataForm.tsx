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

    return <>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    label="Name" variant="outlined" fullWidth
                    value={metadata.name}
                    onChange={(e) => setMetadata({...metadata, name: e.target.value})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Version" variant="outlined" fullWidth
                    value={metadata.version}
                    onChange={(e) => setMetadata({...metadata, version: e.target.value})}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Display Name" variant="outlined" fullWidth
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
            <Grid item xs={12}>
                <TextField
                    label="Display Name" variant="outlined" fullWidth
                    value={metadata.displayName}
                    onChange={(e) => setMetadata({...metadata, displayName: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Tags" variant="outlined" fullWidth
                    value={metadata.tags}
                    onChange={(e) => setMetadata({...metadata, tags: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Architectures" variant="outlined" fullWidth
                    value={metadata.architectures}
                    onChange={(e) => setMetadata({...metadata, architectures: e.target.value})}
                    />
            </Grid>
            <Grid item xs={7}>
                <TextField
                    label="Icon" variant="outlined" fullWidth
                    value={metadata.icon}
                    onChange={(e) => setMetadata({...metadata, icon: e.target.value})}
                    />
                {/* TODO(feloy): display icon */}
            </Grid>
            <Grid item xs={5}>
                <TextField
                    label="Global Memory Limit" variant="outlined" fullWidth
                    value={metadata.globalMemoryLimit}
                    onChange={(e) => setMetadata({...metadata, globalMemoryLimit: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Project Type" variant="outlined" fullWidth
                    value={metadata.projectType}
                    onChange={(e) => setMetadata({...metadata, projectType: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Language" variant="outlined" fullWidth
                    value={metadata.language}
                    onChange={(e) => setMetadata({...metadata, language: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Website" variant="outlined" fullWidth
                    value={metadata.website}
                    onChange={(e) => setMetadata({...metadata, website: e.target.value})}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Provider" variant="outlined" fullWidth
                    value={metadata.provider}
                    onChange={(e) => setMetadata({...metadata, provider: e.target.value})}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Support URL" variant="outlined" fullWidth
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
