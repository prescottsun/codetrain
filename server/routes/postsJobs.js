const express = require("express");
const router = express.Router();

const JobPostsModel = require("../models/postsJobsModel");

// Read all job posts
router.get("/", async (req, res) => {
  const allJobPosts = await JobPostsModel.getAllJobs();
  res.json(allJobPosts).status(200);
});

// Read job posts by company
router.get("/company/:companies_id", async (req, res) => {
  const { companies_id } = req.params;
  const companyJobPosts = await JobPostsModel.getByCompanyId(companies_id);
  res.json(companyJobPosts).status(200);
});

// Read specific job post
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  const jobPost = await JobPostsModel.getById(id);
  res.json(jobPost).status(200);
});

// Create
router.post("/add", async (req, res) => {
  const {
    title,
    content,
    experience,
    contact_email,
    contact_phone,
    companies_id,
    users_id
  } = req.body;
  const response = await JobPostsModel.addJob(
    title,
    content,
    experience,
    contact_email,
    contact_phone,
    companies_id,
    users_id
  );
  if (response.command === "INSERT" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res.send("Could not add job").status(409);
  }
});

// Update job post
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { column, value } = req.body;
  const response = await JobPostsModel.updateJob(id, column, value);
  if (response.command === "UPDATE" && response.rowCount >= 1) {
    res.sendStatus(200);
  } else {
    res.send(`Could not update ${column} for job id: ${id}`).status(409);
  }
});

// Delete job. Not functioning due to dependencies in other tables
// router.delete("/delete/:id", async (req, res) => {
//   const { id } = req.params;
//   const response = await JobPostsModel.removeJob(id);
//   if (response.command === "DELETE" && response.rowCount >= 1) {
//     res.sendStatus(200);
//   } else {
//     res.send(`Could not delete job for id: ${id}`).status(409);
//   }
// });

module.exports = router;
