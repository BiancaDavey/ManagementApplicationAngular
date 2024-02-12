import { Status } from "../enum/status.enum";

//  Maps to Server model in backend, for the frontend interface.

export interface Server {
    serverId: number;
    serverIPAddress: string;
    serverName: string; 
    serverMemory: string;
    serverType: string;
    serverImageUrl: string;
    serverStatus: Status;
}