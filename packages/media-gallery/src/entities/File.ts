export interface IFile{
    name: string
}

export enum RefreshStatus {
    None,
    LOADING,
    SUCCEEDED,
    FAILED
}