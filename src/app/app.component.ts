import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { AppState } from './interface/app-state';
import { DataState } from './enum/data.state.enum';
import { CommonModule } from '@angular/common';
import { Server } from './interface/server';
import { ServerService } from './service/server.service';
import { Status } from './enum/status.enum';
import { CustomResponse } from './interface/custom-response';
import { FormsModule, NgForm } from '@angular/forms';
import { ClientService } from './service/client.service';
import { ClientResponse } from './interface/client-response';
import { ClientStatus } from './enum/client-status';
import { Client } from './interface/client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, FormsModule],
  //  Example client management app:
  templateUrl: './components/client-app.component.html',
  //  Server management app:
  //templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'management-app';
  
  //  Server management application:
  /*
  //  Application state. Can subscribe to this Observable, in the form of a CustomResponse.
  appState$: Observable<AppState<CustomResponse>>;
  //  readonlys to use in html.
  readonly DataState = DataState;
  readonly Status = Status;
  //  Filter subject, and an Observable from it, for use in UI showing loading or other icon.
  private filterSubject = new BehaviorSubject<string>('');
  //  DataSubject to store response from the functions below.
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
    //  Variable/data subject for displaying spinner when saving a new server. Default is false.
    //  NOTE: isLoading can be used to set the value.
    private isLoading = new BehaviorSubject<boolean>(false);
    //  Object for the data subject isLoading, to make it an Observable. Can be subscribed to.
    //  NOTE: isLoading$ can be used in the UI/HTML.
    isLoading$ = this.isLoading.asObservable();
  //  Constructor.
  constructor(private serverService: ServerService){}
  
  //  On initialisation, map app state in form of CustomResponse.
  ngOnInit(): void {
    //  Set application state on init. Subscribe to this Observable.
    this.appState$ = this.serverService.servers$
    .pipe(
      //  Return response, in form of CustomResponse, through a callback function.
      map(response => {
        //  Store response in the variable.
        this.dataSubject.next(response);
        //  Override the servers property so it lists most recent one first.
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { servers: response.data.servers.reverse() }}} 
      }),
      //  Return while waiting.
      startWith({ dataState: DataState.LOADING_STATE }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to ping server.
  pingServer(serverIPAddress: string): void {
    //  Pass IP address to the filterSubject, so server with IP address has spinner for ping.
    this.filterSubject.next(serverIPAddress);
    //  Set application state. Subscribe to this Observable.
    this.appState$ = this.serverService.ping$(serverIPAddress)
    .pipe(
      //  Return response, in form of CustomResponse, through a callback function.
      map(response => {
        //  Access all servers, get index of server matching serverId.
        const index = this.dataSubject.value.data.servers.findIndex(
          server => server.serverId === response.data.server.serverId);
        //  Update dataSubject, return it as the data for the frontend.
        this.dataSubject.value.data.servers[index] = response.data.server;
        //  Reset to an empty string, so spinner will stop showing.
        this.filterSubject.next('');
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to filter servers.
  filterServers(status: Status): void {
    //  Set application state. Subscribe to this Observable. Get all servers.
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
    .pipe(
      //  Return response, in form of CustomResponse, through a callback function, providing the filtered response.
      map(response => {
        //  Pass filtered response back to appState. this.dataSubject.value stores all the servers, not overwritten.
        return { dataState: DataState.LOADED_STATE, appData: response } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to add and save a new server.
  saveServer(serverForm: NgForm): void {
    //  Set isLoading to true to start spinner.
    this.isLoading.next(true);
    //  Set application state. Subscribe to this Observable. Server in json format.
    this.appState$ = this.serverService.save$(serverForm.value as Server)
    .pipe(
      //  Return response, in form of CustomResponse, through a callback function. Response returns object of server to save.
      map(response => {
        //  Add/push new object to dataSubject object,
        this.dataSubject.next(
          //  Add new server to the start of the array of servers, then pass in all existing servers.
          {...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] }}
        );
        //  Close modal by getting id of button to close it.
        document.getElementById('closeModal').click();
        //  Set isLoading to false to stop spinner.
        this.isLoading.next(false);
        //  Reset the form and set the default status in the form as SERVER_DOWN.
        serverForm.resetForm( { status: this.Status.SERVER_DOWN } );
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        //  Set isLoading to false to stop spinner.
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to delete a server.
  deleteServer(server: Server): void {
    //  Set application state. Subscribe to this Observable.
    this.appState$ = this.serverService.delete$(server.serverId)
    .pipe(
      //  Return response, in form of CustomResponse, through a callback function.
      map(response => {
        //  Remove server from list and return new list. Push list of servers.
        this.dataSubject.next(
          { ...response, data: 
            //  Iterate array of servers, remove the element with the matching index from the array.
            { servers: this.dataSubject.value.data.servers.filter(s => s.serverId !== server.serverId) } }
        );
        //  Return the updated array of servers with the serverId specified removed.
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to return table of current servers in server table in database.
  printReport(): void {
    //  TODO: consider drop-down to select PDF or .xlsx.
    //  Save as PDF.
    window.print();
    //  Save as .xlsx document.
    //  TODO: fix format for xls.
    /*
    //  Define datatype to be returned.
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    //  Select table element from HTML component.
    let tableSelect = document.getElementById('servers');
    //  Replace spaces with encoded value to prevent errors.
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    //  Create link element.
    let downloadLink = document.createElement('a');
    //  Add link into the HTML as an element.
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xlsx';
    downloadLink.click();
    //  Remove link from document after click.
    document.body.removeChild(downloadLink);
    */
  //}
  //*/

  //  Client management application.

  //  Application state. Can subscribe to this Observable, in the form of a CustomResponse.
  appState$: Observable<AppState<ClientResponse>>;
  //  readonlys to use in html.
  readonly DataState = DataState;
  //  Note: updated to Client Status.
  readonly ClientStatus = ClientStatus;
  //  Filter subject, and an Observable from it, for use in UI showing loading or other icon.
  private filterSubject = new BehaviorSubject<string>('');
  //  DataSubject to store response from the functions below.
  private dataSubject = new BehaviorSubject<ClientResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
    //  Variable/data subject for displaying spinner when saving a new server. Default is false.
    //  NOTE: isLoading can be used to set the value.
    private isLoading = new BehaviorSubject<boolean>(false);
    //  Object for the data subject isLoading, to make it an Observable. Can be subscribed to.
    //  NOTE: isLoading$ can be used in the UI/HTML.
    isLoading$ = this.isLoading.asObservable();
  //  Constructor.
  constructor(private clientService: ClientService){}
  
  //  On initialisation, map app state in form of ClientResponse.
  ngOnInit(): void {
    //  Set application state on init. Subscribe to this Observable.
    this.appState$ = this.clientService.clients$
    .pipe(
      //  Return response, in form of ClientResponse, through a callback function.
      map(response => {
        //  Store response in the variable.
        this.dataSubject.next(response);
        //  Override the servers property so it lists most recent one first.
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { clients: response.data.clients.reverse() }}} 
      }),
      //  Return while waiting.
      startWith({ dataState: DataState.LOADING_STATE }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to ping company URL.
  pingURL(clientCompanyURL: string): void {
    //  Pass IP address to the filterSubject, so server with IP address has spinner for ping.
    this.filterSubject.next(clientCompanyURL);
    //  Set application state. Subscribe to this Observable.
    this.appState$ = this.clientService.ping$(clientCompanyURL)
    .pipe(
      //  Return response, in form of ClientResponse, through a callback function.
      map(response => {
        //  Access all clients, get index of client matching clientId.
        const index = this.dataSubject.value.data.clients.findIndex(
          client => client.clientId === response.data.client.clientId);
        //  Update dataSubject, return it as the data for the frontend.
        this.dataSubject.value.data.clients[index] = response.data.client;
        //  Reset to an empty string, so spinner will stop showing.
        this.filterSubject.next('');
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to filter clients.
  filterClients(clientStatus: ClientStatus): void {
    //  Set application state. Subscribe to this Observable. Get all servers.
    this.appState$ = this.clientService.filter$(clientStatus, this.dataSubject.value)
    .pipe(
      //  Return response, in form of ClientResponse, through a callback function, providing the filtered response.
      map(response => {
        //  Pass filtered response back to appState. this.dataSubject.value stores all the servers, not overwritten.
        return { dataState: DataState.LOADED_STATE, appData: response } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (ClientResponse)
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to add and save a new client.
  saveClient(clientForm: NgForm): void {
    //  Set isLoading to true to start spinner.
    this.isLoading.next(true);
    //  Set application state. Subscribe to this Observable. Server in json format.
    this.appState$ = this.clientService.save$(clientForm.value as Client)
    .pipe(
      //  Return response, in form of ClientResponse, through a callback function. Response returns object of client to save.
      map(response => {
        //  Add/push new object to dataSubject object,
        this.dataSubject.next(
          //  Add new client to the start of the array of clients, then pass in all existing clients.
          {...response, data: { clients: [response.data.client, ...this.dataSubject.value.data.clients] }}
        );
        //  Close modal by getting id of button to close it.
        document.getElementById('closeModal').click();
        //  Set isLoading to false to stop spinner.
        this.isLoading.next(false);
        //  Reset the form and set the default status in the form as INACTIVE.
        clientForm.resetForm( { clientStatus: this.ClientStatus.INACTIVE } );
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (CustomResponse)
      catchError((error: string) => {
        //  Set isLoading to false to stop spinner.
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to delete a client.
  deleteClient(client: Client): void {
    //  Set application state. Subscribe to this Observable.
    this.appState$ = this.clientService.delete$(client.clientId)
    .pipe(
      //  Return response, in form of ClientResponse, through a callback function.
      map(response => {
        //  Remove client from list and return new list. Push list of clients.
        this.dataSubject.next(
          { ...response, data: 
            //  Iterate array of clients, remove the element with the matching index from the array.
            { clients: this.dataSubject.value.data.clients.filter(c => c.clientId !== client.clientId) } }
        );
        //  Return the updated array of clients with the clientId specified removed.
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value } 
      }),
      //  Return while waiting. Returns data subject value from ngOnInit function.
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      //  Return error from handleError function if error. Return an Observable (ClientResponse)
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  //  Function to return PDF of current clients in client table in database with filter.
  printReport(): void {
    //  Save as PDF.
    window.print();
  }

}
