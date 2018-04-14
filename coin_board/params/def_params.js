/**
 * @file All {@link pages} default view engine params
 * @author Trevis Gulby
 */

const Myconf = require('../controllers/config_methods');

const confell = new Myconf();

const tickers = require('./tickers');

let cdns = {
    socket: 'https://cdnjs.cloudflare.com/ajax/libs/' + 'socket.io/2.0.4/socket.io.js',
    chartjs: 'https://cdnjs.cloudflare.com/ajax/libs/' + 'Chart.js/2.7.1/Chart.min.js',
    cryptojs: 'https://cdnjs.cloudflare.com/ajax/libs/' + 'crypto-js/3.1.9-1/crypto-js.min.js',
    web3: 'https://cdn.jsdelivr.net/npm/web3@0.19.0/dist/web3.min.js',
};

let param = {
    assets:
    {
        title: 'My assets',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'index',
        page: 'assets',
        scripts:
        {
            socketio: cdns.socket,
            chartcdn: cdns.chartjs,
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            centerblock: 'blocks/assets/my_assets',
        },
        symb: tickers,
    },
    index:
    {
        title: 'Coin_Board',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'index',
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
        },
    },
    livestream:
    {
        title: 'Live trading charts',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'livestream',
        scripts:
        {
            socket: cdns.socket,
            trade: '/tradestream.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            ticker: 'blocks/index/ticker_panel',
            livestream: 'blocks/index/tradestream',
        },
    },
    login:
    {
        title: 'Login',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'login',
        scripts:
        {
            socketio: cdns.socket,
            cryptojs: cdns.cryptojs,
            mysocket: '/auth_socket.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            topblock: 'blocks/login/login_block',
        },
    },
    profile:
    {
        title: 'Profile',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'profile',
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            topblock: 'blocks/profile/my_profile',
        },
    },
    signin:
    {
        title: 'Signin',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'signin',
        scripts:
        {
            socketio: cdns.socket,
            web3cdn: cdns.web3,
            myweb3: '/web3_checkaddress.js',
            mysocket: '/signin_socket.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
            topblock: 'blocks/signin/signin_block',
        },
    },
    error:
    {
        title: 'Coin_B. => ItsA(NastyBUG)',
        author: '© Copyright 2018 coin_board',
        tsurl: confell.runningaddrs.appsurl,
        tvurl: confell.runningaddrs.appvurl,
        page: 'error',
        scripts:
        {
            reload: '/to_homepage.js',
        },
        blocks:
        {
            jumbo: 'blocks/all/my_jumbotron',
        },
    },
};

module.exports = param;
