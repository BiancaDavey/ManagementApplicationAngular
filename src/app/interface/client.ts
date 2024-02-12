import { ClientStatus } from '../enum/client-status';

//  Maps to Site model in backend, for the frontend interface.

export interface Client {
    clientId: number;
    clientFirstName: string;
    clientLastName: string; 
    clientCompany: string;
    clientCompanyURL: string;
    clientEmail: string;
    clientPhoneCountryCode: string;
    clientPhone: string;
    clientStatus: ClientStatus;
}