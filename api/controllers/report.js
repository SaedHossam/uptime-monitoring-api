const Visit = require('../models/visit');
const Check = require('../models/check');

exports.get_report = async (req, res, next) => {

    const user_id = req.userData.userId;
    const c = await Check.findById(req.params.checkId).exec((err, c) => {
        if(err){
            return res.status(500).json({message:"Server Error", err});
        }
        if(!c){
            return res.status(404).json({message:"Not Found"});
        }
        if(c.user_id != user_id){
            return res.status(403).json({message:"forbidden", err});
        }
    });
    try {
        let visitList = await Visit.find({ check_id: req.params.checkId }).sort({ startTime: 'ascending' }).exec();
        let upVisits = visitList.filter(visit => visit.status.localeCompare("UP") == 0);
        let downVisits = visitList.filter(visit => visit.status.localeCompare("DOWN") == 0);
        let check = await Check.findById(req.params.checkId).select('status name');

        let availability = upVisits.length / visitList.length;
        let outages = downVisits.length;

        var responseTime = 0;
        visitList.forEach(visit => {
            responseTime += visit.duration
        });
        responseTime = responseTime / visitList.length;

        var upTime = 0, downTime = 0;
        for (let index = 0; index < visitList.length - 1; index++) {
            if (visitList[index].status == "UP") {
                upTime += (visitList[index + 1].startTime - visitList[index].startTime);
            }
            else {
                downTime += (visitList[index + 1].startTime - visitList[index].startTime);
            }

        }
        upTime = upTime / 1000;
        downTime = downTime / 1000;
        res.status(201).json({
            message: 'Report on ' + check.name,
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
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server Error!" });
    }

}

