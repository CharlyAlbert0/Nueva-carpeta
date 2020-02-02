import { Component, OnInit,Inject,Input, Output, EventEmitter } from '@angular/core';
import { LogsModel} from './model/logsmodel';
import { LogsService } from './logs.service';
// import {MD_DIALOG_DATA} from '@angular/material';
import { ClientErrorModel } from './model/clienterror';
import { Headers, Http, RequestOptions, RequestMethod,Response } from '@angular/http';
import { errorSubscribeModel } from './model/errorSubscribe';
import { errorSubscribeBodyModel } from './model/errorSubscribeBody';
import { SystemContext } from '../context/model/systemcontext';
import { SweetAlertComponent } from '../components/sweetalert/sweetalert.component';
import { EnumCategoryD, EnumIconD } from '../enums/enumdialog';

@Component({
  selector: 'logs-app',
  templateUrl: './logs.component.html',
})
export class LogsComponent implements OnInit {
  //ListLogs: LogsModel[] = new Array<LogsModel>();

  //emisores de listas
  @Input() ListLogs: LogsModel[]= new Array<LogsModel>();
  @Output() ListLogsEmisor: EventEmitter<LogsModel[]> = new EventEmitter();

  // LogPriorityFilter:SelectItem[];
  // LogTypeFilter:SelectItem[];

  constructor(private _LogsService: LogsService,
              private systemContext:SystemContext,private _SweetAlertComponent:SweetAlertComponent) {  }

  getGlobalAttributes(): void {
    this._LogsService.getLogs().subscribe(result => {
      this.ListLogs = result;
    });
  }

  ngOnInit() {
    this.getGlobalAttributes();
    this.GetFilterList();

  }

  GetFilterList(){
    // this.LogPriorityFilter=[];
    // this.LogTypeFilter=[];
    // for (let enumValue in EnumLogPriority) {
    //   if (isNaN(Number(enumValue))) {
    //        this.LogPriorityFilter.push({label:enumValue,value:EnumLogPriority[enumValue]})
    //    }
    // }
    // for (let enumValue in EnumLogType) {
    //   if (isNaN(Number(enumValue))) {
    //        this.LogTypeFilter.push({label:enumValue,value:EnumLogType[enumValue]})
    //    }
    // }


  }

  Update(lga:LogsModel[]){
    this.ListLogs = null;
  }

  Refresh(){
      this.getGlobalAttributes();
  }

  SaveLog(title: string,section:string,errorSubscribe:errorSubscribeModel | any,type:number,Priority:number,IsAlert:boolean,IsOpenBitacora?:boolean){
    debugger

    //si hay contexto o no para poder mandar los logs
    if(this.systemContext != null && this.systemContext.ISDEVQA)
    {
      if(errorSubscribe != null || errorSubscribe != undefined){
        let objLog:LogsModel = new LogsModel();
        objLog.Message=errorSubscribe != null ? errorSubscribe.toString():'';
        objLog.Priority= Priority;
        objLog.Type=type;
        objLog.Proyect = section;
        objLog.SessionGuid = this.systemContext.CurrentUser.SessionGuid == undefined ? "" : this.systemContext.CurrentUser.SessionGuid;
        objLog.IdUser = this.systemContext.CurrentUser.userId == undefined ? 0: this.systemContext.CurrentUser.userId;
        objLog.StackTrace = ""; //ver como sacarlo
        objLog.ExceptionMessage =""; //ver como sacarlo
        objLog.ClientDatetime = new Date();
        this._LogsService.AddLog(objLog);
      }
      
    }

    // if(localStorage.getItem('ISDEVQA'))
    // {
    //   let xs= localStorage.getItem('ISDEVQA')
    //   if( xs == '1' && IsOpenBitacora == true){
    //       this.systemContext.openBitacora = true;
    //   }

    // }   
    
    let errMsg:any;
    let err
    let isResponseError:boolean=false;
    if (errorSubscribe instanceof Response) {
      const body = errorSubscribe.json() || '';
      err = body.error || JSON.stringify(body);
      //errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errMsg =errorSubscribe;
      isResponseError = true;
      err = "Response OK:"+errorSubscribe.ok+" Status:"+errorSubscribe.status+" StatusText:"+errorSubscribe.statusText
      +" URL:"+errorSubscribe.url;
    } 
    else {
      errMsg = errorSubscribe.message ? errorSubscribe.message : errorSubscribe.toString();
    }
    debugger
    //si se pueden mostrar mensajes de error
    if(this.systemContext != undefined && this.systemContext.CanShowErrorMessages == "1"){

      this._SweetAlertComponent.showSwalDialog(EnumCategoryD.message,
        'Error',isResponseError == false ? errMsg:err,
        EnumIconD.cross).then(xres=>{
          debugger;
        });
    }
  }

  InsertError(error: string,section:string,errorSubscribe:errorSubscribeModel,willShowUser:boolean = false){
    debugger
    try{


      let errorClientErrorModel = new ClientErrorModel(error,section);
      errorClientErrorModel.error=error+"/"+errorSubscribe._body;
      errorClientErrorModel.section=section;

      this._LogsService.clientLogError(errorClientErrorModel);

      if(willShowUser){
        var jsonObj=JSON.parse(errorSubscribe._body);
        if(jsonObj.error_description == null)
           jsonObj.error_description=jsonObj.error;
        if(jsonObj.message != null && jsonObj.error_description == null)
           jsonObj.error_description=jsonObj.message;

        
      }
    }
    catch(error){
     
    }


  }

}
