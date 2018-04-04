import EventType from "./EventType";

export interface OfficeEvent {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    eventType: EventType;
    location: string;
    description: string;
}