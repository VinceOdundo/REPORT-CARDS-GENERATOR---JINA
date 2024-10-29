import sys
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(output_filename):
    data = [["Subject", "Score"], ["Math", "85"], ["English", "90"]]
    doc = SimpleDocTemplate(output_filename, pagesize=A4)
    styles = getSampleStyleSheet()

    elements = [Paragraph("Student Report Card",
                          styles['Title']), Spacer(1, 20)]
    table = Table(data)
    elements.append(table)

    doc.build(elements)


if __name__ == "__main__":
    output_file = sys.argv[1]
    generate_pdf(output_file)
