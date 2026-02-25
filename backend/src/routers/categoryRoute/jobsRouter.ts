import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  getTotalJobs,
} from "src/controllers/categoryController/jobsController.ts";

const jobsRouter = Router();

jobsRouter.get("/", getAllJobs);
jobsRouter.get("/total", getTotalJobs);
jobsRouter.get("/:id", getJobById);
jobsRouter.post("/", createJob);

export default jobsRouter;
