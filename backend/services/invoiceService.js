const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (order, dataCallback, endCallback) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Store Details
  const storeName = 'Rishabh Provision Store';
  const storeAddress = '123 Market Street, Andheri East, Mumbai, MH - 400069';
  const gstIn = '27XXXXX1234X1ZX';

  // Header
  doc.fillColor('#4f46e5')
     .fontSize(24)
     .text(storeName, 50, 50)
     .fillColor('#000000')
     .fontSize(10)
     .text(storeAddress, 50, 80)
     .text(`GSTIN: ${gstIn}`, 50, 95)
     .moveDown();

  // Invoice Details
  doc.fontSize(20).text('TAX INVOICE', 400, 50, { align: 'right' })
     .fontSize(10)
     .text(`Invoice No: INV-${order._id.toString().substring(18).toUpperCase()}`, 400, 80, { align: 'right' })
     .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95, { align: 'right' })
     .text(`Order ID: ${order._id}`, 400, 110, { align: 'right' });

  doc.moveTo(50, 140).lineTo(550, 140).stroke();

  // Customer Details
  doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 160)
     .font('Helvetica').fontSize(10)
     .text(`Customer Name: ${order.customerId?.name || 'Guest User'}`, 50, 175)
     .text(`Address: ${order.deliveryAddress || 'N/A'}`, 50, 190);

  doc.moveTo(50, 220).lineTo(550, 220).stroke();

  // Table Headers
  let tableTop = 240;
  doc.font('Helvetica-Bold')
     .text('Item', 50, tableTop)
     .text('Price', 250, tableTop)
     .text('Qty', 320, tableTop)
     .text('Taxable', 370, tableTop)
     .text('GST %', 440, tableTop)
     .text('Total', 500, tableTop);
  
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  // Table Rows
  let y = tableTop + 25;
  doc.font('Helvetica');
  
  let subtotal = 0;
  let totalTax = 0;

  order.items.forEach(item => {
    const price = item.price || 0;
    const qty = item.quantity || 1;
    // Assuming GST is stored in product if populated, otherwise defaulting to 5% for mock
    const gstRate = item.productId?.gstPercentage || 5; 
    
    const taxableAmount = price * qty;
    const taxAmount = (taxableAmount * gstRate) / 100;
    const itemTotal = taxableAmount + taxAmount;

    subtotal += taxableAmount;
    totalTax += taxAmount;

    // We assume the product was populated. If not, use ID.
    const itemName = item.productId?.name || `Product ${item.productId}`;

    doc.text(itemName.substring(0, 30), 50, y)
       .text(`Rs ${price.toFixed(2)}`, 250, y)
       .text(qty, 320, y)
       .text(`Rs ${taxableAmount.toFixed(2)}`, 370, y)
       .text(`${gstRate}%`, 440, y)
       .text(`Rs ${itemTotal.toFixed(2)}`, 500, y);
    
    y += 20;
  });

  doc.moveTo(50, y).lineTo(550, y).stroke();

  // Totals Section
  const totalsY = y + 20;
  doc.font('Helvetica-Bold')
     .text('Subtotal:', 370, totalsY)
     .text(`Rs ${subtotal.toFixed(2)}`, 500, totalsY)
     
     .text('Total GST:', 370, totalsY + 15)
     .text(`Rs ${totalTax.toFixed(2)}`, 500, totalsY + 15)

     .text('Delivery Fee:', 370, totalsY + 30)
     .text('Rs 0.00', 500, totalsY + 30)

     .font('Helvetica-Bold').fontSize(14)
     .text('Grand Total:', 370, totalsY + 55)
     .text(`Rs ${(subtotal + totalTax).toFixed(2)}`, 500, totalsY + 55);

  // Footer
  doc.fontSize(10).font('Helvetica').text('Thank you for shopping with Rishabh Provision Store!', 50, 700, { align: 'center', width: 500 });
  doc.text('This is a computer generated invoice.', 50, 715, { align: 'center', width: 500 });

  doc.end();
};

module.exports = { generateInvoicePDF };
