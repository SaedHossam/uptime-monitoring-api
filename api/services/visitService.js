const axios = require('axios').default;
const https = require('https');
const http = require('http');

const Check = require('../models/check');
const Visit = require('../models/visit');

const mailService = require('../services/mailService');

function init() {
  Check.find({ paused: false })
    .exec()
    .then(result => {
      result.forEach(c => {
        console.log(c.name);
        run(c._id, c);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

async function run(_id, check) {
  // SetInterval
  setInterval(async () => {
    check = await Check.findById(_id);
    var start, end, status;
    const url = check.protocol + '://' + check.url;
    if (typeof check.port != 'undefined') url += ':' + check.port;
    if (typeof check.path != 'undefined') url += check.path;

    const instance = axios.create({
      auth: {
        username: check.authentication.username,
        password: check.authentication.password
      },
      headers: check.headers,
      httpAgent: new http.Agent({
        keepAlive: true,
        rejectUnauthorized: check.ignoreSSL
      }),
      httpsAgent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: !check.ignoreSSL
      }),
      timeout: check.timeout * 1000,
      transformResponse: [function (data) {
        end = new Date();
        return data;
      }],
    });

    instance.interceptors.request.use(function (config) {
      start = new Date();
      return config;
    }, function (err) {
      return Promise.reject(err);
    });

    instance.get(url)
      .then(function (res) {
        status = "UP";
        console.log('check: ', check.name, res.status);
      })
      .catch(async function (err) {
        end = new Date();
        status = "DOWN";
        console.log('check: ', check.name, 'Error:', err.message);
      }).finally(async () => {
        check = await updateStatus(check, status, start, end);
      });
  }, check.interval);
}

async function updateStatus(check, status, startTime, endTime) {
  // Check if status updated
  if (check.status.localeCompare(status) != 0) {
    // if 
    if (status.localeCompare("DOWN") == 0 && check.remaining_threshold > 0) {
      check = await Check.findByIdAndUpdate(check._id, { remaining_threshold: check.remaining_threshold - 1 }, { new: true });
    }
    else {
      console.log('Send Mail:- Website is ', status, ' was ', check.status);
      check = await updateCheck(check, status);
      mailService.notifyUser(check);
      //sendMailStatusUpdated(status);
    }
  }
  // 1- Create new visit
  new Visit({
    check_id: check._id,
    status,
    startTime,
    endTime,
    duration: endTime - startTime
  }).save()
    .then((res) => {
    })
    .catch((err) => console.log('Error while adding new visit\n', err));
    return check;
}

async function updateCheck(check, status) {
  check = await Check.findByIdAndUpdate(check._id, { status }, { new: true });
  return check;
}


module.exports = { init, run }