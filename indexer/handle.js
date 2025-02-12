import { FieldElement } from "@apibara/starknet";
import { uint256 } from "starknet";
import Events from "../models/Event.js";


export async function handleNewEventAdded(event) {
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

  let eventExists = await Events.findEventById(eventDetails.event_id);

  if (eventExists) {
    console.log("Event already exists");
    return;
  }
  
  await Events.create(eventDetails);
}


export async function handleRegisteredForEvent(event) {
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

  const hasRegistered = await Events.isUserRegistered(
    registeredForEvent.event_id,
    registeredForEvent.user_address
  );
  if (hasRegistered) {
    console.log("User has already registered");
    return;
  }
  await Events.registeredForEvent(
    registeredForEvent.event_id,
    registeredForEvent.user_address
  );
}

export async function handleEventAttendanceMark(event) {
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

  const hasMarkedAttendance = await Events.hasUserAttendedEvent(
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

  const eventExists = await Events.findByEventId(endEventRegistration.event_id);
  if (!eventExists) {
    console.log("Event does not exist");
    return;
  }
  await Events.endEventRegistration(endEventRegistration.event_id);
}


export async function handleRSVPForEvent(event) {
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

  const hasRSVPed = await Events.hasRSVPed(
    rsvpForEvent.event_id,
    rsvpForEvent.attendee_address
  );
  if (hasRSVPed) {
    console.log("User has already RSVPed");
    return;
  }
  await Events.handleRSVPForEvent(rsvpForEvent.event_id, rsvpForEvent.attendee_address);
}

