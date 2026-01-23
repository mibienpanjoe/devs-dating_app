const Report = require('../models/Report')

// Create report
exports.createReport = async (req, res) => {
  try {
    const { reportedId, reason } = req.body
    const reporterId = req.user._id

    const report = new Report({
      reporter: reporterId,
      reported: reportedId,
      reason
    })

    await report.save()
    res.status(201).json(report)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already reported this user' })
    }
    res.status(500).json({ message: error.message })
  }
}

// Get user's reports (for admin)
exports.getReports = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const reports = await Report.find().populate('reporter reported', 'name email')
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update report status (for admin)
exports.updateReportStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const { status } = req.body
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    res.json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}