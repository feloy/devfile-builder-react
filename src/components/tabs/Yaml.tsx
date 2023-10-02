import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function Yaml({
    content,
    onApply,
    onClear
}: {
    content: string;
    onApply: (value: string) => void
    onClear: () => void
}) {
    const [contentValue, setContentValue] = useState(content)

    return <>
        <Box width="100%">
            <TextField
                label="Devfile YAML"
                multiline
                fullWidth
                minRows="20" maxRows="20"
                defaultValue={content} /* It should not be necessary for a controlled component (feloy) */
                value={contentValue}
                onChange={(e) => { setContentValue(e.target.value); }}
            />
        </Box>
        <Stack spacing={2} direction="row" margin="16px 0">
            <Button onClick={() => onApply(contentValue)} variant="contained">Apply</Button>
            <Button onClick={onClear} variant="text">Clear</Button>
        </Stack>
    </>
}

export default Yaml

