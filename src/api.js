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

  verifyTicket: async (ticketId, adminSecret) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "mark_attendance", ticketId, adminSecret }),
    });
    return await response.json();
  },

  getBookings: async (adminSecret) => {
    // Updated to use the new explicit route
    const url = `${SCRIPT_URL}?action=get_all_bookings&secret=${adminSecret}`;
    const response = await fetch(url);
    return await response.json();
  }
};