const http = require( 'http' );
const fs = require( 'fs' );
const Crud = require( '../methods/mongo_crud' );
const colors = require( './djunk/colors' );
const reqmodels = require( './djunk/reqmodels' );
const eatdiner = require( './djunk/eatdiner' );

/**
* DataJunk class constructor
*/
function DataJunk() {
        this.reqmodels = reqmodels;
}

/**
* Operations Pour tout les elements dans parseme (obj: )
* @param {Object} dset results from feeds array in db
* @return {Object} res parsed and colored data feed
*/
DataJunk.prototype.eat = function( dset ) {
        let ts = {
                nb: 0,
                val: 0,
        };
        let res = [];
        let parseme = eatdiner.getparsed( dset, ts );

        for ( let a in parseme ) {
                if ( parseme[a] ) {
                        eatdiner.checkwhat( parseme, a );
                        for ( let b in colors ) {
                                if ( colors[b] ) {
                                        eatdiner.checkstyle( b );
                                        for ( let c in colors[b].sets ) {
                                                if ( colors[b].sets[c] ) {
                                                        for ( let d in colors[b].sets[c] ) {
                                                                if ( colors[b].sets[c][d] ) {
                                                                        let obj = {
                                                                                wh: parseme[a].toLowerCase(),
                                                                                wr: colors[b].sets[c][d],
                                                                                id: b,
                                                                                cmp: res[ts.val - 1],
                                                                                tg: '',
                                                                        };
                                                                        // eatdiner.checkwrd( obj.wr, obj.wh );
                                                                        if ( colors[b].check( obj ) ) {
                                                                                res[ts.val] = eatdiner.getres( obj, ts );
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                }
        }
        log = '[[RESULTS:\t=>[' + res.length + '] results found!]]';
        if ( process.env.NODE_LOG == 'djunk' ) {
                console.log( log );
        }
        return res = res.filter( function( n ) {
                return n != undefined;
        } );
};

/**
* @param {string} where
* @param {function} callback
*/
DataJunk.prototype.begdata = function( where, callback ) {
        let req = http.get( where.req, function( res ) {
                let bodyChunks = [];
                res.on( 'data', function( chunk ) {
                        bodyChunks.push( chunk );
                } ).on( 'end', function() {
                        let body = Buffer.concat( bodyChunks );
                        let test = JSON.parse( body );
                        let clean = [];
                        if ( test.query && test.query.results ) {
                                let r = test.query.results;
                                for ( it in r.item ) {
                                        if ( r.item[it] ) {
                                                let elem = r.item[it];
                                                let i = where.id;
                                                let d = elem.description;
                                                let dsc = where.clean( i, d );
                                                elem.description = dsc;
                                                clean[it] = elem;
                                        }
                                }
                        }
                        callback && callback( clean );
                } );
        } );
        req.on( 'error', function( e ) {
                console.log( 'DataJunk -ERROR: ' + e.message );
                if ( e ) {
                        throw e;
                }
                callback && callback( e );
        } );
};

/**
* wr stand for write file
* @param {string} fn file name
* @param {Object} d data to write json fmt
* @return {Promise} d corresponding to writed data
*/
DataJunk.prototype.wr = function( fn, d ) {
        return new Promise( ( resolve, reject ) => {
                ROOT_APP_PATH = fs.realpathSync( '.' );
                fs.writeFile( fn, JSON.stringify( d ) + '\n', function( err ) {
                        if ( err ) {
                                let log = 'DataJunk: Write datas error ' + err;
                                process.env.NODE_ENV == 'development'
                                        ? console.log( log )
                                        : log;
                                reject( err );
                        } else {
                                let log = 'Write news to DTAFOOD/news ';
                                process.env.NODE_ENV == 'development'
                                        ? console.log( log )
                                        : log;
                                resolve( d );
                        }
                } );
        } );
};

DataJunk.prototype.goshopping = function( where ) {
        return new Promise( ( resolve, reject ) => {
                let data = new DataJunk();
                data.begdata( where, function( res, err ) {
                        if ( res ) {
                                data.wr( where.fname, res ).then( function( r ) {
                                        resolve( r );
                                        return r;
                                } ).catch( function( rej, err ) {
                                        if ( err ) {
                                                reject( err );
                                                throw err;
                                        }
                                } );
                        } else if ( !res || err ) {
                                reject( err );
                        }
                } );
        } );
};

DataJunk.prototype.dbthis = function( s, callback ) {
        const crud = new Crud( 'test2' );
        let insert = {};
        insert.srcname = s.id;
        insert.srcurl = s.url;
        insert.feed = s.d;
        crud.insert( 'DTAFOOD', insert, function( res, err ) {
                let log = 'DATA_JUNK | Done !\nInserted ' + insert.feed.length;
                log += ' News 0 : ' + insert.feed[0].title;
                process.env.NODE_ENV == 'development'
                        ? console.log( log + '\n' + res.results )
                        : log;
                if ( err ) {
                        callback && callback( err );
                        throw err;
                } else {
                        callback && callback( res );
                }
        } );
};

DataJunk.prototype.digest = function( what ) {
        return new Promise( function( resolve, reject ) {
                let data = new DataJunk();
                if ( !( what && what.id && what.path ) ) {
                        let e = new Error( 'bad meal can\'t digest' );
                        reject( e );
                } else {
                        let writed = require( '../.' + what.path );
                        what.d = writed;
                        data.dbthis( what, function( res, err ) {
                                if ( res ) {
                                        resolve( res );
                                        return res;
                                } else if ( err ) {
                                        reject( err );
                                        throw err;
                                }
                        } );
                }
        } );
};

DataJunk.prototype.pukedata = function( what ) {
        let crud = new Crud( 'test2', 'DTAFOOD' );
        return new Promise( ( resolve, reject ) => {
                what
                        ? what
                        : {};
                crud.find( what, function( res, err ) {
                        if ( res && res[0] && res[0].feed ) {
                                resolve( res );
                        } else if ( err ) {
                                reject( err );
                        }
                } );
        } );
};

/**
* Launch data crawl
* @param {Object} where source id
*/
function goeat( where ) {
        const data = new DataJunk();
        data.goshopping( where ).then( function( res ) {
                if ( res ) {
                        let d = {
                                id: where.id,
                                path: where.fname,
                                url: where.url,
                        };
                        data.digest( d ).then( function( res ) {
                                if ( res ) {
                                        let log = 'DTAJNK: New feed';
                                        log += ' inserted in db';
                                        process.env.NODE_ENV == 'development'
                                                ? console.log( log )
                                                : log;
                                }
                        } ).catch( function( rej, err ) {
                                if ( err || rej ) {
                                        throw err;
                                }
                        } );
                }
        } ).catch( function( rej, err ) {
                if ( err || rej ) {
                        throw err;
                }
        } );
}

/**
* Simple launch data mining aka 'eat' function
*/
function testmarks() {
        const data = new DataJunk();
        data.pukedata( {} ).then( function( res ) {
                let test = data.eat( res );
                if ( process.env.NODE_LOG == 'djunk' ) {
                        console.log( test );
                }
        } );
}

if ( process.env.LAUNCH_TASK == 'markme' ) {
        testmarks();
} else if ( process.env.LAUNCH_TASK == 'goeat' ) {
        goeat( reqmodels.ctaf );
}

module.exports = DataJunk;