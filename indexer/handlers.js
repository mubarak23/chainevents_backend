import { FieldElement } from "@apibara/starknet";
import { uint256 } from "starknet";
import EventModels from "../models/Events.js";



export async function handleNewEventAdded(event) {
  // NewEventAdded payload 
  const data = event.data;

  const eventDetails = {
    name: hexToAscii(FieldElement.toHex(data[0]).toString()),
    event_id: parseInt(
      uint256
        .uint256ToBN({
          low: FieldElement.toBigInt(data[1]),
          high: FieldElement.toBigInt(data[2]),
        })
        .toString()
    ),
    location: hexToAscii(FieldElement.toHex(data[3]).toString()),
    event_owner: FieldElement.toHex(data[4]).toString(),
  };

  let eventExists = await EventModels.findEventById(eventDetails.event_id);

  if (eventExists) {
    // UPDATE THE EVENT
    await EventModels.update_event_by_name(eventDetails.name, eventDetails);
    console.log("Updating Event that already exists");
    return;
  }
  
  await EventModels.create(eventDetails);
}


export async function handleRegisteredForEvent(event) {

  // RegisteredForEvent
  const data = event.data;

  const registeredForEvent = {
    event_id: parseInt(
      uint256
        .uint256ToBN({
          low: FieldElement.toBigInt(data[0]),
          high: FieldElement.toBigInt(data[1]),
        })
        .toString()
    ),
    event_name: hexToAscii(FieldElement.toHex(data[2]).toString()),
    user_address: FieldElement.toHex(data[3]).toString(),
  };

  console.log(registeredForEvent);

  const hasRegistered = await EventModels.isUserRegistered(
    registeredForEvent.event_id,
    registeredForEvent.user_address
  );
  if (hasRegistered) {
    console.log("User has already registered");
    return;
  }
  // register_for_event
  await Events.register_for_event(
    registeredForEvent.event_id,
    registeredForEvent.user_address
  );
}

export async function handleEventAttendanceMark(event) {
  // EventAttendanceMark
  const data = event.data;

  const eventAttendanceMark = {
    event_id: parseInt(
      uint256
        .uint256ToBN({
          low: FieldElement.toBigInt(data[0]),
          high: FieldElement.toBigInt(data[1]),
        })
        .toString()
    ),
    user_address: FieldElement.toHex(data[2]).toString(),
  };

  console.log(eventAttendanceMark);

  const hasMarkedAttendance = await EventModels.hasUserAttendedEvent(
    eventAttendanceMark.event_id,
    eventAttendanceMark.user_address
  );
  if (hasMarkedAttendance) {
    console.log("User has already marked attendance");
    return;
  }
  await Event.markAttendance(
    eventAttendanceMark.event_id,
    eventAttendanceMark.user_address
  );
}

export async function handleEndEventRegistration(event) {
  // EndEventRegistration
  const data = event.data;

  const endEventRegistration = {
    event_id: parseInt(
      uint256
        .uint256ToBN({
          low: FieldElement.toBigInt(data[0]),
          high: FieldElement.toBigInt(data[1]),
        })
        .toString()
    ),
    event_name: hexToAscii(FieldElement.toHex(data[2]).toString()),
    event_owner: FieldElement.toHex(data[3]).toString(),
  };

  console.log(endEventRegistration);

  const eventExists = await EventModels.findByEventId(endEventRegistration.event_id);
  if (!eventExists) {
    console.log("Event does not exist");
    return;
  }
  await EventModels.endEventRegistration(endEventRegistration.event_id);
}


export async function handleRSVPForEvent(event) {
  // RSVPForEvent
  const data = event.data;

  const rsvpForEvent = {
    event_id: parseInt(
      uint256
        .uint256ToBN({
          low: FieldElement.toBigInt(data[0]),
          high: FieldElement.toBigInt(data[1]),
        })
        .toString()
    ),
    attendee_address: FieldElement.toHex(data[2]).toString(),
  };

  console.log(rsvpForEvent);

  const hasRSVPed = await EventModels.hasRSVPed(
    rsvpForEvent.event_id,
    rsvpForEvent.attendee_address
  );
  if (hasRSVPed) {
    console.log("User has already RSVPed");
    return;
  }
  await EventModels.handleRSVPForEvent(rsvpForEvent.event_id, rsvpForEvent.attendee_address);
}

