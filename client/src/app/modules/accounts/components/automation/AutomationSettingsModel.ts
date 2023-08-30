export interface IAutomationSettings {
    minMessageDelay: Number;
    maxMessageDelay: Number;
    messageStartTime: Date;   
}

export const automationSettingsInitial: IAutomationSettings = {
    minMessageDelay: 0,
    maxMessageDelay: 10,
    messageStartTime: new Date(), 
}