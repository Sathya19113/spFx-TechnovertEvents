import { OfficeEvent } from "../Interfaces/Event";



export class EventMapperService {
    public events: Array<OfficeEvent> = [];
    
    constructor(eventList: any) {
        eventList.map((event) => {
            this.events.push({
                id: event.ID,
                name: event.EventName,
                startDate: this.convertServerTimeStringToClientTimeString(event.StartDate),
                endDate: this.convertServerTimeStringToClientTimeString(event.EndDate),
                location: event.Location,
                eventType: event.EventType.Name,
                description: event.Comments
            });
        });
    }
    private convertServerTimeToClientTime = (dateString: string) => {
        var date = new Date(dateString);
        date.setMinutes(date.getMinutes() - (12 * 60 + 30));
        return date;
    }

    private convertServerTimeStringToClientTimeString = (dateString : string) => {
        if(dateString == null || dateString == "") 
            return "";
        var date = new Date(dateString);
        date.setMinutes(date.getMinutes() - (12 * 60 + 30));
        return date.toString();
    }
}