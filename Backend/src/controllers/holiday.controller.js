import { Holiday } from '../models/holiday.model.js';

export const createHoliday = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    
    const holiday = await Holiday.create({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find()
      .populate('createdBy', 'fullName role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export const getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id)
      .populate('createdBy', 'fullName role');

    if (!holiday) {
      return res.status(404).json({
        success: false,
        error: 'Holiday not found'
      });
    }

    res.status(200).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

export const updateHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!holiday) {
      return res.status(404).json({
        success: false,
        error: 'Holiday not found'
      });
    }

    res.status(200).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        error: 'Holiday not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};