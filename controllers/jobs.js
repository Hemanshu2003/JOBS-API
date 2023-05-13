const JOB = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJob = async (req, res) => {
  const jobs = await JOB.find({ createdBy: req.user.userID }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await JOB.findOne({ _id: jobID, createdBy: userID });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;

  const job = await JOB.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobID },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Postion fields cannot be empty!");
  }

  const job = await JOB.findOneAndUpdate(
    { _id: jobID, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await JOB.findByIdAndDelete({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobID}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJob, deleteJob, updateJob, getJob, createJob };
