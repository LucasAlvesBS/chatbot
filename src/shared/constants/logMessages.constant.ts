export const REGISTERING_EVENT_FOR = (name: string, content: string) =>
  `Registering event for ${name} with content: "${content}"`;

export const EVENT_REGTISTERED_FOR = (name: string) =>
  `Event registered for ${name}`;

export const REGISTRATION_FAILED = (name: string) =>
  `Registering event to ${name} failed`;
