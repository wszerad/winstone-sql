var Knex = require('knex'),
	Transport = require('winston').Transport;

var SQL = function(options){
	Transport.call(this, options);

	options = options || {};

	options.onready = options.onready || function(){};

	this.label = options.label || null;
	this.table = options.table || 'logger';

	this.scheme = options.scheme || function(t){
		t.timestamp('timestamp');
		t.string('label', 12);
		t.string('level', 12);
		t.string('message');
		t.string('meta');
	};

	this._sql = Knex({
		client: options.client,
		connection: options.connection
	});

	this._table(options.forceSync, options.onready);
};

util.inherits(SQL, Transport);

SQL.prototype.name = 'sql';

SQL.prototype.log = function(level, msg, meta, callback){
	var self = this,
		db = this._sql;

	db(self.table).insert({
		timestamp: new Date(),
		level: level,
		label: self.label,
		message: msg,
		meta: JSON.stringify(meta)
	}).exec(callback);
};

SQL.prototype.query = function(options, callback){
	var self = this,
		db = this._sql,
		options = options || {},
		query = db(self.table).select(options.fields || '*');

	if(options.from)
		query.where('timestamp', '>', options.from);

	if(options.until)
		query.where('timestamp', '<', options.until);

	if(options.limit)
		query.limit(options.limit);

	if(options.start)
		query.offset(options.start);

	if(options.order)
		query.orderBy('timestamp', options.order==='desc'? 'desc' : 'asc');

	query.exes(function(err, ret){
		if(err)
			callback(err);

		ret = ret.map(function(ele){
			ele.meta = (ele.meta.length>1)? JSON.parse(ele.meta) : {};
			return ele;
		});

		callback(null, ret);
	});
};

SQL.prototype._table = function(force, callback){
	var self = this,
		db = this._sql;

	function create(){
		return db.schema.createTable(self.table, self.scheme);
	}

	if(force)
		db.schema.dropTableIfExists(self.table).then(create).exec(callback);
	else
		db.schema.hasTable(self.table).then(function(exists){
			if(!exists)
				return create().exec(callback);
			else
				callback(null);
		});
};

exports.SQL = SQL;