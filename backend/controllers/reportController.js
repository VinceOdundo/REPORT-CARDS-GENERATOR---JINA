const { exec } = require("child_process");
const Report = require("../models/Report");

const generatePDF = async (req, res, next) => {
  const { studentId, scores } = req.body;

  try {
    const report = new Report({ studentId, scores });
    await report.save();

    const command = `python3 ./python/generate_pdf.py ${report._id}.pdf`;
    exec(command, (error) => {
      if (error) return next(error);
      res.status(200).json({ message: "PDF generated successfully" });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePDF };
