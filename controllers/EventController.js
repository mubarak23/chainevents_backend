import EventModels from "../models/Events.js";
import { failure, success } from "../utils/response.js";

export const AddNewEvent = async (req, res) => {
  try {
    const {name, event_onchain_id, location, event_owner, event_email, event_capacity} = req.body;

    let new_event = await EventModels.create_new_events({name, event_onchain_id, location, event_owner, event_email, event_capacity});
    return success(res, "successful", new_event, 201)
  } catch (err) {
     return failure(res, err.message, [], 500);
  }
}

export const AllEvents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    let data = null;
    if (page || limit) {
      data = await EventModels.paginateData(page, limit);
    } else {
      data = await EventModels.all();
    }
    return success(res, "successful", data, 200);
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
};

export const SearchEvent = async (req, res) => {
  try {
    const { keyword } = req.query;
    let data = await EventModels.search_events(keyword);
     return success(res, "successful", data, 200);
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
}

export const EventDetails = async (req, res) => {
  try {
  let { event_id } = req.params;
  let event_details = await EventModels.findEventById(event_id);
  return success(res, "successful", event_details, 200);
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
}

export const fetchEventByEventChainId = async (req, res) => {
  try {
    const { event_onchain_id } = req.params;

    const event = await Event.findEventByOnChainId(event_onchain_id);

    if (!event) {
      return failure(res, "Event not found", [], 404);
    }

    return success(res, "Event details fetched successfully", event, 200);
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
};

// findEventById
// export const fetchEventByid = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const event = await Event.findEventByOnChainId(event_onchain_id);

//     if (!event) {
//       return failure(res, "Event not found", [], 404);
//     }

//     return success(res, "Event details fetched successfully", event, 200);
//   } catch (err) {
//     return failure(res, err.message, [], 500);
//   }
// };


export const EventByOwner = async (req, res) => {
  try {
  let { event_owner } = req.params;
  let event_details = EventModels.findEventsByOwner(event_owner);
  return success(res, "successful", event_details, 200);
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
}

// paginated_my_event_data

export const paginatedEventsByOwner = async (req, res) => {
  try {
  let { event_owner } = req.params;
   const { page = 1, per_page = 10 } = req.query;
  let event_details = await EventModels.paginated_my_event_data(event_owner, page, per_page);
  return success(res, "successful", event_details, 200);
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
}

export const fetchEventRegistrationAttendeesForOneEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { page = 1, per_page = 10 } = req.query;

    const event = await EventModels.findEventById(event_id);

    if (!event) {
      return failure(res, "Event not found", [], 404);
    }

    const registrations = await EventModels.getRegisteredUsersForEventWithPagination(
      event_id,
      page,
      per_page
    );

    return success(
      res,
      "Registered attendees fetched successfully",
      registrations,
      200
    );
  } catch (err) {
    return failure(res, err.message, [], 500);
  }
};

// Register for an event 
export const RegisterForAnEvent = async (req, res) => {
  try {
    const {event_id, user_address, email_address} = req.body;
    
    let event_details = await EventModels.findEventById(event_id);
    if(!event_details){
      return failure(res, "Cannot Register for Event that does Not Exist", [], 500);
    }
    let new_event_registration = await EventModels.registerForEvent(event_id, user_address, email_address);
    return success(res, "successful", new_event_registration, 201)
  } catch (err) {
     return failure(res, err.message, [], 500);
  }
}

// RSVP for an event
export const RSVPForAnEvent = async (req, res) => {
    const {event_id, attendee_address} = req.body;
    let hasUserRegister = await EventModels.hasUserAttendedEvent(event_id, attendee_address);
    if(!hasUserRegister){
      return failure(res, "User has not register for the event", [], 400);
    }

  try {
    let  rsvp_for_event = await EventModels.rvpsForEvent(event_id, attendee_address);
    return success(res, "successful", rsvp_for_event, 201)
  } catch (err) {
     return failure(res, err.message, [], 500);
  }
}

export const ClosedEventForRegistration = async (req, res) => {
  try {
    let { id } = req.params;
    let closed_event_registration = await EventModels.ClosedEventForRegistration(id);
    return success(res, "successful", closed_event_registration, 200)
  } catch (err) {
     return failure(res, err.message, [], 500);
  }
}

export const  OpenEventForRegistration = async (req, res) => {
  try {
    let { id } = req.params;
    let closed_event_registration = await EventModels.OpenEventForRegistration(id);
    return success(res, "successful", closed_event_registration, 201)
  } catch (err) {
     return failure(res, err.message, [], 500);
  }
}

