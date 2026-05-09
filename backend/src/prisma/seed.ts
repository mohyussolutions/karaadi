import { boatItems } from "../seeder/boatSeeder.ts";
import { carItems } from "../seeder/cars.ts";
import { userItems } from "../seeder/users.ts";
import { marketplaceSeederData } from "../seeder/marketplaceSeeder.ts";
import { realEstateItems } from "../seeder/real-state.ts";
import { motorcycleItems } from "../seeder/motorcycles.ts";
import { notificationItems } from "../seeder/notifications.ts";
import { equipmentItems } from "../seeder/equipmentSeeder.ts";
import { subscriptionItems } from "../seeder/subscription.ts";
import { supportTicketSeedData } from "../seeder/ticketData.ts";
import { cities, regions } from "../seeder/SomaliaRegionsSeeder.ts";
import { jobsData } from "../seeder/jobsSeed.ts";
import { recommendations } from "../seeder/recomendationSeeder.ts";
import {
  marketplaceFees,
  realEstateFees,
  vehicleFees,
  boatFees,
  equipmentFees,
  systemConfigs,
  subPlans,
} from "../seeder/feeSeeder.ts";
import { seedBusinessPlans } from "../seeder/businessPlans.ts";
import prisma from "../core/utils/db.ts";

const importData = async () => {
  try {
    await prisma.job.deleteMany();
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.farmequipment.deleteMany();
    await prisma.boat.deleteMany();
    await prisma.car.deleteMany();
    await prisma.motorcycle.deleteMany();
    await prisma.marketplace.deleteMany();
    await prisma.realEstate.deleteMany();
    await prisma.customerSupportTicket.deleteMany();
    await prisma.feeChangeLog.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.marketplaceFee.deleteMany();
    await prisma.realEstateFee.deleteMany();
    await prisma.carFee.deleteMany();
    await prisma.motorcycleFee.deleteMany();
    await prisma.boatFee.deleteMany();
    await prisma.equipmentFeeConfig.deleteMany();
    await prisma.jobFeeConfig.deleteMany();
    await prisma.systemConfig.deleteMany();
    await prisma.subPlan.deleteMany();
    await prisma.businessPlan.deleteMany();
    await prisma.city.deleteMany();
    await prisma.region.deleteMany();
    await prisma.user.deleteMany();
    await prisma.recommendation.deleteMany();
    await prisma.userView.deleteMany();

    await prisma.region.createMany({ data: regions, skipDuplicates: true });
    await prisma.city.createMany({
      data: cities.map((city) => ({ ...city, isActive: true })),
      skipDuplicates: true,
    });

    await prisma.marketplaceFee.createMany({ data: marketplaceFees, skipDuplicates: true });
    await prisma.realEstateFee.createMany({ data: realEstateFees, skipDuplicates: true });
    await prisma.carFee.createMany({
      data: vehicleFees.map(({ carSale, carRent, trailer, carParts, truck, electricCar, isActive }) => ({
        carSale, carRent, trailer, carParts, truck, electricCar, isActive,
      })),
      skipDuplicates: true,
    });
    await prisma.motorcycleFee.createMany({
      data: vehicleFees.map(({ motoSale, motoRent, motoParts, isActive }) => ({
        motoSale, motoRent, motoParts, isActive,
      })),
      skipDuplicates: true,
    });
    await prisma.boatFee.createMany({ data: boatFees, skipDuplicates: true });
    await prisma.equipmentFeeConfig.createMany({
      data: equipmentFees.map(({ tractorSale, agriTool, harvester, isActive }) => ({
        tractorSale, agriTool, harvester, isActive,
      })),
      skipDuplicates: true,
    });
    await prisma.jobFeeConfig.createMany({
      data: equipmentFees.map(({ fullTime, partTime, freelance, isActive }) => ({
        fullTime, partTime, freelance, isActive,
      })),
      skipDuplicates: true,
    });
    await prisma.systemConfig.createMany({ data: systemConfigs, skipDuplicates: true });
    await prisma.subPlan.createMany({
      data: subPlans.map(({ subStandard, subStandard60, subPremium, isActive }) => ({
        basic30: subStandard,
        standard60: subStandard60,
        premium90: subPremium,
        isActive,
      })),
      skipDuplicates: true,
    });
    await seedBusinessPlans();

    await prisma.user.createMany({ data: userItems, skipDuplicates: true });

    const usersFromDb = await prisma.user.findMany();
    const firstUserId = usersFromDb[0]?.id;

    if (!firstUserId) throw new Error("No users found in database");

    const pickUser = () => usersFromDb[Math.floor(Math.random() * usersFromDb.length)].id;
    const assignUser = (items: any[]) =>
      items.map((item) => ({
        ...item,
        userId: pickUser(),
        ...(item.senderId !== undefined && { senderId: pickUser() }),
      }));

    await prisma.job.createMany({
      data: assignUser(jobsData).map((job) => ({ ...job, isPaid: true })),
      skipDuplicates: true,
    });
    await prisma.boat.createMany({ data: assignUser(boatItems), skipDuplicates: true });
    await prisma.car.createMany({ data: assignUser(carItems), skipDuplicates: true });
    await prisma.motorcycle.createMany({ data: assignUser(motorcycleItems), skipDuplicates: true });
    await prisma.marketplace.createMany({ data: assignUser(marketplaceSeederData), skipDuplicates: true });
    await prisma.realEstate.createMany({ data: assignUser(realEstateItems), skipDuplicates: true });
    await prisma.farmequipment.createMany({ data: assignUser(equipmentItems), skipDuplicates: true });
    await prisma.subscription.createMany({ data: assignUser(subscriptionItems), skipDuplicates: true });
    await prisma.notification.createMany({ data: assignUser(notificationItems), skipDuplicates: true });
    await prisma.customerSupportTicket.createMany({ data: supportTicketSeedData, skipDuplicates: true });
    await prisma.recommendation.createMany({ data: recommendations, skipDuplicates: true });

    await prisma.userView.createMany({
      data: [
        { userId: firstUserId, itemId: "item-1", category: "electronics", viewedAt: new Date() },
        { userId: firstUserId, itemId: "item-3", category: "cars", viewedAt: new Date() },
        { userId: firstUserId, itemId: "item-5", category: "tech", viewedAt: new Date() },
      ],
      skipDuplicates: true,
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
    await prisma.job.deleteMany();
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.farmequipment.deleteMany();
    await prisma.boat.deleteMany();
    await prisma.car.deleteMany();
    await prisma.motorcycle.deleteMany();
    await prisma.marketplace.deleteMany();
    await prisma.realEstate.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.customerSupportTicket.deleteMany();
    await prisma.feeChangeLog.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.marketplaceFee.deleteMany();
    await prisma.realEstateFee.deleteMany();
    await prisma.carFee.deleteMany();
    await prisma.motorcycleFee.deleteMany();
    await prisma.boatFee.deleteMany();
    await prisma.equipmentFeeConfig.deleteMany();
    await prisma.jobFeeConfig.deleteMany();
    await prisma.systemConfig.deleteMany();
    await prisma.subPlan.deleteMany();
    await prisma.businessPlan.deleteMany();
    await prisma.city.deleteMany();
    await prisma.region.deleteMany();
    await prisma.user.deleteMany();
    await prisma.recommendation.deleteMany();
    await prisma.userView.deleteMany();

    console.log("Data Deleted!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") deleteData();
else importData();
