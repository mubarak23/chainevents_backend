import express from "express";
import {
  AddNewEvent,
  AllEvents, EventByOwner, EventDetails,
  fetchEventByEventChainId, fetchEventRegistrationAttendeesForOneEvent, SearchEvent
} from "./../controllers/EventController.js";
const router = express.Router();

router.post("/",  AddNewEvent);
router.get("/", AllEvents);
router.get("/search", SearchEvent);
router.get("/id/:event_id", EventDetails);
router.get("/owner/:event_owner", EventByOwner);
router.get("/:event_onchain_id", fetchEventByEventChainId);
router.get(
  "/:event_id/registrations",
  fetchEventRegistrationAttendeesForOneEvent
);

export default router;