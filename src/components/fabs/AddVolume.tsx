import { Button } from "@mui/material"

function AddVolume({
    onAddVolume
}: {
    onAddVolume: () => void
}) {
    return (
        <Button color="primary" onClick={onAddVolume}>
            Add a Volume
        </Button>
    )
}

export default AddVolume;
