from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.charts import lineplots, barcharts
from reportlab.graphics.widgets.markers import makeMarker
import pandas as pd
import numpy as np

class ModernReportCardGenerator:
    def __init__(self, output_filename):
        self.doc = SimpleDocTemplate(
            output_filename,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )
        self.styles = getSampleStyleSheet()
        self.init_styles()
        self.performance_levels = {
            (0, 30): ('Below Expectation', 1),
            (31, 49): ('Approaching Expectation', 2),
            (50, 79): ('Meeting Expectation', 3),
            (80, 100): ('Exceeding Expectation', 4)
        }
        
    def init_styles(self):
        """Initialize custom styles for the modern report card"""
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=20,
            spaceAfter=30,
            alignment=1,
            textColor=colors.HexColor('#2C3E50')
        )
        
        self.subtitle_style = ParagraphStyle(
            'CustomSubTitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=20,
            alignment=1,
            textColor=colors.HexColor('#34495E')
        )
        
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=12
        )

    def get_performance_level(self, score):
        """Get performance level and rub score based on marks"""
        for (min_score, max_score), (level, rub) in self.performance_levels.items():
            if min_score <= score <= max_score:
                return level, rub
        return 'Not Evaluated', 0

    def create_header(self, school_info):
        """Create the modern header section"""
        elements = []
        
        # Logo placeholder
        elements.append(Paragraph(
            '<img src="/api/placeholder/100/100" width="100" height="100" alt="School Logo"/>', 
            self.title_style
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        # School name and info
        elements.append(Paragraph(school_info['name'], self.title_style))
        elements.append(Paragraph(school_info['address'], self.subtitle_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Report title
        elements.append(Paragraph(
            "ACADEMIC PERFORMANCE REPORT", 
            self.subtitle_style
        ))
        
        return elements

    def create_student_info_table(self, student_data):
        """Create a modern student information table"""
        data = [
            ['Student Information', '', 'Academic Period', ''],
            ['Name:', student_data['Name'], 'Term:', '3'],
            ['Assessment No:', student_data['Assessment Number'], 'Year:', '2024'],
            ['Class:', 'Grade 8', 'Rank:', f"{student_data['RANK']}/{student_data['total_students']}"],
        ]
        
        table = Table(data, colWidths=[2.5*cm, 7*cm, 2.5*cm, 4*cm])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#ECF0F1')),
            ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#2C3E50')),
            ('BACKGROUND', (2, 0), (3, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))
        
        return table

    def create_performance_table(self, student_data):
        """Create a modern performance table with performance levels"""
        headers = ['Subject', 'Score', 'Performance Level', 'Rub', 'Class Average']
        subjects = ['ENG', 'MAT', 'AGR', 'KISW', 'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']
        
        data = [headers]
        for subject in subjects:
            score = student_data[subject]
            level, rub = self.get_performance_level(score)
            class_avg = student_data[f'{subject}_avg']
            
            data.append([
                subject,
                f"{score}%",
                level,
                str(rub),
                f"{class_avg:.1f}%"
            ])
            
        # Add total row
        data.append([
            'TOTAL',
            f"{student_data['TTL']}/900",
            f"Average: {student_data['AVG']:.1f}%",
            '',
            f"Class Avg: {student_data['class_avg']:.1f}%"
        ])
        
        table = Table(data, colWidths=[4*cm, 2*cm, 5*cm, 2*cm, 3*cm])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#ECF0F1')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#ECF0F1')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ]))
        
        return table

    def create_analytics_section(self, student_data):
        """Create modern analytics section with insights"""
        elements = []
        
        # Student's strengths and areas for improvement
        strengths = []
        improvements = []
        subjects = ['ENG', 'MAT', 'AGR', 'KISW', 'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']
        
        for subject in subjects:
            score = student_data[subject]
            if score >= 80:
                strengths.append(subject)
            elif score < 50:
                improvements.append(subject)
        
        # Create analysis table
        analysis_data = [
            ['Performance Analysis', ''],
            ['Strengths:', ', '.join(strengths) if strengths else 'Keep working hard!'],
            ['Areas for Improvement:', ', '.join(improvements) if improvements else 'Excellent work across all subjects!'],
            ['Overall Standing:', f"Ranked {student_data['RANK']} out of {student_data['total_students']} students"],
            ['Performance Trend:', 'Above class average' if student_data['AVG'] > student_data['class_avg'] else 'Below class average']
        ]
        
        analysis_table = Table(analysis_data, colWidths=[4*cm, 12*cm])
        analysis_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#ECF0F1')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))
        
        elements.append(analysis_table)
        return elements

    def create_remarks_section(self):
        """Create a modern remarks section"""
        data = [
            ['Remarks and Signatures', '', '', ''],
            ["Class Teacher's Remarks:", '', "Signature:", ''],
            ["Principal's Remarks:", '', "Signature:", ''],
            ["Parent's/Guardian's Remarks:", '', "Signature:", ''],
            ['Date:', '', '', '']
        ]
        
        table = Table(data, colWidths=[4*cm, 8*cm, 2*cm, 2*cm])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#ECF0F1')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))
        
        return table

    def process_data(self, csv_data):
        """Process the CSV data and calculate necessary statistics"""
        df = pd.read_csv(csv_data)
        
        # Calculate class averages for each subject
        subjects = ['ENG', 'MAT', 'AGR', 'KISW', 'SCI', 'CRA', 'SST', 'P0TECH', 'CRE']
        for subject in subjects:
            df[f'{subject}_avg'] = df[subject].mean()
            
        df['class_avg'] = df['AVG'].mean()
        df['total_students'] = len(df)
        
        return df

    def generate_report_cards(self, csv_data):
        """Generate report cards for all students"""
        df = self.process_data(csv_data)
        elements = []
        
        school_info = {
            'name': 'JINA JUNIOR SCHOOL, YALA',
            'address': 'Grade 8 Academic Report - Term 3, 2024'
        }
        
        for _, student_data in df.iterrows():
            # Skip students with no name
            if pd.isna(student_data['Name']):
                continue
                
            student_elements = []
            student_elements.extend(self.create_header(school_info))
            student_elements.append(Spacer(1, 0.3*inch))
            
            student_elements.append(self.create_student_info_table(student_data))
            student_elements.append(Spacer(1, 0.3*inch))
            
            student_elements.append(self.create_performance_table(student_data))
            student_elements.append(Spacer(1, 0.3*inch))
            
            student_elements.extend(self.create_analytics_section(student_data))
            student_elements.append(Spacer(1, 0.3*inch))
            
            student_elements.append(self.create_remarks_section())
            
            elements.extend(student_elements)
            elements.append(PageBreak())
            
        self.doc.build(elements[:-1])  # Remove last page break

# Example usage
if __name__ == "__main__":
    generator = ModernReportCardGenerator('modern_report_cards.pdf')
    generator.generate_report_cards('Jina Marksheet  - Sheet1.csv')