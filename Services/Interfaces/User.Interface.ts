import User = require("../../app/Models/User");
import BaseInterface from "./Base.Interface";

export default interface UserInterface extends BaseInterface{
    create(data:Object)
    findOneBy(string:String,data:String):Promise<User>
}