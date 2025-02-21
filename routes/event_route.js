import express from "express";
import {
  AddNewEvent,
  AllEvents, paginatedEventsByOwner, EventByOwner, EventDetails, RegisterForAnEvent, RSVPForAnEvent,
  fetchEventByEventChainId, fetchEventRegistrationAttendeesForOneEvent, SearchEvent, ClosedEventForRegistration, OpenEventForRegistration
} from "./../controllers/EventController.js";
const router = express.Router();

router.post("/",  AddNewEvent);
router.get("/", AllEvents);
router.post("/register_for_event", RegisterForAnEvent)
router.post("/rsvp_for_event", RSVPForAnEvent)
router.get("/search", SearchEvent);
router.get("/id/:event_id", EventDetails);
router.get("/closed_event_registration/:id", ClosedEventForRegistration);
router.get("/reopen_event_registration/:id", OpenEventForRegistration);
// router.get("/owner/:event_owner", EventByOwner);
router.get("/owner/:event_owner", paginatedEventsByOwner);
router.get("/:event_onchain_id", fetchEventByEventChainId);
router.get(
  "/:event_id/registrations",
  fetchEventRegistrationAttendeesForOneEvent
);

router.get(
  "/:event_id/registrations/:user_address",
  fetchEventRegistrationAttendeesForOneEvent
);

export default router;