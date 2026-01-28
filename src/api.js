const SCRIPT_URL = import.meta.env.VITE_API_URL;

export const api = {
  bookTicket: async (formData) => {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "create_booking", ...formData }),
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
    const url = `${SCRIPT_URL}?secret=${adminSecret}`;
    const response = await fetch(url);
    return await response.json();
  }
};