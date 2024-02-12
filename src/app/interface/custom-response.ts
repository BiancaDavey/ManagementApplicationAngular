import { Server } from "./server";

//  Maps to Response model in the backend.

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    errorMessage: string;
    successMessage: string;
    developerMessage: string;
    //  Data containing optional array of servers, or optional single server.
    data: { servers?: Server[], server?: Server};
}