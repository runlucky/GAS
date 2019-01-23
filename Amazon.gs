/// GmailからAmazonの荷物お届けメールを検索し、Googleカレンダーに登録する

function createAmazonEvent() {
    GmailApp.search("is:unread from:(Amazon.co.jp) ご注文の確認").forEach(function(thread) {
        thread.getMessages().forEach(function(message) {
            if (!isShipMail(message)) return;
            var range = Range(message);            
            CalendarApp.getDefaultCalendar().createEvent("アマゾン", range.from, range.to, {
                description: description(message)              
            });
            message.markRead();
        });
    });
}

function Range(message) { 
    var body = message.getPlainBody();
    var range = body.match(/\d{2}\/\d{2}\s\d{2}:\d{2}/g);
    return {
        from:toDate(message, range[0]),
        to:toDate(message, range[1])
    };
}

function isShipMail(message) {
    var body = message.getPlainBody()
    return body.match(/お届け予定/);
}

function toDate(message, date) { 
    var [sMatched, Month, Day, Hour, Min] = date.match(/(\d{2})\/(\d{2})\s(\d{2}):(\d{2})/);
    return  new Date(message.getDate().getFullYear(), Month - 1, Day, Hour, Min);
}

function description(message) {
    return getTitle(message.getSubject()) + "\n" + getUrl(message.getPlainBody())
}

function getTitle(subject) {
    var [reg, start,title] = subject.match(/(「)(.*)/);
    return start + title;
}

function getUrl(body) {
    var base = "https://www.amazon.co.jp/gp/css/summary/edit.html?orderID="
    return base + getOrderID(body)
}

function getOrderID(body) {
    var [reg, id] = body.match(/注文番号：\s+([\d-]+)/);
    return id;
}
