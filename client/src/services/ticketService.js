import api from "./axios";

// Citizen: Create a new ticket (multipart for image upload)
export const createTicket = (formData) =>
  api
    .post("/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

// Citizen: Get my own tickets
export const getMyTickets = () => api.get("/tickets/my").then((r) => r.data);

// Admin: Get all tickets
export const getAllTickets = (params) =>
  api.get("/tickets", { params }).then((r) => r.data);

// Contractor: Get assigned tickets
export const getAssignedTickets = () =>
  api.get("/tickets/assigned").then((r) => r.data);

// All roles: Public ticket feed (with vote counts)
export const getPublicTickets = (params) =>
  api.get("/tickets/public", { params }).then((r) => r.data);

// Any: Get a single ticket by ID
export const getTicketById = (id) =>
  api.get(`/tickets/${id}`).then((r) => r.data);

// Admin: Update ticket status
export const updateTicketStatus = (id, status) =>
  api.patch(`/tickets/${id}/status`, { status }).then((r) => r.data);

// Admin: Assign ticket to contractor
export const assignTicket = (id, contractorId) =>
  api.patch(`/tickets/${id}/assign`, { contractorId }).then((r) => r.data);

// All roles: Vote / unvote on a ticket
export const voteTicket = (id) =>
  api.patch(`/tickets/${id}/vote`).then((r) => r.data);

// Contractor: Upload work proof (multipart)
export const uploadWorkProof = (id, formData) =>
  api
    .post(`/tickets/${id}/proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

// Any: Delete a ticket
export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`).then((r) => r.data);

// Admin: Get contractor list (optionally filter by department)
export const getContractors = (department) =>
  api
    .get("/users/contractors", department ? { params: { department } } : {})
    .then((r) => r.data);
