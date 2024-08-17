import { ticketModel } from './models/ticket.model.js';

export const createTicket = async (ticketData) => {
  try {
    const newTicket = await ticketModel.create(ticketData);
    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw new Error("Error creating ticket");
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const ticket = await ticketModel.findById(ticketId).populate('purchaser');
    return ticket;
  } catch (error) {
    console.error("Error getting ticket by ID:", error);
    throw new Error("Error getting ticket");
  }
};

export const getAllTickets = async () => {
  try {
    const tickets = await ticketModel.find().populate('purchaser');
    return tickets;
  } catch (error) {
    console.error("Error getting all tickets:", error);
    throw new Error("Error getting tickets");
  }
};
