
import html2canvas from 'html2canvas';

/**
 * Captures the specified element and triggers an instant download as a PNG image.
 * This provides a high-fidelity 'instant' download experience for the user.
 */
export const generatePDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Create canvas from the receipt element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      backgroundColor: '#ffffff', // Ensure background isn't transparent
      logging: false,
    });

    // Convert canvas to image data
    const image = canvas.toDataURL('image/png', 1.0);
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    const timestamp = new Date().getTime();
    link.download = `receipt-${timestamp}.png`;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to generate receipt image:', error);
    // Fallback to print if capture fails
    window.print();
  }
};
