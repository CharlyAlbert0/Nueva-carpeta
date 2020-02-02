export class LogRequest {
    IdLog?:number;
    Type?:number;
    Proyect?:string;
    SessionGuid?:string;
    IdUser?:number;
    ClientDatetime?:Date;
    ServerDatetime?:Date;
    Message?:string;
    StackTrace?:string;
    Priority?:number;
    ExceptionMessage?:string;
}