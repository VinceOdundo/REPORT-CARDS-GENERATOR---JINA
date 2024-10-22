from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.graphics.shapes import Drawing, Line
from reportlab.graphics.charts import spider
import pandas as pd
import numpy as np


class ModernReportCardGenerator:
    def __init__(self, output_filename):
        self.doc = SimpleDocTemplate(
            output_filename,
            pagesize=A4,
            rightMargin=1*cm,
            leftMargin=1*cm,
            topMargin=1*cm,
            bottomMargin=1*cm
        )
        self.width, self.height = A4
        self.styles = getSampleStyleSheet()

        # Modern color palette
        self.colors = {
            'primary': colors.HexColor('#1a237e'),    # Deep Blue
            'secondary': colors.HexColor('#4a148c'),  # Deep Purple
            'accent': colors.HexColor('#00acc1'),     # Cyan
            'text': colors.HexColor('#263238'),       # Dark Gray
            'light': colors.HexColor('#f5f5f5'),      # Light Gray
            'warning': colors.HexColor('#ff6d00'),    # Orange
            'success': colors.HexColor('#00c853'),    # Green
        }

        self.init_styles()

        self.teachers = {
            'SCI': 'Mr. Oloo',
            'KISW': 'Mr. Oloo',
            'CRA': 'Mr. Oloo',
            'CRE': 'Tr. Loreen',
            'P0TECH': 'Mr. Akonga',
            'AGR': 'Madam Seline',
            'MAT': 'Mr. Adongo',
            'ENG': 'Mr. Adongo',
            'SST': 'Madam Janet'
        }

        self.performance_levels = {
            (0, 30): ('Below Expectation', 1, colors.HexColor('#ff1744')),
            (31, 49): ('Approaching Expectation', 2, colors.HexColor('#ffd600')),
            (50, 79): ('Meeting Expectation', 3, colors.HexColor('#00e676')),
            (80, 100): ('Exceeding Expectation', 4, colors.HexColor('#2979ff'))
        }

    def init_styles(self):
        """Initialize modern typography styles"""
        self.styles.add(ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            textColor=self.colors['primary'],
            spaceAfter=10,
            alignment=1,
            fontName='Helvetica-Bold'
        ))

        self.styles.add(ParagraphStyle(
            'CustomSubTitle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=self.colors['secondary'],
            spaceAfter=5,
            alignment=1,
            fontName='Helvetica'
        ))

        self.styles.add(ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=self.colors['text'],
            fontName='Helvetica-Bold'
        ))

        self.styles.add(ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=self.colors['text'],
            fontName='Helvetica'
        ))

    def get_performance_level(self, score):
        """Get performance level info"""
        for (min_score, max_score), (level, rub, color) in self.performance_levels.items():
            if min_score <= score <= max_score:
                return level, rub, color
        return 'Not Evaluated', 0, colors.white

    def create_header_table(self, student_data, school_info):
        """Create modern header with logo and school info"""
        try:
            logo = Image('Jina lgo.png', width=1*inch, height=1*inch)
        except:
            logo = Image('/api/placeholder/100/100',
                         width=1*inch, height=1*inch)

        school_data = [
            [logo, school_info['name'], f"Assessment No: {
                student_data['Assessment Number']}"],
            ['', school_info['address'], f"Name: {student_data['Name']}"]
        ]

        table = Table(school_data, colWidths=[2.5*cm, 10*cm, 6*cm])
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('SPAN', (0, 0), (0, 1)),
            ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (1, 0), (1, 0), 14),
            ('FONTNAME', (1, 1), (1, 1), 'Helvetica'),
            ('FONTSIZE', (1, 1), (1, 1), 10),
            ('FONTNAME', (2, 0), (2, 1), 'Helvetica'),
            ('FONTSIZE', (2, 0), (2, 1), 9),
            ('TEXTCOLOR', (1, 0), (1, 0), self.colors['primary']),
        ]))
        return table

    def create_performance_table(self, student_data):
        """Create modern performance table with color coding"""
        headers = ['Subject', 'Score', 'Performance Level', 'Teacher', 'Rub']
        subjects = ['ENG', 'MAT', 'AGR', 'KISW',
                    'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']

        data = [headers]
        for subject in subjects:
            score = student_data[subject]
            level, rub, color = self.get_performance_level(score)
            teacher = self.teachers.get(subject, '')

            data.append([
                subject,
                f"{score}%",
                level,
                teacher,
                str(rub)
            ])

        table = Table(data, colWidths=[2*cm, 2*cm, 6*cm, 4*cm, 2*cm])
        style = [
            ('GRID', (0, 0), (-1, -1), 0.5, self.colors['light']),
            ('BACKGROUND', (0, 0), (-1, 0), self.colors['primary']),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]

        # Add color coding for performance levels
        for i, row in enumerate(data[1:], 1):
            score = float(row[1].replace('%', ''))
            _, _, color = self.get_performance_level(score)
            style.append(('BACKGROUND', (2, i), (2, i), color))
            style.append(('TEXTCOLOR', (2, i), (2, i), colors.white))

        table.setStyle(TableStyle(style))
        return table

    def create_summary_section(self, student_data):
        """Create modern summary section"""
        data = [
            ['Overall Performance Summary'],
            [f"Total Score: {student_data['TTL']}/900"],
            [f"Average Score: {student_data['AVG']:.1f}%"],
            [f"Class Position: {student_data['RANK']} out of {
                student_data['total_students']}"],
            [f"Class Average: {student_data['class_avg']:.1f}%"]
        ]

        table = Table(data, colWidths=[16*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), self.colors['primary']),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        return table

    def create_remarks_section(self):
        """Create modern remarks section"""
        data = [
            ['Comments and Signatures'],
            ["Class Teacher's Comments: _____________________________________________"],
            ["Principal's Comments: _______________________________________________"],
            ["Parent's/Guardian's Comments: ________________________________________"],
            ['Date: ________________  Signatures:  Teacher: ________  Parent: ________']
        ]

        table = Table(data, colWidths=[16*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), self.colors['primary']),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        return table

    def create_legend(self):
        """Create performance level legend"""
        data = [['Performance Levels:']]
        for (min_score, max_score), (level, _, color) in self.performance_levels.items():
            data.append([f"{level} ({min_score}-{max_score})"])

        table = Table(data, colWidths=[8*cm])
        style = [
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
        ]

        # Color code the legend
        for i, ((_, _), (_, _, color)) in enumerate(self.performance_levels.items(), 1):
            style.append(('BACKGROUND', (0, i), (0, i), color))
            style.append(('TEXTCOLOR', (0, i), (0, i), colors.white))

        table.setStyle(TableStyle(style))
        return table

    def process_data(self, csv_data):
        """Process CSV data with additional statistics"""
        df = pd.read_csv(csv_data)

        # Convert AVG column to numeric, coercing errors to NaN
        df['AVG'] = pd.to_numeric(df['AVG'], errors='coerce')

        subjects = ['ENG', 'MAT', 'AGR', 'KISW',
                    'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']
        for subject in subjects:
            df[f'{subject}_avg'] = df[subject].mean()

        # Now this should work without errors
        df['class_avg'] = df['AVG'].mean()
        df['total_students'] = len(df)

        return df

    def generate_report_cards(self, csv_data):
        """Generate modern single-page report cards"""
        df = self.process_data(csv_data)
        elements = []

        school_info = {
            'name': 'JINA JUNIOR SCHOOL, YALA',
            'address': 'Grade 8 Academic Report - Term 3, 2024'
        }

        for _, student_data in df.iterrows():
            if pd.isna(student_data['Name']):
                continue

            # Header
            elements.append(self.create_header_table(
                student_data, school_info))
            elements.append(Spacer(1, 0.2*inch))

            # Performance Table
            elements.append(self.create_performance_table(student_data))
            elements.append(Spacer(1, 0.2*inch))

            # Two-column layout for summary and legend
            summary_and_legend = Table([
                [self.create_summary_section(
                    student_data), self.create_legend()]
            ], colWidths=[10*cm, 8*cm])
            elements.append(summary_and_legend)
            elements.append(Spacer(1, 0.2*inch))

            # Remarks
            elements.append(self.create_remarks_section())
            elements.append(PageBreak())

        self.doc.build(elements[:-1])


# Example usage
if __name__ == "__main__":
    generator = ModernReportCardGenerator('modern_report_cards.pdf')
    generator.generate_report_cards('Jina_Marksheet.csv')
