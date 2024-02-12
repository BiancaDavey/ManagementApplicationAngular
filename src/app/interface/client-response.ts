import { Client } from './client';

//  Maps to example client response model in the backend.

export interface ClientResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    message: string;
    //  Data containing optional array of clients, or optional single client.
    data: { clients?: Client[], client?: Client};
}