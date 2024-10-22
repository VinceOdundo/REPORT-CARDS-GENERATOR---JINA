from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts import spider, lineplots
import pandas as pd
import numpy as np


class ModernReportCardGenerator:
    def __init__(self, output_filename):
        self.doc = SimpleDocTemplate(
            output_filename,
            pagesize=A4,
            rightMargin=30,
            leftMargin=30,
            topMargin=30,
            bottomMargin=30
        )
        self.styles = getSampleStyleSheet()
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
            (0, 30): ('Below Expectation', 1, colors.HexColor('#FF6B6B')),
            (31, 49): ('Approaching Expectation', 2, colors.HexColor('#FFD93D')),
            (50, 79): ('Meeting Expectation', 3, colors.HexColor('#6BCB77')),
            (80, 100): ('Exceeding Expectation', 4, colors.HexColor('#4D96FF'))
        }

    def init_styles(self):
        """Initialize modern custom styles"""
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1,
            textColor=colors.HexColor('#2C3E50'),
            fontName='Helvetica-Bold'
        )

        self.subtitle_style = ParagraphStyle(
            'CustomSubTitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=20,
            alignment=1,
            textColor=colors.HexColor('#34495E'),
            fontName='Helvetica'
        )

        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )

    def get_performance_level(self, score):
        """Get performance level, rub score, and color based on marks"""
        for (min_score, max_score), (level, rub, color) in self.performance_levels.items():
            if min_score <= score <= max_score:
                return level, rub, color
        return 'Not Evaluated', 0, colors.white

    def create_header(self, school_info):
        """Create modern header section with logo"""
        elements = []

        try:
            logo = Image('jina lgo.png', width=1.5*inch, height=1.5*inch)
        except:
            # Fallback to placeholder if logo file is not found
            logo = Image('/api/placeholder/100/100',
                         width=1.5*inch, height=1.5*inch)

        elements.append(logo)
        elements.append(Spacer(1, 0.2*inch))

        elements.append(Paragraph(school_info['name'], self.title_style))
        elements.append(Paragraph(school_info['address'], self.subtitle_style))

        return elements

    def create_spider_chart(self, student_data):
        """Create a spider chart for subject performance"""
        drawing = Drawing(400, 200)

        subjects = ['ENG', 'MAT', 'AGR', 'KISW',
                    'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']
        data = [[student_data[subject] for subject in subjects]]

        spider_chart = spider.SpiderChart()
        spider_chart.x = 50
        spider_chart.y = 50
        spider_chart.width = 300
        spider_chart.height = 150
        spider_chart.data = data
        spider_chart.labels = subjects
        spider_chart.strands[0].strokeColor = colors.HexColor('#2C3E50')
        spider_chart.strands[0].fillColor = colors.HexColor('#3498DB')
        spider_chart.strokeColor = colors.grey

        drawing.add(spider_chart)
        return drawing

    def create_performance_analysis(self, student_data):
        """Create detailed performance analysis with teacher comments"""
        elements = []

        subjects = ['ENG', 'MAT', 'AGR', 'KISW',
                    'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']
        data = [['Subject', 'Score', 'Performance Level', 'Teacher']]

        for subject in subjects:
            score = student_data[subject]
            level, _, color = self.get_performance_level(score)
            teacher = self.teachers.get(subject, '')

            data.append([
                subject,
                f"{score}%",
                level,
                teacher
            ])

        table = Table(data, colWidths=[2*cm, 2*cm, 8*cm, 4*cm])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#ECF0F1')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))

        elements.append(Paragraph("Performance Analysis", self.header_style))
        elements.append(table)

        return elements

    def create_summary_statistics(self, student_data):
        """Create summary statistics section"""
        elements = []

        data = [
            ['Overall Statistics', ''],
            ['Total Score:', f"{student_data['TTL']}/900"],
            ['Average Score:', f"{student_data['AVG']:.1f}%"],
            ['Class Position:', f"{student_data['RANK']
                                   }/{student_data['total_students']}"],
            ['Performance Trend:', 'Above class average' if student_data['AVG']
                > student_data['class_avg'] else 'Below class average']
        ]

        table = Table(data, colWidths=[4*cm, 12*cm])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#ECF0F1')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))

        elements.append(Paragraph("Summary Statistics", self.header_style))
        elements.append(table)

        return elements

    def process_data(self, csv_data):
        """Process the CSV data and calculate statistics"""
        df = pd.read_csv(csv_data)
        # Convert to numeric, coerce errors to NaN
        df['AVG'] = pd.to_numeric(df['AVG'], errors='coerce')
        df['class_avg'] = df['AVG'].mean()
        df['total_students'] = len(df)

        return df

    def generate_report_cards(self, csv_data):
        """Generate modern report cards for all students"""
        df = self.process_data(csv_data)
        elements = []

        school_info = {
            'name': 'JINA JUNIOR SCHOOL, YALA',
            'address': 'Grade 8 Academic Report - Term 3, 2024'
        }

        for _, student_data in df.iterrows():
            if pd.isna(student_data['Name']):
                continue

            # Create report card elements
            elements.extend(self.create_header(school_info))
            elements.append(Spacer(1, 0.3*inch))

            # Add student info
            elements.append(
                Paragraph(f"Student: {student_data['Name']}", self.header_style))
            elements.append(Paragraph(f"Assessment Number: {
                            student_data['Assessment Number']}", self.subtitle_style))
            elements.append(Spacer(1, 0.3*inch))

            # Add spider chart
            elements.append(self.create_spider_chart(student_data))
            elements.append(Spacer(1, 0.3*inch))

            # Add performance analysis
            elements.extend(self.create_performance_analysis(student_data))
            elements.append(Spacer(1, 0.3*inch))

            # Add summary statistics
            elements.extend(self.create_summary_statistics(student_data))
            elements.append(Spacer(1, 0.3*inch))

            # Add remarks section
            elements.append(Paragraph("Remarks", self.header_style))
            elements.append(Spacer(1, 1*inch))  # Space for handwritten remarks

            # Add signatures
            elements.append(Paragraph("Signatures", self.header_style))
            elements.append(Spacer(1, 1*inch))  # Space for signatures

            elements.append(PageBreak())

        self.doc.build(elements[:-1])  # Remove last page break


# Example usage
if __name__ == "__main__":
    generator = ModernReportCardGenerator('modern_report_cards.pdf')
    generator.generate_report_cards('Jina_Marksheet.csv')
