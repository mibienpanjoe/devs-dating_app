import { Response } from 'express';
import Report from '../models/Report';

export const createReport = async (req: any, res: Response): Promise<void> => {
  try {
    const { reportedId, reason } = req.body;
    const reporterId = req.user._id;

    const report = new Report({
      reporter: reporterId,
      reported: reportedId,
      reason
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    if ((error as any).code === 11000) {
      res.status(400).json({ message: 'Already reported this user' });
      return;
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getReports = async (req: any, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const reports = await Report.find().populate('reporter reported', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateReportStatus = async (req: any, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  createReport,
  getReports,
  updateReportStatus
};