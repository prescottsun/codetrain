const express = require("express");
const router = express.Router();

const JobApplicationModel = require("../models/jobApplicationModel");

// Create
router.post("/add-application", async (req, res) => {
  const { users_id, posts_jobs_id } = req.body;
  const response = await JobApplicationModel.addApplication(
    users_id,
    posts_jobs_id
  );
  if (response.command === "INSERT" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res.send("Could not add job application").status(409);
  }
});

// Read applications for job
router.get("/:job_id", async (req, res) => {
  const { job_id } = req.params;
  const jobApplications = await JobApplicationModel.getByJobId(job_id);
  res.json(jobApplications).status(200);
});

// Read an application for a job
router.get("/:job_id/:user_id", async (req, res) => {
  const { job_id, user_id } = req.params;
  const jobApplication = await JobApplicationModel.getByJobUserId(
    job_id,
    user_id
  );
  res.json(jobApplication).status(200);
});

// Update application status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status, statusChange } = req.body;
  const response = await JobApplicationModel.updateStatus(
    id,
    status,
    statusChange
  );
  if (response.command === "UPDATE" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res
      .send(`Could not update job application status for id: ${id}`)
      .status(409);
  }
});

// Delete application
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const response = await JobApplicationModel.removeApplication(id);
  if (response.command === "DELETE" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res
      .send(`Could not delete job application status for id: ${id}`)
      .status(409);
  }
});

module.exports = router;