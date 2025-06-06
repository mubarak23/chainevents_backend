import db from '../config/db.js';

export default class EventModels {
  // static async create_new_events(data) {
  //   const [new_event] = await db('events').insert(data);
  //   return new_event;
  // }

   static async create_new_events(data) {
    try {
      const [new_event] = await db('events').insert(data).returning('id'); 
      return new_event;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw new Error("Failed to create event");
    }
  }

  static async search(keyword) {
    const event = await db("events")
      .where("name", "like", "%" + keyword + "%")
      .orWhere("location", "like", "%" + keyword + "%")
      .orWhere("event_id", "like", "%" + keyword + "%")
      .orWhere("event_owner", "like", "%" + keyword + "%");
    return event;
  }

  static async findEventById(event_id) {
    const event = await db("events").where({id: event_id}).first();
    return event;
  }

   static async findEventByOnChainId(onchain_id) {
    const event = await db("events").where({ event_onchain_id: onchain_id }).first();
    return event;
  }

  static async findEventsByOwner(event_owner) {
    const events = await db("events").where({ event_owner: event_owner});
    return events;
  }

  static async all() {
    const events = await db("events").select("*");
    return events;
  }


  static async paginated_event_data(page = 1, per_page = 10) {
     const offset = (page - 1) * per_page;
      const events = await db("events")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(per_page)
      .offset(offset);
    const total = await db("events").count({ count: "*" }).first();

     return {
      data: events,
      total: total.count,
      current: page,
      pages: Math.ceil(total.count / per_page),
    };

  }

    static async paginated_my_event_data(event_owner, page = 1, per_page = 10) {
     const offset = (page - 1) * per_page;
      const events = await db("events")
      .where({ event_owner: event_owner})
      .select("*")
      .orderBy("created_at", "desc")
      .limit(per_page)
      .offset(offset);
    const total = await db("events").count({ count: "*" }).first();

     return {
      data: events,
      total: total.count,
      current: page,
      pages: Math.ceil(total.count / per_page),
    };

  }

  static async updateEvent(id, data) {
    await db("events").where({id}).update(data);
    const event = db("events").where({id}).first();
    return event;
  }

    static async ClosedEventForRegistration(id) {
    await db("events").where({id}).update({ open_for_registration: false});
    const event = db("events").where({id}).first();
    return event;
  }

    static async OpenEventForRegistration(id) {
    await db("events").where({id}).update({ open_for_registration: true});
    const event = db("events").where({id}).first();
    return event;
  }

  static async updateEventByName(name, data) {
    await db("events").where({name: name}).update(data);
    const event = db("events").where({id}).first();
    return event;
  }

  static async deleteEvent(id){
    const event = await db("events").where({ id }).del();
    return event;
  }

  static async hasRegisteredForEvent(event_id, user_address, email_address) {
    const registered = await db("events_registrations").where({event_id, user_address, email_address })
    return registered.length > 0;
  }

  // event registration functions
  static async registerForEvent(event_id, user_address, email_address){
    let data = { event_id, user_address, email_address};
    try {
      const [event_registration] = await db("events_registrations").insert({
        event_id: data.event_id,
        user_address: data.user_address,
        email_address: data.email_address
      }).returning('id');
    return event_registration;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw new Error("Failed to register for an event");
    }

  };

  // RSVP for an event 
    static async rvpsForEvent(event_id, attendee_address ){
    try {
      const [event_registration] = await db("events_rsvps").insert({
      event_id,
      attendee_address,
    });
    return event_registration;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw new Error("Failed to create event");
    }

  };
    static async getRegisteredUsers(event_id) {
    return await db("events_registrations")
      .where({ event_id, is_active: true })
      .select("user_address");
  }

  static async isUserRegistered(event_id, user_address) {
    const registration = await db("events_registrations")
      .where({ event_id, user_address, is_active: true })
      .first();
    return !!registration;
  }

  // Event Attendance
   static async markEventAttendance(event_id, user_address){
   try {
      const [event_registration] = await db("events_attendance").insert({
      event_id,
      user_address
    });
    return event_registration;
   } catch (error) {
      console.error("Error inserting event:", error);
      throw new Error("Failed to create event");
   }

  };  

  static async getEventAttendance(event_id) {
    return await db("events_attendance").where(event_id).select("user_address");
  }

  static async hasUserAttendedEvent(event_id, user_address) {
    const attendance = await db("events_attendance")
      .where({ event_id, user_address })
      .first();
    return !!attendance;
  }


     static async isEventOpenForRegistration(event_id) {
    const event = await db("events")
      .where({ event_id })
      .first();
    return event.open_for_registration;
  }

    static async getEventRegistrationCounts(event_id) {
    const registrations = await db("events_registrations")
      .where({ event_id, is_active: true })
      .count("id as count")
      .first();

    const rsvps = await db("events_rsvps")
      .where({ event_id })
      .count("id as count")
      .first();

    const attendance = await db("events_attendance")
      .where({ event_id })
      .count("id as count")
      .first();

    return {
      registrations: registrations.count,
      rsvps: rsvps.count,
      attendance: attendance.count,
    };
  }

    static async getRegisteredUsersForEventWithPagination(
    event_id,
    page = 1,
    per_page = 10
  ) {
    const offset = (page - 1) * per_page;

    const registeredUsers = await db("events_registrations")
      .where({ event_id, is_active: true })
      .select("user_address", "email_address")
      .limit(per_page)
      .offset(offset);

    const total = await db("events_registrations")
      .where({ event_id, is_active: true })
      .count({ count: "*" })
      .first();

    return {
      data: registeredUsers,
      total: total.count,
      current: page,
      pages: Math.ceil(total.count / per_page),
    };
  }

    static async saveUserEventNFT(data) {
      try {
          const [createdRecord] = await db("events_nft").insert(data).returning("*");
          return createdRecord;        
      } catch (error) {
        console.error("Error inserting event:", error);
      throw new Error("Failed to create event");
      }

  }

  static async retrieveUserEventNFT(id) {
    const record = await db("events_nft").where({ event_id: id }).first();
    return record || null;
  }

    static async updateUserEventNFT(id, updates) {
    const updatedRows = await knex("events_nft")
      .where({ event_id: id })
      .update(updates)
      .returning("*");
    return updatedRows.length;
  }

  static async deleteUserEventNFT(id) {
    const deletedRows = await knex("events_nft")
      .where({ event_id: id })
      .delete();
    return deletedRows;
  }

}