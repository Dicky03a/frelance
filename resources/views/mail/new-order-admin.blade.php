<!DOCTYPE html>
<html>
<head>
    <title>Pesanan Baru Diterima</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #6366F1;">Pesanan Baru!</h1>
    <p>Ada pesanan baru yang telah dibayar dan siap untuk dikerjakan.</p>
    
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detail Pesanan:</h3>
        <p><strong>Pelanggan:</strong> {{ $order->user->name }} ({{ $order->user->email }})</p>
        <p><strong>Kode Pesanan:</strong> {{ $order->order_code }}</p>
        <p><strong>Layanan:</strong> {{ $order->servicePackage->service->title }} - {{ $order->servicePackage->name }}</p>
        <p><strong>Total Pembayaran:</strong> Rp {{ number_format($order->total_idr, 0, ',', '.') }}</p>
    </div>

    <h3>Persyaratan:</h3>
    <p style="white-space: pre-wrap;">{{ $order->requirements }}</p>

    <p>Segera proses pesanan ini melalui dashboard admin:</p>
    <p>
        <a href="{{ url('/admin/orders/' . $order->id) }}" style="background: #6366F1; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Kelola Pesanan</a>
    </p>
</body>
</html>
