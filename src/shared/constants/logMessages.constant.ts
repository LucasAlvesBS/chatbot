export const REGISTERING_EVENT_FOR = (user: string) =>
  `Registering event for ${user}`;

export const EVENT_REGTISTERED_FOR = (user: string) =>
  `Event registered for ${user}`;

export const EVENT_ALREADY_EXISTS_FOR = (user: string, content: string) =>
  `The event alread exsits for the ${user} with content: ${content}`;

export const NOT_FOUND = (entity: string) => `${entity} not found`;
