# Modern Report Card Generator

Welcome to the **Modern Report Card Generator**! This project was created to help my big sister with her class as they close for the term. It's a fun and efficient way to generate beautiful, modern report cards using Python.

## Features

- **Performance Level Legend**: Automatically color-coded performance levels.
- **Header Table**: Includes school logo and student information.
- **Performance Table**: Detailed performance table with subject scores, performance levels, and teacher names.
- **Summary Section**: Overall performance summary with total score, average score, class position, and class average.
- **Remarks Section**: Space for comments and signatures from the class teacher, principal, and parents/guardians.

## How It Works

1. **CSV Data Processing**: The script reads student data from a CSV file and processes it to calculate averages and other statistics.
2. **PDF Generation**: Using the ReportLab library, the script generates a PDF report card for each student, complete with tables, colors, and styles.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/vinceodundo/modern-report-card-generator.git
   cd modern-report-card-generator
   ```

2. Install the required Python packages:
   ```sh
   pip install -r requirements.txt
   ```

## Usage

1. Place your CSV file in the project directory.
2. Run the script:
   ```sh
   python Report\ Cards\ Generator.py
   ```

## Example

Here's a quick example of how to use the generator:

```python
if __name__ == "__main__":
    generator = ModernReportCardGenerator('modern_report_cards.pdf')
    generator.generate_report_cards('Jina_Marksheet.csv')
```

## Acknowledgements

- **Big Sis**: For the inspiration and the opportunity to help out with her class.
- **ReportLab**: For the amazing library that makes PDF generation a breeze.
- **Pandas**: For the powerful data manipulation capabilities.

### License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Happy coding and happy teaching! 🎓📚

---

_Note: This project was created with love and a bit of sibling rivalry. Enjoy!_ 😄
