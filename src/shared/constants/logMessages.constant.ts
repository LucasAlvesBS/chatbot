export const REGISTERING_EVENT_FOR = (user: string) =>
  `Registering event for ${user}`;

export const EVENT_REGTISTERED_FOR = (user: string) =>
  `Event registered for ${user}`;

export const REGISTRATION_FAILED = (user: string, errorMessage: string) =>
  `Registering event to ${user} failed` + errorMessage
    ? `: ${errorMessage}`
    : undefined;

export const EVENT_ALREADY_EXISTS_FOR = (user: string, content: string) =>
  `The event alread exsits for the ${user} with content: ${content}`;
