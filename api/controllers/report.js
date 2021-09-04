// status - The current status of the URL. check.status
// availability - A percentage of the URL availability. (total visits with status = UP) / all visits
// outages - The total number of URL downtimes. => all visits with status = DOWN
// downtime - The total time, in seconds, of the URL downtime.
// uptime - The total time, in seconds, of the URL uptime.
// responseTime = all visits with status = UP => sum(duration) / length of array
// history - Timestamped logs of the polling requests. all visits with check_id
const Visit = require('../models/visit');
const Report = require('../models/report');
const Check = require('../models/check');

exports.get_report = async (req, res, next) => {

    let visitList = await Visit.find({ check_id: req.params.checkId }).sort({ startTime: 'ascending' }).exec();
    let upVisits = visitList.filter(visit => visit.status.localeCompare("UP") == 0);
    let downVisits = visitList.filter(visit => visit.status.localeCompare("DOWN") == 0);
    let check = await Check.findById(req.params.checkId).select('status');

    let availability = upVisits.length / visitList.length;
    let outages = downVisits.length;
    
    var responseTime = 0;
    visitList.forEach(visit => {
        responseTime += visit.duration
    });
    responseTime = responseTime / visitList.length;

    var upTime = 0, downTime = 0;
    for (let index = 0; index < visitList.length - 1; index++) {
        if(visitList[index].status == "UP"){
            upTime += (visitList[index + 1].startTime - visitList[index].startTime);
        }
        else{
            downTime += (visitList[index + 1].startTime - visitList[index].startTime);
        }
        
    }
    upTime = upTime / 1000;
    downTime = downTime / 1000;
    res.status(201).json({
        message: 'list',
        status: check.status,
        availability: availability * 100 + ' %',
        outages,
        responseTime,
        upTime,
        downTime,
        history: {
            totalVisits: visitList.length,
            visitList
        }
    });
}

