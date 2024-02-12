import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientResponse } from '../interface/client-response';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { Client } from '../interface/client';
import { Status } from '../enum/status.enum';
import { ClientStatus } from '../enum/client-status';

//  Maps to application state.
@Injectable({providedIn: 'root'})
export class ClientService {
    //  URL for backend.
    private readonly apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) {}

    //  example - Procedural method to return client list.
    getClients(): Observable<ClientResponse> {
        return this.http.get<ClientResponse>(`http://localhost:8080/client/clientList`);
    }

    //  Reactive:
    //  Method to return client list. 
    //  Directly assigns variable to return, making variable an Observable.
    clients$ = <Observable<ClientResponse>> this.http.get<ClientResponse>(`${this.apiUrl}/client/clientList`)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to save client.
    save$ = (client: Client) => <Observable<ClientResponse>> this.http.post<ClientResponse>(`${this.apiUrl}/client/save`, client)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  TODO: implement ping method.
    //  Method to ping company URL.
    ping$ = (clientCompanyURL: string) => <Observable<ClientResponse>> this.http.get<ClientResponse>(`${this.apiUrl}/client/ping/${clientCompanyURL}`)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to delete client.
    delete$ = (clientId: number) => <Observable<ClientResponse>> this.http.delete<ClientResponse>(`${this.apiUrl}/client/delete/${clientId}`)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to filter clients.
    filter$ = (status: ClientStatus, response: ClientResponse) => <Observable<ClientResponse>>
    new Observable<ClientResponse>(
        subscriber => {
            console.log(response);
            //  Whoever is subscribed will get the new Observable.
            subscriber.next(
                //  Return response, as no filter applied.
                status === ClientStatus.ALL ? { 
                    ...response, message: `Clients filtered by ${status} status`} :
                {
                    ...response,
                    //  If sites returned are over 0, return message according to status.
                    message: response.data.clients
                    .filter(client => client.clientStatus === status).length > 0 ? 
                    `Clients filtered by ${status === ClientStatus.ACTIVE ? 'ACTIVE' : 'INACTIVE'} status` :
                    //  If no client returned, return message. Check data, of client array.
                    `No clients of ${status} found`,
                    data: { clients: response.data.clients 
                        .filter(client => client.clientStatus === status)}
                }
            );
            subscriber.complete();
        }
    )
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  TODO: implement error handling.
    //  Method to handle errors.
    private handleError(error: HttpErrorResponse): Observable<never> {
        console.log(error);
        return throwError(() => (`An error occurred - error code: ${error.status}`));
    }
}