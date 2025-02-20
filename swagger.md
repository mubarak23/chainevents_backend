## LIVE DEV URL: https://chainevents-backend.onrender.com/

-- Create event endpoint
url: https://chainevents-backend.onrender.com/event
request type: POST
Payload shape: {
  "name": "Rust workshop",
  "location": "theBuidl",
  "event_onchain_id": 4,
  "event_owner": "34875urijkdfrhutri4jo35u4930984",
  "event_email": "mubarak@gmail.com",
  "event_capacity": 85
}

response shape: {
  "success": true,
  "message": "successful",
  "data": {
    "id": 2
  }
}

- get events
url: https://chainevents-backend.onrender.com/event

response shape: {
  "success": true,
  "message": "successful",
  "data": [
    {
      "id": 1,
      "name": "Rust workshop",
      "description": null,
      "event_onchain_id": "4",
      "location": "theBuidl",
      "event_owner": "34875urijkdfrhutri4jo35u4930984",
      "event_email": "mubarak@gmail.com",
      "require_approval": 1,
      "open_for_registration": 1,
      "event_capacity": "85",
      "ticket": null,
      "event_type": null,
      "event_mode": null,
      "ticket_amount": null,
      "event_start_date": null,
      "event_end_date": null,
      "event_image_url": null,
      "created_at": "2025-02-20 17:18:03",
      "updated_at": "2025-02-20 17:18:03"
    },
    {
      "id": 2,
      "name": "Bitcoin dev meetup",
      "description": null,
      "event_onchain_id": "346",
      "location": "colab",
      "event_owner": "34875urdkjrkdfrhutri4jo35u4930984",
      "event_email": "bitdevskd23@gmail.com",
      "require_approval": 1,
      "open_for_registration": 1,
      "event_capacity": "50",
      "ticket": null,
      "event_type": null,
      "event_mode": null,
      "ticket_amount": null,
      "event_start_date": null,
      "event_end_date": null,
      "event_image_url": null,
      "created_at": "2025-02-20 17:21:56",
      "updated_at": "2025-02-20 17:21:56"
    }
  ]
}