import { Holiday } from '../models/holiday.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { apiError } from '../utils/errorHandler.js';

// Only these fields come from the request; createdBy is always the signed-in teacher.
const pickHoliday = ({ title, description, startDate, endDate }) => ({ title, description, startDate, endDate });

export const createHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.create({ ...pickHoliday(req.body), createdBy: req.user._id });
  res.status(201).json({ success: true, data: holiday });
});

export const getAllHolidays = asyncHandler(async (req, res) => {
  const holidays = await Holiday.find().populate('createdBy', 'fullName role').sort('-createdAt');
  res.status(200).json({ success: true, count: holidays.length, data: holidays });
});

export const getHolidayById = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id).populate('createdBy', 'fullName role');
  if (!holiday) throw new apiError(404, 'Holiday not found');
  res.status(200).json({ success: true, data: holiday });
});

export const updateHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new apiError(404, 'Holiday not found');

  // save() (not findByIdAndUpdate) so the end-after-start check runs on edits too.
  for (const [key, value] of Object.entries(pickHoliday(req.body))) {
    if (value !== undefined) holiday[key] = value;
  }
  await holiday.save();
  res.status(200).json({ success: true, data: holiday });
});

export const deleteHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findByIdAndDelete(req.params.id);
  if (!holiday) throw new apiError(404, 'Holiday not found');
  res.status(200).json({ success: true, data: {} });
});
