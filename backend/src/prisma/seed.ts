import prisma from "../core/utils/db.ts";
import { boatItems } from "../seeder/boatSeeder.ts";
import { carItems } from "../seeder/cars.ts";
import { userItems } from "../seeder/users.ts";
import { marketplaceSeederData } from "../seeder/marketplaceSeeder.ts";
import { realEstateItems } from "../seeder/real-state.ts";

import { motorcycleItems } from "../seeder/motorcycles.ts";
import { notificationItems } from "../seeder/notifications.ts";
import { equipmentItems } from "../seeder/equipmentSeeder.js";
import { subscriptionItems } from "../seeder/subscription.js";
import { supportTicketSeedData } from "../seeder/ticketData.js";

const importData = async () => {
  try {
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.traktor.deleteMany();
    await prisma.boat.deleteMany();
    await prisma.car.deleteMany();
    await prisma.motorcycle.deleteMany();
    await prisma.marketplace.deleteMany();
    await prisma.realEstate.deleteMany();
    await prisma.customerSupportTicket.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.createMany({ data: userItems });

    const usersFromDb = await prisma.user.findMany();
    const assignUser = (items: any[]) =>
      items.map((item) => ({
        ...item,
        userId: usersFromDb[Math.floor(Math.random() * usersFromDb.length)].id,
      }));

    await prisma.boat.createMany({ data: assignUser(boatItems) });
    await prisma.car.createMany({ data: assignUser(carItems) });
    await prisma.motorcycle.createMany({ data: assignUser(motorcycleItems) });
    await prisma.marketplace.createMany({
      data: assignUser(marketplaceSeederData),
    });
    await prisma.realEstate.createMany({ data: assignUser(realEstateItems) });
    await prisma.traktor.createMany({ data: assignUser(equipmentItems) });
    await prisma.subscription.createMany({
      data: assignUser(subscriptionItems),
    });
    await prisma.notification.createMany({
      data: assignUser(notificationItems),
    });

    await prisma.customerSupportTicket.createMany({
      data: supportTicketSeedData,
    });

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.traktor.deleteMany();
    await prisma.boat.deleteMany();
    await prisma.car.deleteMany();
    await prisma.motorcycle.deleteMany();
    await prisma.marketplace.deleteMany();
    await prisma.realEstate.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.customerSupportTicket.deleteMany();
    await prisma.user.deleteMany();

    console.log("Data Deleted!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") deleteData();
else importData();
