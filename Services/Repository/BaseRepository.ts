import Model from "@adonisjs/lucid/src/Lucid/Model";
import BaseInterface from "../Interfaces/Base.Interface";


export default class BaseRepository implements BaseInterface{
    protected model

    constructor(model : typeof Model){
        this.model = model;
      }
    
    async find(id:number){
      return await this.model.find(id)
    }

      

      



}

