import { Injectable } from '@angular/core';
import {GlobalAttributesModel} from '../../globalattributes/model/globalattributesmodel';
import { UserModel } from '../../../users/model/user.model';

Injectable()
export class SystemContext{
    APIURL:string;
    SSOURL:string;
    EndSession:boolean;
    public menuItems: any[];
    CurrentGlobalAttributes:GlobalAttributesModel[];
    openBitacora:boolean = false;
    VersionAPI:string;
    VersionSYSIN:string;
    ISDEVQA:boolean =false;
    TIMETOINACTIVITY:number = 1800;
    CanShowErrorMessages:string = "0";
    LogConsole:string ="0";
    LogDataBase:string = "0";
    LogLocalStorage:string="0";
    CurrentUser:UserModel =  new UserModel();

}
