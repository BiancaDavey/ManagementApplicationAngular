import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

//  Maps to application state.
@Injectable({providedIn: 'root'})
export class ServerService {
    //  URL for backend.
    private readonly apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) {}

    //  example - Procedural method to return server list.
    getServers(): Observable<CustomResponse> {
        return this.http.get<CustomResponse>(`http://localhost:8080/server/serverList`);
    }

    //  Reactive:
    //  Method to return server list. 
    //  Directly assigns variable to return, making variable an Observable.
    servers$ = <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/server/serverList`)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to save server.
    save$ = (server: Server) => <Observable<CustomResponse>> this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to ping server.
    ping$ = (serverIPAddress: string) => <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${serverIPAddress}`)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to delete server.
    delete$ = (serverId: number) => <Observable<CustomResponse>> this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
    //  Use pipe.
    .pipe(
        //  Log to console.
        tap(console.log),
        //  Catch any errors.
        catchError(this.handleError)
    );

    //  Method to filter servers.
    filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
        subscriber => {
            console.log(response);
            //  Whoever is subscribed will get the new Observable.
            subscriber.next(
                //  Return response, as no filter applied.
                status === Status.ALL ? { 
                    ...response, successMessage: `Servers filtered by ${status} status`} :
                {
                    ...response,
                    //  If servers returned are over 0, return message according to status.
                    successMessage: response.data.servers
                    .filter(server => server.serverStatus === status).length > 0 ? 
                    `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status` :
                    //  If no servers returned, return message. Check data, of server array.
                    `No servers of ${status} found`,
                    data: { servers: response.data.servers 
                        .filter(server => server.serverStatus === status)}
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

    //  Method to handle errors.
    private handleError(error: HttpErrorResponse): Observable<never> {
        console.log(error);
        return throwError(() => (`An error occurred - error code: ${error.status}`));
    }
}