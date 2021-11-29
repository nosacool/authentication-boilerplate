import User = require("../../app/Models/User");
import UserInterface from "../Interfaces/User.Interface";
import BaseRepository from "./BaseRepository";


export default class UserRepository extends BaseRepository implements UserInterface{

    
    constructor(model :typeof User) {
        super(model)
    }
    async create(data) {
        try {
            const user = await User.create(data)
            return user
        } catch (error) {
            return null
        }
        

    }

    
}