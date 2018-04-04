import { OfficeEvent } from "../Interfaces/Event";
import WebPartContext from "@microsoft/sp-webpart-base/lib/core/WebPartContext";
import {
    SPHttpClient,
    SPHttpClientResponse   
   } from '@microsoft/sp-http';
export class EventService {

    static Events: OfficeEvent[] = [];

    constructor(private context: WebPartContext) { }

    /**
     * Get Events List
     */
    public getEventsList() {
        return this.context.spHttpClient.get(`https://pranthi.sharepoint.com/Sites/SathyaSite/_api/web/lists/getByTitle('Events')/items?$select=Id,EventName,StartDate,EndDate,Location,EventType/ID,EventType/Name,EventType/Description,Comments&$expand=EventType`,SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json().then(data => {
                    return data.value;
                });
            });
    }

    public filteredEvents = (startDate: Date, endDate: Date) : Array<OfficeEvent> => {

        // return EventService.Events.filter(event => !(event.startDate > endDate || event.startDate < startDate) && !(event.endDate < startDate || event.endDate > endDate) && (event.startDate >= startDate || startDate == null) && (event.endDate <= endDate || endDate == null)); // Date Cannot be null
        debugger;
        return EventService.Events.filter(event => {
            var eventStartDate =  new Date(event.startDate);
            var eventEndDate = new Date(event.endDate);
            return (eventStartDate >= startDate && eventEndDate <= endDate)
        }).sort((a,b) => { 
            var aStartDate = new Date(a.startDate);
            var bStartDate = new Date(b.startDate);
            return (aStartDate > bStartDate) ? 1 : (aStartDate < bStartDate ? -1 : 0);
         });
    }

    public pastEvents = () : Array<OfficeEvent> => {
        var today = new Date();
        return EventService.Events.filter(event => new Date(event.endDate) < today).sort((a,b) => {
            var aStartDate = new Date(a.startDate);
            var bStartDate = new Date(b.startDate);
            return (aStartDate > bStartDate) ? 1 : (aStartDate < bStartDate ? -1 : 0);
        });
    }

    public futureEvents = () : Array<OfficeEvent> => {
        var today = new Date();
        return EventService.Events.filter(event => new Date(event.startDate) > today).sort((a,b) => {
            var aStartDate = new Date(a.startDate);
            var bStartDate = new Date(b.startDate);
            return (aStartDate > bStartDate) ? 1 : (aStartDate < bStartDate ? -1 : 0);
        });;
    }

    public currentlyRunningEvents = () : Array<OfficeEvent> => {
        var today = new Date();
        return EventService.Events.filter(event => {
            var eventStartDate =  new Date(event.startDate);
            var eventEndDate = new Date(event.endDate);
            return (eventStartDate <= today && (eventEndDate >= today || eventEndDate.toString() == "Invalid Date"));
        }).sort((a,b) => {
            var aStartDate = new Date(a.startDate);
            var bStartDate = new Date(b.startDate);
            return (aStartDate > bStartDate) ? 1 : (aStartDate < bStartDate ? -1 : 0);
        });
    }

}