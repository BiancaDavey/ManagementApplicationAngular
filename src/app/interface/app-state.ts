import { DataState } from './../enum/data.state.enum';

//  Represents state of the application. Used to determine which part of UI user can see.

//  T means generic type.
export interface AppState<T> {
    //  Call dataState to get current state of application (LOADING_STATE, LOADED_STATE, ERROR_STATE).
    dataState: DataState;
    //  Optional appData and error, as will either get appData or error, not both at same time.
    appData?: T;
    error?: string;
}