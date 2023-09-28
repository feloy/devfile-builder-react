import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

interface props {
    content: string;
    onChange: (value: string) => void
    onClear: () => void
}

function Yaml(props: props) {

    const [content, setContent] = useState(props.content)

    const onApply = () => {
        props.onChange(content);
    }
    const onClear = () => {
        props.onClear();
    }

    return <>
        <Box width="100%">
            <TextField
                label="Devfile YAML"
                multiline
                fullWidth
                minRows="20" maxRows="20"
                defaultValue={props.content}
                value={content}
                onChange={(e) => { setContent(e.target.value); }}
            />
        </Box>
        <Stack spacing={2} direction="row" margin="16px 0">
            <Button onClick={onApply} variant="contained">Apply</Button>
            <Button onClick={onClear} variant="text">Clear</Button>
        </Stack>
    </>
}

export default Yaml

