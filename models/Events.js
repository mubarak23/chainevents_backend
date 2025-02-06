import db from '../config/db';

class EventModels {
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
    const event = db("events").where({id: event_id}).first();
    return event;
  }

  static async findEventsByOwner(event_owner) {
    const events = db("events").where({ event_owner: event_owner});
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

  static async delete_event(id){
    const event = await db("events").where({ id }).del();
    return event;
  }

  // event registration functions
  
  static async register_for_event(event_id, user_address){
    const [event_registration] = db("event_registrations").insert({
      event_id,
      user_address
    });
    return event_registration;
  };

    static async getRegisteredUsers(event_id) {
    return await db("event_registrations")
      .where({ event_id, is_active: true })
      .select("user_address");
  }

  static async isUserRegistered(event_id, user_address) {
    const registration = await db("event_registrations")
      .where({ event_id, user_address, is_active: true })
      .first();
    return !!registration;
  }



}