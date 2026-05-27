<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $order->order_code }}</title>
    <style>
        @page {
            margin: 0cm 0cm;
        }
        body {
            font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            font-size: 13px;
        }
        .invoice-wrapper {
            padding: 50px;
            position: relative;
        }
        .header-accent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: #6366f1;
        }
        .header {
            margin-bottom: 60px;
            display: table;
            width: 100%;
        }
        .company-info {
            display: table-cell;
            vertical-align: top;
        }
        .company-name {
            font-size: 28px;
            font-weight: 800;
            color: #111118;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }
        .company-details {
            color: #64748b;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .invoice-meta {
            display: table-cell;
            text-align: right;
            vertical-align: top;
        }
        .invoice-label {
            font-size: 40px;
            font-weight: 200;
            color: #cbd5e1;
            margin: 0;
            line-height: 1;
        }
        .invoice-number {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-top: 10px;
        }

        .billing-grid {
            width: 100%;
            margin-bottom: 50px;
            border-collapse: collapse;
        }
        .billing-grid td {
            width: 33%;
            vertical-align: top;
            padding: 0;
        }
        .section-title {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 6px;
            width: 90%;
        }
        .billing-content p {
            margin: 0;
            font-size: 13px;
        }
        .billing-content .name {
            font-weight: 700;
            color: #0f172a;
            font-size: 15px;
        }

        .table-container {
            margin-bottom: 40px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        .items-table th {
            text-align: left;
            background: #f8fafc;
            padding: 14px 20px;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #e2e8f0;
        }
        .items-table td {
            padding: 20px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
        }
        .item-name {
            font-weight: 700;
            color: #1e293b;
            font-size: 14px;
            margin-bottom: 4px;
        }
        .item-desc {
            color: #64748b;
            font-size: 12px;
        }
        .item-price {
            font-weight: 600;
            color: #0f172a;
            text-align: right;
        }

        .summary-container {
            margin-top: 30px;
        }
        .summary-table {
            width: 280px;
            float: right;
            border-collapse: collapse;
        }
        .summary-table td {
            padding: 10px 0;
            font-size: 13px;
        }
        .summary-label {
            color: #64748b;
        }
        .summary-value {
            text-align: right;
            font-weight: 600;
            color: #1e293b;
        }
        .total-row td {
            padding-top: 20px;
            border-top: 2px solid #0f172a;
        }
        .total-label {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
        }
        .total-amount {
            font-size: 22px;
            font-weight: 800;
            color: #6366f1;
            text-align: right;
        }

        .status-seal {
            position: absolute;
            top: 200px;
            right: 50px;
            border: 4px double;
            padding: 10px 20px;
            transform: rotate(-15deg);
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            opacity: 0.15;
            z-index: 100;
        }
        .seal-paid { color: #10b981; border-color: #10b981; }
        .seal-pending { color: #f59e0b; border-color: #f59e0b; }

        .footer {
            margin-top: 100px;
            border-top: 1px solid #f1f5f9;
            padding-top: 30px;
        }
        .footer-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .footer-grid td {
            width: 50%;
            vertical-align: top;
        }
        .notes-section h4 {
            font-size: 10px;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 8px;
        }
        .notes-section p {
            font-size: 11px;
            color: #64748b;
            margin: 0;
            width: 80%;
        }
        .signature-section {
            text-align: right;
        }
        .signature-box {
            display: inline-block;
            width: 200px;
            text-align: center;
        }
        .signature-line {
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 10px;
            height: 40px;
        }
        .signature-name {
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
        }
    </style>
</head>
<body>
    <div class="header-accent"></div>
    
    <div class="invoice-wrapper">
        @if($order->status === \App\Enums\OrderStatus::PAID)
            <div class="status-seal seal-paid">PAID</div>
        @else
            <div class="status-seal seal-pending">PENDING</div>
        @endif

        <div class="header">
            <div class="company-info">
                <div class="company-name">DEV PORTO</div>
                <div class="company-details">Creative Solutions & Development</div>
            </div>
            <div class="invoice-meta">
                <h1 class="invoice-label">INVOICE</h1>
                <div class="invoice-number">#{{ $order->order_code }}</div>
            </div>
        </div>

        <table class="billing-grid">
            <tr>
                <td>
                    <div class="section-title">Billed To</div>
                    <div class="billing-content">
                        <p class="name">{{ $order->customer_name }}</p>
                        <p>{{ $order->customer_whatsapp }}</p>
                        <p style="text-transform: capitalize; color: #64748b; margin-top: 4px;">{{ $order->customer_category }}</p>
                    </div>
                </td>
                <td>
                    <div class="section-title">Date Issued</div>
                    <div class="billing-content">
                        <p>{{ $order->created_at->format('F d, Y') }}</p>
                        <p style="color: #64748b; font-size: 11px;">{{ $order->created_at->format('H:i T') }}</p>
                    </div>
                </td>
                <td>
                    <div class="section-title">Payment Status</div>
                    <div class="billing-content">
                        <p style="font-weight: 700; color: {{ $order->status === \App\Enums\OrderStatus::PAID ? '#10b981' : '#f59e0b' }}">
                            {{ strtoupper($order->status->value) }}
                        </p>
                        @if($order->paid_at)
                            <p style="color: #64748b; font-size: 11px;">Paid on {{ $order->paid_at->format('M d, Y') }}</p>
                        @endif
                    </div>
                </td>
            </tr>
        </table>

        <div class="table-container">
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Service Description</th>
                        <th style="text-align: right; width: 150px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="item-name">{{ $order->servicePackage->service->name }}</div>
                            <div class="item-desc">Package: {{ $order->servicePackage->name }}</div>
                            <div class="item-desc" style="margin-top: 8px; font-style: italic;">
                                Requirements: {{ \Illuminate\Support\Str::limit($order->requirements, 100) }}
                            </div>
                        </td>
                        <td class="item-price">
                            Rp {{ number_format($order->total_idr, 0, ',', '.') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="summary-container">
            <table class="summary-table">
                <tr>
                    <td class="summary-label">Subtotal</td>
                    <td class="summary-value">Rp {{ number_format($order->total_idr, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td class="summary-label">Tax (0%)</td>
                    <td class="summary-value">Rp 0</td>
                </tr>
                <tr class="total-row">
                    <td class="total-label">Amount Due</td>
                    <td class="total-amount">Rp {{ number_format($order->total_idr, 0, ',', '.') }}</td>
                </tr>
            </table>
            <div style="clear: both;"></div>
        </div>

        <div class="footer">
            <table class="footer-grid">
                <tr>
                    <td>
                        <div class="notes-section">
                            <h4>Important Notes</h4>
                            <p>This invoice is electronically generated and serves as an official record of the transaction. For support or inquiries, please contact our administrator at 085182529291.</p>
                        </div>
                    </td>
                    <td>
                        <div class="signature-section">
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div class="signature-name">Authorized Administrator</div>
                                <div style="font-size: 9px; color: #94a3b8;">DEV PORTO OFFICIAL</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
