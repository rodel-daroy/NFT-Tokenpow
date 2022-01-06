  const div = document.getElementById('my-money-button')
  moneyButton.render(div, {
  to: "ryan@moneybutton.com",
  amount: "1",
  currency: "USD",
  label: "Wait...",
  clientIdentifier: "some public client identifier",
  buttonId: "234325",
  buttonData: "{}",
  type: "tip",
  onPayment: function (arg) { console.log('onPayment', arg) },
  onError: function (arg) { console.log('onError', arg) }
})
