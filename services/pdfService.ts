import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a high-quality PDF from an HTML element.
 * Uses a "Clone & Clean" strategy to ensure the PDF is rendered at 100% scale
 * without any UI zoom/transform artifacts, preventing scattered text.
 * Also handles multi-page slicing for long documents.
 */
export const generatePDF = async (sourceElement: HTMLElement, filename: string = 'document.pdf') => {
  // 1. Create a clone of the element to render off-screen
  // This ensures we capture the document at its "true" size (A4 pixel width),
  // ignoring the user's current zoom level in the preview.
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  
  // 2. Set up a hidden container for the clone
  // We place it far off-screen but keep it in the DOM so styles compute correctly
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-10000px';
  container.style.left = '-10000px';
  container.style.zIndex = '-1000';
  container.style.width = '794px'; // Force standard A4 width at 96 DPI
  document.body.appendChild(container);
  container.appendChild(clone);

  try {
    // 3. Reset styles on the clone to ensure a clean capture
    // We remove any transforms (scaling) that might be on the source
    clone.style.transform = 'none';
    clone.style.width = '794px';
    clone.style.height = 'auto'; // Allow it to grow naturally
    clone.style.minHeight = '1123px'; // Minimum 1 A4 page
    clone.style.margin = '0';
    clone.style.overflow = 'visible';
    
    // Ensure background colors are printed
    clone.style.backgroundColor = '#ffffff';

    // 4. Capture the clone using html2canvas
    // Scale 2.5 provides a good balance between crisp text and file size
    const canvas = await html2canvas(clone, {
      scale: 2.5, 
      useCORS: true,
      logging: false,
      width: 794,
      windowWidth: 794,
      backgroundColor: '#ffffff'
    });

    // 5. Initialize PDF
    // A4 dimensions in mm
    const PDF_WIDTH_MM = 210; 
    const PDF_HEIGHT_MM = 297;
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const contentWidthPx = canvas.width;
    const contentHeightPx = canvas.height;
    
    // One PDF page height in canvas pixels
    // (canvas width / pdf width mm) * pdf height mm
    const pageHeightPx = (contentWidthPx / PDF_WIDTH_MM) * PDF_HEIGHT_MM;
    
    // 6. Multi-Page Slicing Logic
    let remainingHeightPx = contentHeightPx;
    let currentYPosMm = 0; // Position in the PDF (mm) where we start drawing the image

    // Add first page
    // addImage(data, format, x, y, w, h)
    // To achieve slicing, we effectively draw the ENTIRE long image, but shift it upwards (negative Y)
    // so that only the relevant slice is visible on the current PDF page.
    pdf.addImage(imgData, 'PNG', 0, 0, PDF_WIDTH_MM, (contentHeightPx * PDF_WIDTH_MM) / contentWidthPx);
    
    remainingHeightPx -= pageHeightPx;

    // Loop for subsequent pages
    while (remainingHeightPx > 0) {
      pdf.addPage();
      
      // Shift the image up by the height of one page (in mm)
      currentYPosMm -= PDF_HEIGHT_MM;
      
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        currentYPosMm, 
        PDF_WIDTH_MM, 
        (contentHeightPx * PDF_WIDTH_MM) / contentWidthPx
      );
      
      remainingHeightPx -= pageHeightPx;
    }

    pdf.save(filename);
    return true;

  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  } finally {
    // Clean up DOM
    document.body.removeChild(container);
  }
};