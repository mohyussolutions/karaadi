import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getTotalJobs,
} from "src/controllers/categoryController/jobsController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const jobsRouter = Router();

jobsRouter.get("/", getAllJobs);
jobsRouter.get("/total", getTotalJobs);
jobsRouter.get("/:id", getJobById);
jobsRouter.post("/", ProtectRoute, createJob);
jobsRouter.delete("/:id", ProtectRoute, deleteJob);

export default jobsRouter;
