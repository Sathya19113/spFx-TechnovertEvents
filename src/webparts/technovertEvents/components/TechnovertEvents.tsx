import * as React from 'react';
import { DatePicker, DayOfWeek, IDatePickerStrings } from "office-ui-fabric-react/lib/DatePicker";

import { escape } from '@microsoft/sp-lodash-subset';
import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import {
  Pivot,
  PivotItem,
  PivotLinkSize
} from 'office-ui-fabric-react/lib/Pivot';
import { getIconClassName } from '@uifabric/styling';
import { configureLoadStyles } from '@microsoft/load-themed-styles';
import { initializeIcons } from '@uifabric/icons';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import styles from './TechnovertEvents.module.scss';
import { ITechnovertEventsProps } from './ITechnovertEventsProps';
import { OfficeEvent } from '../Interfaces/Event';
import { EventService } from '../Services/EventService';
import { ICalendarProps } from '../../../../lib/webparts/technovertEvents/components/ICalenderProps';
import { EventMapperService } from '../Services/AutoMapperService';
import { Props } from 'react';

var moment = require("moment");

export interface ITechnovertEventsState {
  Events: OfficeEvent[];
  isSPCallOnProgress: boolean;
  startDate: Date;
  endDate: Date;
  isFiltered: boolean;
}

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',

  isRequiredErrorMessage: 'Field is required.',

  invalidInputErrorMessage: 'Invalid date format.'
};

export default class TechnovertEvents extends React.Component<ITechnovertEventsProps, ITechnovertEventsState> {

  public eventService: EventService = new EventService(this.props.context);

  constructor(props?: ITechnovertEventsProps, state?: ITechnovertEventsState) {
    super(props);
    this.state = {
      Events: [],
      isSPCallOnProgress: true,
      startDate: null,
      endDate: null,
      isFiltered: false
    };

    // this.onSelectedStartOrEndDate = this.onSelectedStartOrEndDate.bind(this);
    this.onRunFilterEvents = this.onRunFilterEvents.bind(this);
  }

  public componentDidMount() {
    this.setSPSiteEvents();
  }

  public setSPSiteEvents = () => {
    this.setState({
      isSPCallOnProgress: true
    });
    return this.eventService.getEventsList().then((data: OfficeEvent[]) => {
      if (data && data.length != 0) {

        var list = new EventMapperService(data);
        EventService.Events = list.events.sort((a, b) => {
          var aStartDate = new Date(a.startDate);
          var bStartDate = new Date(b.startDate);
          return (aStartDate > bStartDate) ? 1 : (aStartDate < bStartDate ? -1 : 0);
        });;
        this.setState({
          Events: list.events,
          isSPCallOnProgress: false,
          isFiltered: false
        });
      }

      else {
        this.setState({
          Events: [],
          isSPCallOnProgress: false,
          isFiltered: false
        });
      }
    }, (error) => {
      this.setState({
        Events: [],
        isSPCallOnProgress: false,
        isFiltered: false
      });
      alert("Requested Resource cannot be Fetched ...");
      console.log("Requested Resource cannot be Fetched ...");
    });
  }

  private onRunFilterEvents = () => {
    var events = this.eventService.filteredEvents(this.state.startDate, this.state.endDate);
    this.setState({
      Events: events,
      isFiltered: true
    })
  }

  private onSelectedStartOrEndDate = (startDate: Date, endDate: Date) => {
    debugger;
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  }

  private onCancelFiltering = () => {
    this.setState({
      Events: EventService.Events,
      startDate: null,
      endDate: null,
      isFiltered: false
    });
  }

  public render(): React.ReactElement<ITechnovertEventsProps> {

    const CalenderElement = (props: any) => {
      debugger;
      const parsedDate = new Date(props.date);
      return (
        <div className={styles.calendarElement + " ms-Grid-col ms-sm2"}>
          <div className={styles.dateFont}>
            <span>{moment(parsedDate).format("DD")}</span>
          </div>
          <div className={styles.monthFont}>
            <span>{moment(parsedDate).format("MMM")}</span>
          </div>
        </div>
      );
    };

    const EventItems = this.state.Events.map((event: OfficeEvent) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return (
        <div className={styles.eventItem + " ms-Grid-row"}>
          <CalenderElement date={event.startDate} />
          <div className="ms-Grid-col ms-sm10">
            <div>
              <span className={styles.fontBold + " ms-fontSize-m" }>{event.name}</span>
            </div>
            <div>
              <span>
                <img className={styles.imageToIcon} src={require("../Images/location-icon.png")} />
              </span>
              <span>{event.location}</span>
            </div>
            <div>
              <span><i className="ms-Icon ms-Icon--Clock"></i></span><span>{moment(startDate).format(" hh : mm")}</span>
            </div>
          </div>
        </div>
      );
    });

    const DateSection = (props: any) => {
      return (
        <div className={styles.datesControlSection + " ms-Grid-col ms-ms4"}>
          <DatePicker label="Start Date" isRequired={false} firstDayOfWeek={DayOfWeek.Sunday} strings={props.datePickerStrings} maxDate={this.state.endDate} placeholder="Select Start Date ..." onSelectDate={(newDate) => { this.onSelectedStartOrEndDate(newDate, this.state.endDate); }} />
          <DatePicker label="End Date" isRequired={false} firstDayOfWeek={DayOfWeek.Sunday} strings={props.datePickerStrings} minDate={this.state.startDate} placeholder="Select End Date ..." onSelectDate={(newDate) => { this.onSelectedStartOrEndDate(this.state.startDate, newDate) }} />
          <div className={styles.buttonControlSection}>
            <DefaultButton
              data-automation-id='RunButton'
              disabled={!this.state.startDate || !this.state.endDate}
              text='Run'
              onClick={this.onRunFilterEvents}
            />
            <DefaultButton
              data-automation-id='RunButton'
              disabled={!this.state.startDate || !this.state.endDate}
              onClick={this.onCancelFiltering}
              text='Cancel Filter'
            />
          </div>
        </div>
      );
    };

    return (
      <div className={styles.technovertEvents}>
        <div>
          <div className={styles.row}>
            
            <div className="ms-Grid-row ms-Grid-col ms-sm12">
              {<DateSection datePickerStrings={DayPickerStrings} />}
              <Pivot linkSize={PivotLinkSize.large} >
                <PivotItem linkText="Events">
                  {this.state.Events && this.state.Events.length != 0 &&
                    <div className={styles.eventsDisplaySection + " ms-Grid-col ms-sm8"}>
                      { EventItems }
                    </div>
                  }
                  {this.state.isSPCallOnProgress && <Spinner size={SpinnerSize.large} label='Fetching Results...' />}
                  {(!this.state.Events || this.state.Events.length == 0) && !this.state.isSPCallOnProgress &&
                    <div className="ms-u-sm12 block">
                      No User Profiles are found.
                    </div>
                  }
                  
                </PivotItem>
                <PivotItem linkText="Past Events">

                </PivotItem>
                <PivotItem linkText="Future Events">

                </PivotItem>
              </Pivot>
            </div>
          </div>
        </div>
      </div>
    );
  }
}