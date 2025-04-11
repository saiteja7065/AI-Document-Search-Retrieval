import os
import PyPDF2
import docx


def extract_text_from_pdf(file_path):
    """
    Extract text content from a PDF file
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text content
    """
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
        return text
    except Exception as e:
        print(f'Error extracting text from PDF: {e}')
        raise Exception('Failed to extract text from PDF')


def extract_text_from_docx(file_path):
    """
    Extract text content from a DOCX file
    
    Args:
        file_path (str): Path to the DOCX file
        
    Returns:
        str: Extracted text content
    """
    try:
        doc = docx.Document(file_path)
        text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        print(f'Error extracting text from DOCX: {e}')
        raise Exception('Failed to extract text from DOCX')


def extract_text_from_txt(file_path):
    """
    Extract text content from a TXT file
    
    Args:
        file_path (str): Path to the TXT file
        
    Returns:
        str: Extracted text content
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except UnicodeDecodeError:
        # Try with different encoding if UTF-8 fails
        with open(file_path, 'r', encoding='latin-1') as file:
            return file.read()
    except Exception as e:
        print(f'Error extracting text from TXT: {e}')
        raise Exception('Failed to extract text from TXT')