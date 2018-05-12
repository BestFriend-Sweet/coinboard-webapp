/**
 * @file Showfiles aka {@link module:cbbot~telegrambot.showfiles}
 * bot method definition
 * @author Trevis Gulby
 * @license MIT
 */

const {
    spawn,
} = require('child_process');
/** The Telegram bot /tree command object
 * @namespace
 * @memberof module:cbbot~telegrambot
 * @property {string} id telegram bot style command, '/ + $cmd'
 * @property {function} func the actual command, here lanch 'tree $datadir' cmd
 */
const showfiles = {
    id: '/tree',
    func: function(args, usr, callback) {
        const fp = './DTAFOOD/';
        const ls = spawn('tree', [fp]);
        ls.stdout.on('data', (data) => {
            resp = data.toString();
            callback && callback(resp);
        });

        ls.stderr.on('data', (data) => {
            resp = 'ERROR : \n';
            resp += data.toString();
            callback && callback(resp);
        });

        ls.on('close', (rt) => {
            let log = 'COINBOARD_BOT: "$ tree" child process exit with code [';
            log += rt + ']';
            process.env.NODE_ENV === 'development' ? console.log(log) : log;
        });
    },
};
module.exports = showfiles;
