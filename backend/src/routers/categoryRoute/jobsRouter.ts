import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getTotalJobs,
} from "src/controllers/categoryController/jobsController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { createJobSchema } from "../../validation/jobs.validation.ts";

const jobsRouter = Router();

jobsRouter.get("/", getAllJobs);
jobsRouter.get("/total", getTotalJobs);
jobsRouter.get("/:id", getJobById);
jobsRouter.post("/", ProtectRoute, validateRequest(createJobSchema), createJob);
jobsRouter.delete("/:id", ProtectRoute, deleteJob);

export default jobsRouter;
