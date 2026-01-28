const SCRIPT_URL = import.meta.env.VITE_API_URL;
const API_SECRET = import.meta.env.VITE_API_SECRET;

export const api = {
  bookTicket: async (formData) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "create_booking",
        adminSecret: API_SECRET, // <--- Backend now requires this!
        ...formData
      }),
    });
    return await response.json();
  },

  verifyTicket: async (ticketId, adminSecret = API_SECRET) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "mark_attendance", ticketId, adminSecret }),
    });
    return await response.json();
  },

  getBookings: async (adminSecret = API_SECRET) => {
    const url = `${SCRIPT_URL}?action=get_all_bookings&secret=${adminSecret}`;
    const response = await fetch(url, {
      method: "GET",
      body: JSON.stringify({ action: "mark_attendance", ticketId, adminSecret }),
    });
    return await response.json();
  },

  cancelTicket: async (ticketId, adminSecret = API_SECRET) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "cancel_ticket", ticketId, adminSecret }),
    });
    return await response.json();
  },

  bookTicketAgain: async (ticketId, adminSecret = API_SECRET) => {
    // Action name from user: book_ticket
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "book_ticket", ticketId, adminSecret }),
    });
    return await response.json();
  }
};