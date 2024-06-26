const btnpayment = $('#btn-submit-payment');
const locale = getCookie('locale');
if (btnpayment) {
  btnpayment.on('click', function () {
    const payment = {
      name: $('#name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      address: $('#address').val(),
      note: $('#note').val(),
    };
    fetch('/order/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    })
      .then((res) => res.text())
      .then(() => {
        swal.fire({
          title: locale === 'en' ? 'Success!' : 'Thành công!',
          text: locale === 'en' ? 'successfully !!' : 'Thành công !',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setTimeout(() => {
          window.location.href = '/order/history';
        }, 1000);
      });
  });
}
