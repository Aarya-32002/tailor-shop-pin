import { Order, Customer, ShopSettings } from '../types';

export const generateBillPDF = (
  order: Order, 
  customer: Customer, 
  settings: ShopSettings
): void => {
  // Create a new window for the PDF
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to generate the bill');
    return;
  }

  const billHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bill - ${order.id}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .shop-name {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin: 0;
        }
        .shop-details {
          margin: 10px 0;
          color: #666;
        }
        .bill-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .customer-info, .bill-details {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          width: 45%;
        }
        .info-title {
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          background: #2563eb;
          color: white;
          padding: 12px;
          text-align: left;
        }
        .items-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table tr:hover {
          background: #f9fafb;
        }
        .totals {
          margin-top: 30px;
          text-align: right;
        }
        .totals table {
          margin-left: auto;
          border-collapse: collapse;
        }
        .totals td {
          padding: 5px 15px;
          text-align: right;
        }
        .total-row {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #2563eb;
          color: #2563eb;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #666;
        }
        .paid-stamp {
          display: inline-block;
          background: #059669;
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          margin: 20px 0;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="shop-name">Vasanthi Maggam Works</h1>
        <div class="shop-details">
          Pedha Koneru Street<br>
          Phone: 9182443151
        </div>
      </div>

      <div class="bill-info">
        <div class="customer-info">
          <div class="info-title">Customer Details</div>
          <strong>Name:</strong> ${customer.name}<br>
          <strong>Phone:</strong> ${customer.phone}<br>
          <strong>ID:</strong> ${customer.id}<br>
          <strong>Address:</strong> ${customer.address}
        </div>
        <div class="bill-details">
          <div class="info-title">Bill Details</div>
          <strong>Bill ID:</strong> ${order.id}<br>
          <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
          <strong>Delivery:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}<br>
          <strong>Status:</strong> ${order.paymentStatus}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.clothingType}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price}</td>
              <td>₹${item.total}</td>
            </tr>
          `).join('')}
          ${order.extraCharges > 0 ? `
            <tr>
              <td>Extra Charges</td>
              <td>-</td>
              <td>₹${order.extraCharges}</td>
              <td>₹${order.extraCharges}</td>
            </tr>
          ` : ''}
          ${order.materialCharges > 0 ? `
            <tr>
              <td>Material Charges</td>
              <td>-</td>
              <td>₹${order.materialCharges}</td>
              <td>₹${order.materialCharges}</td>
            </tr>
          ` : ''}
          ${order.discount > 0 ? `
            <tr>
              <td>Discount</td>
              <td>-</td>
              <td>-₹${order.discount}</td>
              <td>-₹${order.discount}</td>
            </tr>
          ` : ''}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>₹${order.subtotal}</td>
          </tr>
          <tr class="total-row">
            <td>Total Amount:</td>
            <td>₹${order.total}</td>
          </tr>
        </table>
      </div>

      ${order.paymentStatus === 'Paid' ? '<div class="paid-stamp">PAID</div>' : ''}

      <div class="footer">
        <p><strong>Thank you for choosing Vasnthi Maggam Works!</strong></p>
        <p>Visit us again for all your tailoring needs.</p>
      </div>

      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Print</button>
        <button onclick="window.close()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Close</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(billHTML);
  printWindow.document.close();
};