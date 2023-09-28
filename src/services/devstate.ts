import axios, { AxiosResponse } from "axios";
import { DevfileContent } from "../model/devfileContent";

const base = "/api/v1/devstate";

export const getDevfileContent = (): Promise<AxiosResponse<DevfileContent, any>> => {
    return axios.get<DevfileContent>(base+"/devfile");
}

export const setDevfileContent = (devfile: string): Promise<AxiosResponse<DevfileContent, any>> => {
    return axios.put<DevfileContent>(base+"/devfile", {
        content: devfile
    });
};
