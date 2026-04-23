import { Router } from "express";

import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getTotalJobs,
} from "src/controllers/jobsController.ts";
import { createJobSchema } from "src/validation/jobs.validation.ts";

const jobsRouter = Router();

jobsRouter.get("/", getAllJobs);
jobsRouter.get("/total", getTotalJobs);
jobsRouter.get("/:id", getJobById);
jobsRouter.post("/", ProtectRoute, validateRequest(createJobSchema), createJob);
jobsRouter.delete("/:id", ProtectRoute, deleteJob);

export default jobsRouter;
