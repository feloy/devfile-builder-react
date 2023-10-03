import { Button } from "@mui/material"

function AddResource({
    onAddResource
}: {
    onAddResource: () => void
}) {
    return (
        <Button color="primary" onClick={onAddResource}>
            Add a Resource
        </Button>
    )
}

export default AddResource;
