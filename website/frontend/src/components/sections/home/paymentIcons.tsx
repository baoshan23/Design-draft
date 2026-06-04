import Image from 'next/image';
import type { ReactNode } from 'react';

// Inline branded wordmark logos for brands whose PNGs in /public/images/payment
// were placeholder/empty. Uses each brand's primary color.
const LOGO_NODE: Record<string, ReactNode> = {
  // The colored pill (rect) is inset with even margins on all four sides of the
  // 120x56 viewBox (x=10..110, y=6..50 → pill center stays 60,28), so it reads
  // as a centered block within the square tile. The wordmark is centered ON the
  // pill via an EXPLICIT baseline y (NOT dominant-baseline:central, which centers
  // on the font's em-box and drifts with system-ui font fallback — esp. CJK).
  // Each y was tuned per word in headless Chromium to land the glyph bbox within
  // ±0.5px of the pill's vertical centre (28): baseline ≈ 28 + ~0.36·fontSize,
  // adjusted for ascenders/descenders (tabby's 'y' descender → higher position).
  MoMo: (
    <svg viewBox="0 0 120 56" width="120" height="56" preserveAspectRatio="xMidYMid meet" role="img" aria-label="MoMo">
      <rect x="10" y="6" width="100" height="44" rx="11" fill="#A50064" />
      <text x="60" y="36" textAnchor="middle" fill="#FFFFFF" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="22" fontWeight="800" letterSpacing="-0.5">MoMo</text>
    </svg>
  ),
  'Toss Pay': (
    <svg viewBox="0 0 120 56" width="120" height="56" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Toss Pay">
      <rect x="10" y="6" width="100" height="44" rx="11" fill="#0064FF" />
      <text x="60" y="35" textAnchor="middle" fill="#FFFFFF" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="18" fontWeight="800" letterSpacing="-0.3">Toss Pay</text>
    </svg>
  ),
  Tabby: (
    <svg viewBox="0 0 120 56" width="120" height="56" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Tabby">
      <rect x="10" y="6" width="100" height="44" rx="11" fill="#292929" />
      <text x="60" y="33" textAnchor="middle" fill="#3BFFC1" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="20" fontWeight="800" letterSpacing="0">tabby</text>
    </svg>
  ),
  Sezzle: (
    <svg viewBox="0 0 120 56" width="120" height="56" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sezzle">
      <rect x="10" y="6" width="100" height="44" rx="11" fill="#9B5BFC" />
      <text x="60" y="35" textAnchor="middle" fill="#FFFFFF" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="20" fontWeight="800" letterSpacing="0">sezzle</text>
    </svg>
  ),
};

// Display name -> PNG file in /public/images/payment.
// All files exist in the repo; verified before listing here.
const LOGO_FILE: Record<string, string> = {
  // Cards
  Visa: '/images/payment/Visa.png',
  Mastercard: '/images/payment/Mastercard.png',
  'American Express': '/images/payment/AmericanExpress.png',
  Discover: '/images/payment/Discover.png',
  JCB: '/images/payment/JCB.png',
  UnionPay: '/images/payment/UnionPay.png',
  'Diners Club': '/images/payment/DinersClub.png',
  'Cartes Bancaires': '/images/payment/CartesBancaires.png',
  Interac: '/images/payment/Interac.png',
  Eftpos: '/images/payment/Eftpos.png',
  Bancontact: '/images/payment/Bancontact.png',

  // Global wallets / digital
  PayPal: '/images/payment/PayPal.png',
  'Apple Pay': '/images/payment/ApplePay.png',
  'Google Pay': '/images/payment/GooglePay.png',
  'Samsung Pay': '/images/payment/SamsungPay.png',
  'Amazon Pay': '/images/payment/Amazon_Pay.png',
  'Cash App Pay': '/images/payment/CashAppPay.png',
  'Revolut Pay': '/images/payment/RevolutPay.png',
  MobilePay: '/images/payment/MobilePay.png',

  // Asia
  Alipay: '/images/payment/Alipay.png',
  'WeChat Pay': '/images/payment/WeChat_Pay.png',
  GrabPay: '/images/payment/GrabPay.png',
  GCash: '/images/payment/GCash.png',
  KakaoPay: '/images/payment/KakaoPay.png',
  'LINE Pay': '/images/payment/LinePay.png',
  'Naver Pay': '/images/payment/NaverPay.png',
  Payco: '/images/payment/Payco.png',
  'Toss Pay': '/images/payment/Toss_Pay.png',
  MoMo: '/images/payment/MoMo.png',
  PayPay: '/images/payment/PayPay.png',
  Merpay: '/images/payment/MerPay.png',
  FamiPay: '/images/payment/FamiPay.png',
  Atone: '/images/payment/Atone.png',
  'Rakuten Pay': '/images/payment/Rakuten_Pay.png',
  Konbini: '/images/payment/Konbini.png',
  Paidy: '/images/payment/Paidy.png',
  PromptPay: '/images/payment/PromptPay.png',
  PayNow: '/images/payment/PayNow.png',
  "Touch'n Go": '/images/payment/TouchNGo.png',
  FPX: '/images/payment/FPX.png',
  UPI: '/images/payment/UPI.png',

  // Europe
  Klarna: '/images/payment/Klarna.png',
  Afterpay: '/images/payment/Afterpay.png',
  iDEAL: '/images/payment/iDEAL___Wero.png',
  Wero: '/images/payment/Wero.png',
  SEPA: '/images/payment/SEPA.png',
  BLIK: '/images/payment/BLIK.png',
  Przelewy24: '/images/payment/Przelewy24.png',
  EPS: '/images/payment/EPS.png',
  KBC: '/images/payment/KBC.png',
  Twint: '/images/payment/Twint.png',
  Swish: '/images/payment/Swish.png',
  Satispay: '/images/payment/Satispay.png',
  PostFinance: '/images/payment/PostFinance.png',
  Multibanco: '/images/payment/Multibanco.png',
  'MB WAY': '/images/payment/MBWay.png',
  Nexi: '/images/payment/Nexi.png',
  Postepay: '/images/payment/Postepay.png',
  Payconiq: '/images/payment/Payconiq.png',
  Sofinco: '/images/payment/Sofinco.png',
  Oney: '/images/payment/Oney.png',
  Trustly: '/images/payment/TrueLayer.png',

  // Americas
  Pix: '/images/payment/Pix.png',
  Boleto: '/images/payment/Boleto.png',
  OXXO: '/images/payment/OXXO.png',
  SPEI: '/images/payment/SPEI.png',
  PicPay: '/images/payment/PicPay.png',

  // BNPL
  Affirm: '/images/payment/Affirm.png',
  Sezzle: '/images/payment/Sezzle.png',
  Zip: '/images/payment/Zip.png',
  Walley: '/images/payment/Walley.png',
  Tabby: '/images/payment/Tabby.png',
  Younited: '/images/payment/Younited.png',
  Sunbit: '/images/payment/Sunbit.png',
  'Seqúra': '/images/payment/Sequra.png',
  Scalapay: '/images/payment/Scalapay.png',
  Aplazame: '/images/payment/Aplazame.png',
  Mondu: '/images/payment/Mondu.png',
  Kriya: '/images/payment/Kriya.png',
  Billie: '/images/payment/Billie.png',
  Divido: '/images/payment/Divido.png',
  IwocaPay: '/images/payment/IwocaPay.png',
  PlanPay: '/images/payment/PlanPay.png',
  PayPo: '/images/payment/PayPo.png',
  CapChase: '/images/payment/CapChase.png',
  AlmaPay: '/images/payment/AlmaPay.png',

  // Misc / regional
  Fawry: '/images/payment/Fawry.png',
  AllPay: '/images/payment/AllPay.png',
  Stablecoins: '/images/payment/Stablecoins.png',
  WebMoney: '/images/payment/WebMoney.png',
  PaySafeCard: '/images/payment/PaySafeCard.png',
  Fonix: '/images/payment/Fonix.png',
  BitCash: '/images/payment/BitCash.png',
  'Net Cash': '/images/payment/Net_Cash.png',
  Dapp: '/images/payment/Dapp.png',
  Azupay: '/images/payment/Azupay.png',
  Payto: '/images/payment/Payto.png',
  Benefit: '/images/payment/Benefit.png',
};

function PaymentLogo({ name }: { name: string }) {
  // Custom inline SVG takes priority over PNG file — used for brands whose
  // shipped PNG was a placeholder.
  const node = LOGO_NODE[name];
  if (node) return <span className="payment-logo-svg">{node}</span>;

  const file = LOGO_FILE[name];
  if (file) {
    return (
      <Image
        src={file}
        alt={name}
        width={120}
        height={48}
        sizes="120px"
        className="payment-logo-img"
      />
    );
  }
  // Fallback: text avatar for any unmapped brand name
  return <TextLogo bg="#535C91" fg="white" text={name.slice(0, 3).toUpperCase()} fontSize={6} />;
}

// Public API consumed by page.tsx — proxy returns a ReactNode per name.
export const PAYMENT_ICONS: Record<string, ReactNode> = new Proxy(
  {} as Record<string, ReactNode>,
  {
    get: (_, name: string) => <PaymentLogo name={name} />,
    has: () => true,
  },
);

// Curated display order for the homepage "Global Payment Matrix" section.
// Cards first, then global wallets, Asia, Europe, Americas, BNPL.
export const PAYMENT_METHODS_FLAT: string[] = [
  // Cards
  'Visa', 'Mastercard', 'American Express', 'Discover', 'JCB', 'UnionPay',
  // Global wallets
  'PayPal', 'Apple Pay', 'Google Pay', 'Samsung Pay', 'Amazon Pay', 'Cash App Pay', 'Revolut Pay',
  // Asia
  'Alipay', 'WeChat Pay', 'GrabPay', 'GCash', 'KakaoPay', 'LINE Pay', 'PayPay', 'MoMo',
  'Toss Pay', 'PromptPay', "Touch'n Go", 'UPI', 'FPX',
  // Europe
  'Klarna', 'Afterpay', 'iDEAL', 'SEPA', 'BLIK', 'Przelewy24', 'Twint', 'Swish',
  'MobilePay', 'Bancontact', 'MB WAY', 'Multibanco',
  // Americas
  'Pix', 'Boleto', 'OXXO', 'SPEI', 'Interac',
  // BNPL
  'Affirm', 'Sezzle', 'Zip', 'Tabby', 'Scalapay',
];

function TextLogo({
  bg,
  fg,
  text,
  fontSize,
  fontWeight = 700,
}: {
  bg: string;
  fg: string;
  text: string;
  fontSize: number;
  fontWeight?: number;
}) {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24">
      <rect width="40" height="24" rx="4" fill={bg} />
      <text x="20" y="15" textAnchor="middle" fill={fg} fontSize={fontSize} fontWeight={fontWeight}>
        {text}
      </text>
    </svg>
  );
}
