import { Status, Role } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { EncryptionController } from "./encryptionController.ts";
export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const { senderName, senderEmail, subject, body, priority } = req.body;
    if (!senderName || !senderEmail || !subject || !body) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const encryptedBody = EncryptionController.encrypt(body);

    const ticket = await prisma.customerSupportTicket.create({
      data: {
        senderName,
        senderEmail,
        subject: EncryptionController.encrypt(subject),
        body: encryptedBody,
        priority: priority || "NORMAL",
        status: Status.NEW,
        messages: {
          create: {
            senderName,
            senderEmail,
            body: encryptedBody,
            senderRole: Role.USER,
          },
        },
      },
      include: { messages: true },
    });

    return res.status(201).json({
      ...ticket,
      subject: EncryptionController.decrypt(ticket.subject),
      body: EncryptionController.decrypt(ticket.body),
      messages: ticket.messages.map((m) => ({
        ...m,
        body: EncryptionController.decrypt(m.body),
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const addMessageToTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticketIdValue = Array.isArray(ticketId) ? ticketId[0] : ticketId;
    const ticketIdNum = parseInt(ticketIdValue, 10);

    if (isNaN(ticketIdNum)) {
      return res.status(400).json({ error: "Invalid ticket ID format" });
    }

    const { body, senderName, senderEmail, senderRole } = req.body;

    if (!body || !senderName || !senderEmail) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: ticketIdNum,
        senderName,
        senderEmail,
        body: EncryptionController.encrypt(body),
        senderRole: (senderRole as Role) || Role.USER,
      },
    });

    if (["SUPPORT_MANAGER", "ADMIN"].includes(senderRole)) {
      await prisma.customerSupportTicket.update({
        where: { id: ticketIdNum },
        data: { status: Status.IN_PROGRESS },
      });
    }

    return res.status(201).json({
      ...message,
      body: EncryptionController.decrypt(message.body),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getTicketDetails = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticketIdValue = Array.isArray(ticketId) ? ticketId[0] : ticketId;
    const ticketIdNum = parseInt(ticketIdValue, 10);

    if (isNaN(ticketIdNum)) {
      return res.status(400).json({ error: "Invalid ticket ID format" });
    }

    const ticket = await prisma.customerSupportTicket.findUnique({
      where: { id: ticketIdNum },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!ticket) return res.status(404).json({ error: "Not found" });

    return res.json({
      ...ticket,
      subject: EncryptionController.decrypt(ticket.subject),
      body: EncryptionController.decrypt(ticket.body),
      messages: ticket.messages.map((m) => ({
        ...m,
        body: EncryptionController.decrypt(m.body),
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.customerSupportTicket.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(
      tickets.map((t) => ({
        ...t,
        subject: EncryptionController.decrypt(t.subject),
        body: EncryptionController.decrypt(t.body),
      })),
    );
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticketIdValue = Array.isArray(ticketId) ? ticketId[0] : ticketId;
    const ticketIdNum = parseInt(ticketIdValue, 10);

    if (isNaN(ticketIdNum)) {
      return res.status(400).json({ error: "Invalid ticket ID format" });
    }

    const ticket = await prisma.customerSupportTicket.update({
      where: { id: ticketIdNum },
      data: {
        status: req.body.status as Status,
        resolvedAt: req.body.status === "DONE" ? new Date() : null,
      },
    });

    return res.json({
      ...ticket,
      subject: EncryptionController.decrypt(ticket.subject),
      body: EncryptionController.decrypt(ticket.body),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getSupportStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, dayCount] = await Promise.all([
      prisma.customerSupportTicket.count(),
      prisma.customerSupportTicket.count({
        where: { createdAt: { gte: today } },
      }),
    ]);

    return res.json({ total, today: dayCount });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const ticketIdValue = Array.isArray(ticketId) ? ticketId[0] : ticketId;
    const ticketIdNum = parseInt(ticketIdValue, 10);

    if (isNaN(ticketIdNum)) {
      return res.status(400).json({ error: "Invalid ticket ID format" });
    }

    await prisma.ticketMessage.deleteMany({ where: { ticketId: ticketIdNum } });
    await prisma.customerSupportTicket.delete({ where: { id: ticketIdNum } });

    return res.json({ message: "Deleted" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const messageIdValue = Array.isArray(messageId) ? messageId[0] : messageId;
    const messageIdNum = parseInt(messageIdValue, 10);

    if (isNaN(messageIdNum)) {
      return res.status(400).json({ error: "Invalid message ID format" });
    }

    await prisma.ticketMessage.delete({
      where: { id: messageIdNum },
    });

    return res.json({ message: "Deleted" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
