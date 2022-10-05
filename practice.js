const e = require("express");

const database = {
  users: [
    {
      id: '123',
      name: 'Hunkle',
      email: 'hunkleStats@gmail.com',
      password: '120598',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Kirei',
      email: 'kireicooks@gmail.com',
      password: '072018',
      entries: 0,
      joined: new Date()
    }
  ]
}

//grab all id values in this array under users

let search = '1200';
let found = false;

database['users'].forEach(user => {
  if (user['id'].includes(search)) {
    found = true;
  } 
})

console.log(found);