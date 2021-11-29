'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (collection) => {
      collection.index('email', {email: 1}, {unique: true})
      collection.index('fullname').nullable()
      collection.index('password').nullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
