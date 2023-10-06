import { Box, Grid } from "@mui/material";
import MultiCommandSelect from "../inputs/MultiCommandSelect";
import { Events } from "../../model/events";

function EventsForm({
    commandsNames,
    value,
    onChange
}: {
    commandsNames: string[],
    value: Events,
    onChange: (eventType: "preStart" | "postStart" | "preStop" | "postStop", commands: string[]) => void
}) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <MultiCommandSelect
                    label="Pre-Start Events"
                    commands={commandsNames}
                    value={value.preStart ?? []}
                    onChange={(v: string[]) => {onChange("preStart", v)}}
                    onBlur={() => {}}
                    error={false}
                    helperText=""
                />
            </Grid>
            <Grid item xs={6}>
                <MultiCommandSelect
                    label="Post-Start Events"
                    commands={commandsNames}
                    value={value.postStart ?? []}
                    onChange={(v: string[]) => {onChange("postStart", v)}}
                    onBlur={() => {}}
                    error={false}
                    helperText=""
                />
            </Grid>
            <Grid item xs={6}>
                <MultiCommandSelect
                    label="Pre-Stop Events"
                    commands={commandsNames}
                    value={value.preStop ?? []}
                    onChange={(v: string[]) => {onChange("preStop", v)}}
                    onBlur={() => {}}
                    error={false}
                    helperText=""
                />
            </Grid>
            <Grid item xs={6}>
                <MultiCommandSelect
                    label="Post-Stop Events"
                    commands={commandsNames}
                    value={value.postStop ?? []}
                    onChange={(v: string[]) => {onChange("postStop", v)}}
                    onBlur={() => {}}
                    error={false}
                    helperText=""
                />
            </Grid>
        </Grid>
    )
}

export default EventsForm;
