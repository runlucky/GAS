function CreateEvent(title, time, description) {
    CalendarApp.getDefaultCalendar().createEvent(title, time.from, time.to, {
        description: description
    });  
}
