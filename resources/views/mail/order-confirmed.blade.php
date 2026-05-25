<!DOCTYPE html>
<html>
<head>
    <title>Pesanan Dikonfirmasi</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #6366F1;">Halo, {{ $order->user->name }}!</h1>
    <p>Terima kasih telah memesan layanan kami. Pembayaran Anda telah kami terima dan pesanan Anda sedang kami proses.</p>
    
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detail Pesanan:</h3>
        <p><strong>Kode Pesanan:</strong> {{ $order->order_code }}</p>
        <p><strong>Layanan:</strong> {{ $order->servicePackage->service->title }} - {{ $order->servicePackage->name }}</p>
        <p><strong>Total Pembayaran:</strong> Rp {{ number_format($order->total_idr, 0, ',', '.') }}</p>
    </div>

    <h3>Persyaratan Anda:</h3>
    <p style="white-space: pre-wrap;">{{ $order->requirements }}</p>

    <p>Anda dapat melihat status pesanan Anda melalui tautan di bawah ini:</p>
    <p>
        <a href="{{ route('orders.show', $order->id) }}" style="background: #6366F1; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Lihat Pesanan</a>
    </p>

    <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
    <p>Salam,<br>Dicky (frelance-porto)</p>
</body>
</html>
