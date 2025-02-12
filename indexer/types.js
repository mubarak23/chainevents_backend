export let NewEventAdded = {
  name: string,
  event_id: number,
  location: string,
  event_owner: string,
};

export let RegisteredForEvent = {
    event_id: number,
    event_name: string,
    user_address: string,
};

export let EndEventRegistration = {
  event_id: number,
    event_name: string,
    event_owner: string,
};

export let RSVPForEvent = {
    event_id: number,
    attendee_address: string,
};

export let EventAttendanceMark = {
    event_id: number,
    user_address: string,
};
