import { useState } from 'react';

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

    const [value, setValue] = useState(props.content)

    const onApply = () => {
        props.onChange(value);
    }
    const onClear = () => {
        setValue('');
        props.onClear();        
    }

    return <>
        <Box width="100%">
            <TextField
                id="devfile-yaml"
                label="Devfile YAML"
                multiline
                fullWidth
                minRows="20" maxRows="20"
                value={value}
                onChange={(e) => { setValue(e.target.value); }}
            />
        </Box>
        <Stack spacing={2} direction="row" margin="16px 0">
            <Button onClick={onApply} variant="contained">Apply</Button>
            <Button onClick={onClear} variant="text">Clear</Button>
        </Stack>
    </>
}

export default Yaml

