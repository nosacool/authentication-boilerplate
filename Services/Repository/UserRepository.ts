import User = require("../../app/Models/User");
import UserInterface from "../Interfaces/User.Interface";
import BaseRepository from "./BaseRepository";


export default class UserRepository extends BaseRepository implements UserInterface{

    model = User
    constructor() {
        super(User)
    }
    async create(data) {
        try {
            const user = await this.model.create(data)
            return user
        } catch (error) {
            return null
        }
    }

    

    
}