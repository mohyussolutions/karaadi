import { Request, Response } from "express";
import prisma from "core/utils/db.ts";
import { Status, Role } from "@prisma/client";
import { EncryptionController } from "controllers/encryptionController/encryptionController.ts";

export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const { senderName, senderEmail, subject, body, priority } = req.body;
    if (!senderName || !senderEmail || !subject || !body)
      return res.status(400).json({ error: "Missing fields" });

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
    const { body, senderName, senderEmail, senderRole } = req.body;
    if (!body || !senderName || !senderEmail)
      return res.status(400).json({ error: "Missing fields" });

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: parseInt(ticketId),
        senderName,
        senderEmail,
        body: EncryptionController.encrypt(body),
        senderRole: (senderRole as Role) || Role.USER,
      },
    });

    if (["SUPPORT_MANAGER", "ADMIN"].includes(senderRole)) {
      await prisma.customerSupportTicket.update({
        where: { id: parseInt(ticketId) },
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
    const ticket = await prisma.customerSupportTicket.findUnique({
      where: { id: parseInt(req.params.ticketId) },
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
      }))
    );
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.ticketId);
    const ticket = await prisma.customerSupportTicket.update({
      where: { id },
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
    const id = parseInt(req.params.ticketId);
    await prisma.ticketMessage.deleteMany({ where: { ticketId: id } });
    await prisma.customerSupportTicket.delete({ where: { id } });
    return res.json({ message: "Deleted" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await prisma.ticketMessage.delete({
      where: { id: parseInt(req.params.messageId) },
    });
    return res.json({ message: "Deleted" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
