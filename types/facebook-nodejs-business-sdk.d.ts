declare module 'facebook-nodejs-business-sdk' {
  export class FacebookAdsApi {
    static init(accessToken: string): FacebookAdsApi;
    static setDefaultAccount(accountId: string): void;
  }

  export class Content {
    static create(params: any): any;
    constructor();
    setId(id: string | number): Content;
    setQuantity(quantity: number): Content;
    setItemPrice(price: number): Content;
    setTitle(title: string): Content;
    setDescription(description: string): Content;
    setCategory(category: string): Content;
  }

  export class UserData {
    constructor(params?: any);
    setEmail(email: string): UserData;
    setEmails(emails: string[]): UserData;
    setPhone(phone: string): UserData;
    setPhones(phones: string[]): UserData;
    setGender(gender: string): UserData;
    setDateOfBirth(dob: string): UserData;
    setLastName(lastName: string): UserData;
    setFirstName(firstName: string): UserData;
    setCity(city: string): UserData;
    setState(state: string): UserData;
    setZipCode(zip: string): UserData;
    setCountry(country: string): UserData;
    setCountryCode(countryCode: string): UserData;
    setExternalId(id: string): UserData;
    setClientIpAddress(ip: string): UserData;
    setClientUserAgent(ua: string): UserData;
    setFbp(fbp: string): UserData;
    setFbc(fbc: string): UserData;
    setSubscriptionId(subscriptionId: string): UserData;
    setLeadId(leadId: string): UserData;
    setF5first(f5first: string): UserData;
    setF5last(f5last: string): UserData;
    setFi(fi: string): UserData;
    setDobd(dobd: string): UserData;
    setDobm(dobm: string): UserData;
    setDoby(doby: string): UserData;
  }

  export class CustomData {
    constructor(params?: any);
    setValue(value: number): CustomData;
    setCurrency(currency: string): CustomData;
    setContentName(contentName: string): CustomData;
    setContentIds(contentIds: string[]): CustomData;
    setContents(contents: any[]): CustomData;
    setContentType(contentType: string): CustomData;
    setOrderId(orderId: string): CustomData;
    setNumItems(numItems: number): CustomData;
    setSearchString(searchString: string): CustomData;
    setStatus(status: string): CustomData;
    setShippingContact(shippingContact: any): CustomData;
  }

  export class ServerEvent {
    constructor(params?: any);
    setEventName(eventName: string): ServerEvent;
    setEventTime(eventTime: number): ServerEvent;
    setEventSourceUrl(eventSourceUrl: string): ServerEvent;
    setUserData(userData: UserData): ServerEvent;
    setCustomData(customData: CustomData): ServerEvent;
    setActionSource(actionSource: string): ServerEvent;
    setEventId(eventId: string): ServerEvent;
    setUserAgent(userAgent: string): ServerEvent;
  }

  export class EventRequest {
    constructor(accessTokenOrEvents: any, pixelId?: string);
    setPartnerAgent(agent: string): void;
    execute(): Promise<any>;
    addEvent(event: ServerEvent): EventRequest;
    setEvents(events: ServerEvent[]): EventRequest;
  }

  export const ServerSide: {
    CAPI_EVENT_TIME: string;
  };
}
