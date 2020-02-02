import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  HttpModule,Http } from '@angular/http';
import { LogsComponent } from '../../infrastructure/logs/logs.component';
import { LoginService } from './login.service';
import { EnumLogType,EnumLogPriority } from '../../infrastructure/enums/enumlog';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";
import { EnumCategoryD, EnumTypeD, EnumIconD } from '../../infrastructure/enums/enumdialog';
import { NotificationsComponent } from '../../infrastructure/components/notifications/notifications.component';
import { GetVersionAPIRequest } from './model/GetVersionAPIRequest.model';
import { SweetAlertComponent } from '../../infrastructure/components/sweetalert/sweetalert.component';
import { EnumReturnCode } from '../../infrastructure/enums/enumBasicResponse';
//import { DeviceDetectorService } from 'ngx-device-detector';
import { SystemContext } from '../../infrastructure/context/model/systemcontext';


declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'login-cmp',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit{
    test : Date = new Date();
    UserName:string;
    IsValidUserName:boolean = false;
    IsInValidUser:boolean = false;
    public result:InputSimpleModel = new InputSimpleModel();
    configs:Array<any>;
    ambiente:string;
    version:string;
    WelcomeMessage:string;
    errorConfig:boolean;
    canloggin:boolean=false;
    private subscriptionTimer: Subscription;
    VersionRequest:GetVersionAPIRequest = {};
    deviceInfo = null;
    ShowErrorMessage:boolean = false;

    constructor(private route: ActivatedRoute,
                private router: Router,private http:Http, private logsComponent:LogsComponent, private loginService:LoginService,
                private _NotificationsComponent:NotificationsComponent,private _SweetAlertComponent:SweetAlertComponent,
                private _systemContext:SystemContext,
               
                
            )
    {
      

    }
    
    //decide que background poner
    checkFullPageBackgroundImage(){
        debugger
        var $page = $('.full-page');
        
        var image_src = $page.data('image1');
        var now= new Date().getHours();
        if(now>=5 && now<17)
        {
            var image_src = $page.data('image1');
        }
        else if(now>=17 && now<21)
        {
            var image_src = $page.data('image2');
        }
        else if(now>=21 )
        {
            var image_src = $page.data('image3');
        }
        
        

        if(image_src !== undefined){
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };



    ngOnInit(){
      
        //Se intenta obtener la ip  
        this.loginService.getIP()
        .subscribe(res=> {
          debugger
        this.VersionRequest.IP = JSON.stringify(res);
        //this.LoadingConfigAndDataAccess();
        }, error => {//si falla el servicio de get ip , lanzar de todas maneras el loading config
          //this.LoadingConfigAndDataAccess();
        });
        
        this.checkFullPageBackgroundImage();
        this.canloggin=true;
        

        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)

       
    }
    // //message: "Welcome to <b>SySin</b> a beautiful Inventory System for web  <b>Enjoy!</b>."
    

    //verficara si el api url esta en linea
    StartIntenterLogin(){

        // subscribing to a observable returns a subscription object
        let timer = TimerObservable.create(25000,25000);

         this.subscriptionTimer = timer.subscribe(t => {
            //flag para saber si se puede hacer login
           if(this.canloggin == false)
           {
             //guarda un log de lo que esta pasando
             this.logsComponent.SaveLog('StartIntenterLogin','LoginComponent','StartIntenterLogin',EnumLogType.Info,EnumLogPriority.Low,false,true)
             //miuestra notificacion 
             //this._NotificationsComponent.ShowMessageNotify(EnumCategoryD.notification,EnumTypeD.error,'No se ha podido Establecer conexion con los datos.')
           
              //como no obtuvo la version del api intentara nuevamnete
             this.loginService.GetVersionAPI(this.VersionRequest).subscribe(Response => {
               //version del api
               this.version = Response.Version;
               this.WelcomeMessage = Response.WelcomeMessageSystem;
             }, error => {//si hay algun error lo muestra en una notificacion
              this._NotificationsComponent.ShowMessageNotify(EnumCategoryD.message,EnumTypeD.info,'No se ha podido Establecer conexion con los datos.')            
               this.errorConfig=true;
               this.ambiente='No InitInfo';//se establece que no hay un verson y por lo tanto no hay ambiente
          

             }, () => {//la url del api contesto con la version por lo tanto la puede ver
              if(this.version != ''){
                this.canloggin=true;
                this._NotificationsComponent.ShowMessageNotify(EnumCategoryD.message,EnumTypeD.success,this.WelcomeMessage)
             
              }
               
             }); 
           }





        });
       
      }

      GetInformationDevice() {
       
        try{

          //se intenta obtener el device info monica gabriela martinez esparza
        // this.VersionRequest.DeviceInfo = "browser|"+this.deviceService.getDeviceInfo().browser+
        // "browser_version|"+this.deviceService.getDeviceInfo().browser_version+
        // "device|"+this.deviceService.getDeviceInfo().device+
        // "os|"+this.deviceService.getDeviceInfo().os+
        // "os_version|"+this.deviceService.getDeviceInfo().os_version+
        // "userAgent|"+this.deviceService.getDeviceInfo().userAgent;      
        

        }
        catch(error){

        }
        
    }

        //cargar las configuraciones iniciales para saber si hay coneccin a la api
    LoadingConfigAndDataAccess(){

      //obtener informacion del deivce
      this.GetInformationDevice()
        //se optiene la url y desmas atrinutos inciales
        this.http.request('assets/config/webconfig.json').subscribe
        (response =>{

          try{
            this.configs = response.json();
            debugger
            if(this._systemContext != undefined){

              this._systemContext.APIURL = this.configs["APIURL"];
              this._systemContext.SSOURL = this.configs["SSOURL"];
              this._systemContext.ISDEVQA = this.configs["SSOURL"];
              this._systemContext.TIMETOINACTIVITY = this.configs["TIMETOINACTIVITY"];
              this._systemContext.CanShowErrorMessages = this.configs["CanShowErrorMessages"];
              this._systemContext.LogConsole = this.configs["LogConsole"];
              this._systemContext.LogDataBase = this.configs["LogDataBase"];
              this._systemContext.LogLocalStorage = this.configs["LogLocalStorage"];

            }
            //se guardan en el storage para tenerlos a la mano
             localStorage.setItem('APIURL', this.configs["APIURL"]);
             localStorage.setItem('SSOURL', this.configs["SSOURL"]);
             localStorage.setItem('ISDEVQA', this.configs["ISDEVQA"]);
           

            this.ambiente=localStorage.getItem('APIURL');          
           

            //se inteta obtener la version
            this.loginService.GetVersionAPI(this.VersionRequest).subscribe(Response => {
              //se obtiene la versoin     
              if(Response.ReturnCode == EnumReturnCode.success.toString()){
                this.version = Response.Version;
                this._NotificationsComponent.ShowMessageNotify(EnumCategoryD.message,EnumTypeD.success,Response.WelcomeMessageSystem+" "+this.version+" <b>Enjoy!</b>.")
  
              }
              
            }, error => {//no se pudo estabecler conexion con el api por lo tanto se reintentara cada cierto tiempo

              this.errorConfig=true;
              this.ambiente='No InitInfo';
              
              //desplesgar dialog con opciones y returno de respuesta
              // this._SweetAlertComponent.showSwalDialog(EnumCategoryD.question,
              //   'Cuidado','No se ha podido Establecer conexion con los datos:'+localStorage.getItem('APIURL'),
              //   EnumIconD.warning).then(xres=>{
              //     debugger;
              //   });

              this._SweetAlertComponent.showSwalDialog(EnumCategoryD.message,
                'Cuidado','No se ha podido Establecer conexion con los datos:'+localStorage.getItem('APIURL'),
                EnumIconD.cross).then(xres=>{
                  debugger;
                });

              //escribir en los logs
              this.logsComponent.SaveLog('Error','LoginComponent-LoadingConfigAndDataAccess',error,EnumLogType.Error,EnumLogPriority.Hight,true);
              //metodo para reinternar y reintentar
              this.StartIntenterLogin()
             
            }, () => {              
              this.canloggin=true;
            });


          }
          catch(error){            
            this.errorConfig=true;
            this.ambiente='No one';
            this._SweetAlertComponent.showSwalDialog(EnumCategoryD.question,
              'ERROR',error,
              EnumIconD.warning).then(xres=>{
                debugger;
              });
            //alert(error);
          }

        })
      }

    ValidUser(){
      debugger
      if(this.result.User.toUpperCase() =='CARLOS')
      {
        this.IsValidUserName = true;
        this.IsInValidUser = false;
        this.ShowErrorMessage = false;
      }
       

      else
      {
        this.IsInValidUser = true;
        this.IsValidUserName = false;
       
      }

    }

    Login(){
        debugger

        if(this.result.User == ''){
          this.ShowErrorMessage = true;
          this.IsInValidUser = true;
          return false;
        }
        else{
         
          this.ShowErrorMessage = false;
          
        }
        

      localStorage.setItem('currentUser','X');
        this.router.navigate(['/dashboard']);
    }


}

export class InputSimpleModel{
    Result:boolean = true;
    User:string = "";
    Nombre:string = "";
    Password:string = "";

}
