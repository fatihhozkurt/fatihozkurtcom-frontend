window.dataLayer = window.dataLayer || []

function gtag() {
  window.dataLayer.push(arguments)
}

window.gtag = gtag
gtag('js', new Date())
gtag('config', 'G-C795R14MRG', {
  anonymize_ip: true,
  transport_type: 'beacon',
})
