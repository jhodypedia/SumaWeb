$(document).ready(() => {
  $('#swapBtn').click(async () => {
    const pk = $('#privateKey').val().trim();

    if (!pk.startsWith('0x')) {
      toastr.error('Private key tidak valid!');
      return;
    }

    $('#swapBtn').prop('disabled', true).text('⏳ Memproses...');

    try {
      const res = await $.ajax({
        url: '/swap',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ privateKey: pk })
      });

      toastr.success('Swap sukses dan dikonfirmasi!');
      $('#result').html(`
        <div class="alert alert-success mt-3">
          <h5>Swap Berhasil 🎉</h5>
          <p><b>Wallet:</b> ${res.address}</p>
          <p><b>Jumlah WCBTC:</b> ${res.amountIn}</p>
          <p><b>Estimasi SUMA:</b> ${res.amountOut}</p>
          <p><b>Tx Hash:</b> <a href="${res.explorer}" target="_blank">${res.txHash}</a></p>
        </div>
      `);

      loadHistory(); // Refresh histori
    } catch (err) {
      console.error(err);
      const msg = err.responseJSON?.error || 'Swap gagal';
      toastr.error(msg);
    } finally {
      $('#swapBtn').prop('disabled', false).text('Swap Sekarang');
    }
  });

  // Fungsi memuat histori
  function loadHistory() {
    $.get('/history', (data) => {
      if (!Array.isArray(data) || data.length === 0) {
        $('#historyTable').html('<tr><td colspan="6" class="text-center">Belum ada histori swap</td></tr>');
        return;
      }

      const rows = data.reverse().map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${new Date(item.timestamp).toLocaleString()}</td>
          <td><code>${item.address.slice(0, 6)}...${item.address.slice(-4)}</code></td>
          <td>${item.amountIn}</td>
          <td>${item.amountOut}</td>
          <td><a href="https://explorer.testnet.citrea.xyz/tx/${item.txHash}" target="_blank">Lihat</a></td>
        </tr>
      `).join('');

      $('#historyTable').html(rows);
    }).fail(() => {
      toastr.error('Gagal memuat histori swap');
      $('#historyTable').html('<tr><td colspan="6" class="text-center text-danger">Error mengambil data</td></tr>');
    });
  }

  // Panggil saat halaman load
  loadHistory();
});
