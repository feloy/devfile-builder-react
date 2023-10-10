
export const PATTERN_COMMAND_ID = "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$";
export const PATTERN_COMPONENT_ID = "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$";
export const PATTERN_ENDPOINT_NAME = "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$";

export const commandIdPatternRegex = new RegExp(PATTERN_COMMAND_ID);
export const componentIdPatternRegex = new RegExp(PATTERN_COMPONENT_ID);
export const endpointNamePatternRegex = new RegExp(PATTERN_ENDPOINT_NAME);
