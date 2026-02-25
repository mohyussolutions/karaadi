import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

export const getTicketsAndMetrics = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.customerSupportTicket.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    const metrics = {
      totalMessages: tickets.length,
      messagesUnread: tickets.filter((t) => t.status === "NEW").length,
      messagesRead: tickets.filter((t) => t.status === "RESOLVED").length,
    };

    res.status(200).json({ tickets, metrics });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets." });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { senderName, senderEmail, subject, body } = req.body;

    if (!senderName || !senderEmail || !subject || !body) {
      res.status(400).json({ message: "Missing required ticket fields." });
      return;
    }

    const newTicket = await prisma.customerSupportTicket.create({
      data: {
        senderName,
        senderEmail,
        subject,
        body,
      },
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit ticket." });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;
    const ticketId = parseInt(idValue, 10);

    const { adminReply, status } = req.body;

    if (isNaN(ticketId))
      return res.status(400).json({ message: "Invalid ticket ID" });
    if (!adminReply && !status)
      return res.status(400).json({ message: "Missing update data" });

    const updatedTicket = await prisma.customerSupportTicket.update({
      where: { id: ticketId },
      data: {
        adminReply,
        status,
        updatedAt: new Date(),
      },
      include: {
        messages: true,
      },
    });

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticket." });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;
    const ticketId = parseInt(idValue, 10);

    if (isNaN(ticketId))
      return res.status(400).json({ message: "Invalid ticket ID" });

    await prisma.customerSupportTicket.delete({ where: { id: ticketId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ticket." });
  }
};
