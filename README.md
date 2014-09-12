# SQL transport for winston

For querying need database driver like:
```
$ npm install mysql
$ npm install mariasql
$ npm install pg
$ npm install sqlite3
```

## Options

### Useing knex.js so configuration look like: 
#### http://knexjs.org/#Installation-client

```js
var mysql = {
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
};
winston.add(SQL, mysql)

var pg = {
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING
};
winston.add(SQL, pg)

var sqlite3 = {
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
};
winston.add(SQL, sqlite3)
```

### Other options:
* table - name of table in db, default logger
* label - like in other transports
* forceSync - clear database structure after start ( for testing mb)
* scheme - database scheme configured like there: http://knexjs.org/#Schema
 
 ```js
 //default scheme
 function(t){
	t.timestamp('timestamp');
	t.string('label', 12);
	t.string('level', 12);
	t.string('message');
	t.string('meta');
 }
 ```