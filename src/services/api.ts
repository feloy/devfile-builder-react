import axios, { AxiosResponse } from "axios";
import { DevfileGet200Response } from "../model/devfileGet200Response";

const base = "/api/v1";

export const getDevfile = ():Promise<AxiosResponse<DevfileGet200Response, any>> => {
    return axios.get<DevfileGet200Response>(base+"/devfile");
}
