import { failure, success } from "../../backend/utils/response.js";
import EventModels from "../models/Events.js";

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
  let { id } = req.params;
  let event_details = EventModels.findEventById(id);
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


export const EventByOwner = async (req, res) => {
  try {
  let { event_owner } = req.params;
  let event_details = EventModels.findEventsByOwner(event_owner);
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