function onFormSubmit(e) {
  // parse the event object
  var requestDetails = {
    name: e.namedValues['Name'][0],
    email: e.namedValues['Email'][0],
    approver: e.namedValues['Approver'][0],
    startDate: new Date(e.namedValues['Start'][0]),
    endDate: new Date(e.namedValues['End'][0]),
    details: e.namedValues['Details'][0],
  }
  
  var valid = areDatesValid(requestDetails.startDate, requestDetails.endDate);
  if (!valid) {
    return mailer('invalidDates, requestDetails');
  }
  
  createEvent(requestDetails);
}

/*
* @description checks if date range submitted is valid
*
* @param object start Date instance
* @param object end Date instance
* 
* @returns boolean
*/
function areDatesValid(start, end) {
  // is end of range is before the beginning date
  if (start > end ) {
    return false;
  // is start date before today
  } else if (start < Date.now()) {
    return false;
  }
  
  return true;
}

/*
* @description sends emails to parties
*
* @param string topic which message to send
* @param object requestDetails 
*
*/
function mailer(topic, requestDetails) {
  var message = {
    noReply: true,
  };
   switch (topic) {
     case 'invalidDates': {
       message.to = requestDetails.email;
       message.subject = 'Issue with your vacation request';
       message.body = 'There was an error with the dates submitted.' + '\n' + 
           'Start Date: ' + requestDetails.startDate + ' End Date: ' + requestDetails.endDate
     }
   }
   
   MailApp.sendEmail(message);
}

/*
* @description creates an event on a calendar
* 
* @param object requestDetails
*
* @returns object CalendarEvent https://developers.google.com/apps-script/reference/calendar/calendar-event
*/
function createEvent(requestDetails) {
  var vacationCalendar = CalendarApp.getCalendarsByName('vacations')[0];
  
  if (!vacationCalendar) {
    throw new Error('internal error - selected calendar was not found');
  }
  
  return vacationCalendar.createEvent(requestDetails.name + ': Time Off',
    requestDetails.startDate, requestDetails.endDate, {
        guests: requestDetails.approver,
        sendInvites: true,
    });
}

/*
* @description sample test suite with manual logging
* and triggers
*/
function test() {
  // call tests
  badDateRange();
  mailBadDateRange();
  createEventTest();

  function badDateRange() {
    // end date comes before start date
    var start = new Date('December 20, 2018');
    var end = new Date('December 19, 2018');
    
    var valid = areDatesValid(start, end);
    if (!valid) {
      Logger.log('validator works: end date comes before start date');
    }
    
    // start date is before 'todays' date
    start = new Date('December 1, 2016');
    end = new Date('December 22, 2018');
    valid = areDatesValid(start, end);
    if (!valid) {
      Logger.log('validator works: start date is before todays date');
    }
  }
  
  function mailBadDateRange() {
    var requestDetails = {
      email: 'validaddress@yourdomain.com',
      startDate: new Date('December 1, 2016'),
      endDate: new Date('December 2, 2010'),
    };
    
    // call mailer with invalid dates topic and needed
    // request properties
    mailer('invalidDates', requestDetails);
  }
  
  function createEventTest() {
    var requestDetails = {
      name: 'Test Name',
      email: 'validaddress@yourdomain.com',
      startDate: new Date('December 24, 2018'),
      endDate: new Date('December 28, 2018'),
      details: 'sample vacation request',
      approver: 'validaddress@yourdomain.com',
    }
    
    var newEvent = createEvent(requestDetails);
    var eventId = newEvent.getId();
   
    if (!eventId) {
      Logger.Log('ERROR - test event was not created')
    } else {
      Logger.log('Test event created with id: ' + eventId);
    }
    
    var guests = newEvent.getGuestByEmail(requestDetails.approver);
    if (guests.length === 0) {
      Logger.log('ERROR - test event did not contain approver');
    } else {
      Logger.log('Test event created with approver as guest');
      newEvent.deleteEvent();
      Logger.log('Test event automatically removed');
    }
  }
}
