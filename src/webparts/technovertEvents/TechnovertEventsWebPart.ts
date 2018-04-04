import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TechnovertEventsWebPartStrings';
import TechnovertEvents from './components/TechnovertEvents';
import { ITechnovertEventsProps } from './components/ITechnovertEventsProps';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';

export interface ITechnovertEventsWebPartProps {
  context: WebPartContext;
}

export default class TechnovertEventsWebPart extends BaseClientSideWebPart<ITechnovertEventsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITechnovertEventsProps> = React.createElement(
      TechnovertEvents,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
