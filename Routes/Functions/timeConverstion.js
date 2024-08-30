function convertToAMPM(time) {
    // Check if the input is in the correct format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
    if (!timeRegex.test(time)) {
        return "Invalid time format";
    }

    // Extract hours, minutes, and seconds
    const [hours, minutes, seconds] = (time.split(':').map(Number));

    // If seconds are not provided, set them to 0
    const formattedSeconds = seconds >= 0 ? (seconds < 10 ? '0' + seconds : seconds) : '00';

    // Convert hours to AM/PM format
    let ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    // Construct the new time format string
    const convertedTime = `${displayHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return convertedTime;
}


function getTimeOfDay(time) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;

    if (!timeRegex.test(time)) {
        return "Invalid time format";
    }

    const hours = parseInt(time.split(':')[0]);

    if (hours >= 5 && hours < 12) {
        return 'Morning';
    } else if (hours >= 12 && hours < 17) {
        return 'Afternoon';
    } else if (hours >= 17 && hours < 21) {
        return 'Evening';
    } else {
        return 'Night';
    }
}

function getTimeByAbbreviation(abbreviation) {
    const timeRanges = {
        'morning': { start: '05:00', end: '11:59' },
        'afternoon': { start: '12:00', end: '16:59' },
        'evening': { start: '17:00', end: '20:59' },
        'night': { start: '21:00', end: '23:59' },
    };

    const timeRange = timeRanges[abbreviation];
    if (timeRange) {
        return { $gte: timeRange.start.toString(), $lte: timeRange.end.toString() };
    } else {
        return "Unknown abbreviation";
    }
}



function getUniqueSchedules(schedules) {
    const uniqueSchedules = [];
    const uniqueSet = new Set();

    schedules.forEach(schedule => {
        const key = `${schedule.startDate}_${schedule.endDate}_${schedule.startTime}_${schedule.endTime}_${schedule.timeZone}`;
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            uniqueSchedules.push(schedule);
        }
    });
    return uniqueSchedules;
}

function convertToDate(startDate) {
    const parts = startDate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

module.exports = { convertToAMPM, getTimeOfDay, getTimeByAbbreviation, getUniqueSchedules, convertToDate }
