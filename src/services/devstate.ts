import axios, { AxiosResponse } from "axios";

import { DevfileContent } from "../model/devfileContent";
import { Metadata } from "../model/metadata";

const base = "/api/v1/devstate";

export const getDevfileContent = (): Promise<AxiosResponse<DevfileContent, any>> => {
    return axios.get<DevfileContent>(base+"/devfile");
}

export const setDevfileContent = (devfile: string): Promise<AxiosResponse<DevfileContent, any>> => {
    return axios.put<DevfileContent>(base+"/devfile", {
        content: devfile
    });
};

export const setMetadata = (metadata: Metadata): Promise<AxiosResponse<DevfileContent, any>> => {
    return axios.put<DevfileContent>(base+"/metadata", {
      name: metadata.name,
      version: metadata.version,
      displayName: metadata.displayName,
      description: metadata.description,
      tags: metadata.tags,
      architectures: metadata.architectures,
      icon: metadata.icon,
      globalMemoryLimit: metadata.globalMemoryLimit,
      projectType: metadata.projectType,
      language: metadata.language,
      website: metadata.website,
      provider: metadata.provider,
      supportUrl: metadata.supportUrl,
    });
};

export const setDefaultCommand = (command: string, group: string): Promise<AxiosResponse<DevfileContent, any>> => {
    return axios.post<DevfileContent>(base+"/command/"+command+"/setDefault", {
      group: group
    });
}

export const unsetDefaultCommand = (command: string): Promise<AxiosResponse<DevfileContent, any>> =>  {
    return axios.post<DevfileContent>(base+"/command/"+command+"/unsetDefault", {});
}
