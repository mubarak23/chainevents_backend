import db from '../config/db.js';

export default class EventModels {
  static async create_new_events(data) {
    const [new_event] = db('events').insert(data);
    return new_event;
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

  static async update_events(id, data) {
    await db("events").where({id}).update(data);
    const event = db("events").where({id}).first();
    return event;
  }

  static async update_event_by_name(name, data) {
    await db("events").where({name: name}).update(data);
    const event = db("events").where({id}).first();
    return event;
  }

  static async delete_event(id){
    const event = await db("events").where({ id }).del();
    return event;
  }

  // event registration functions
  static async register_for_event(event_id, user_address){
    const [event_registration] = await db("events_registrations").insert({
      event_id,
      user_address
    });
    return event_registration;
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
    const [event_registration] = await db("events_attendance").insert({
      event_id,
      user_address
    });
    return event_registration;
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

  static async endEventRegistration(event_id) {
    await db("events")
      .where({ event_id })
      .update({ open_for_registration: false });
    return true;
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
      .select("user_address")
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
    const [createdRecord] = await db("events_nft").insert(data).returning("*");
    return createdRecord;
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