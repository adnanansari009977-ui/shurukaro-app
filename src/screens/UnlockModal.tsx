import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

const UPI_ID = '9324836783@ybl';
const UPI_PAY_URL = `upi://pay?pa=${UPI_ID}&pn=ShuruKaro&am=199&cu=INR`;

const PRO_BENEFITS = [
  'Day 8 se Day 30 tak ka poora Customer Growth Roadmap',
  'Saare High-Converting WhatsApp & Follow-up Pitches',
  '1-Tap Earning Scenarios (Slow Start, Steady, Full Rush)',
  'Saare Doubt Solver Pricing & Confidence Secrets',
  'Offline 30-Day Checklist Backup (.txt Download)',
];

export const UnlockModal: React.FC = () => {
  const {
    unlockModalOpen,
    unlockReason,
    closeUnlockModal,
    unlockPro,
    showToast,
  } = useApp();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrError, setQrError] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [utrInput, setUtrInput] = useState<string>('');
  const [utrError, setUtrError] = useState<string | null>(null);

  useEffect(() => {
    if (!unlockModalOpen) return;
    let cancelled = false;
    setUtrInput('');
    setUtrError(null);
    setCopiedUpi(false);

    QRCode.toDataURL(UPI_PAY_URL, {
      width: 220,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (!cancelled) {
          setQrDataUrl(url);
          setQrError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [unlockModalOpen]);

  if (!unlockModalOpen) return null;

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      showToast('UPI ID copy ho gaya: ' + UPI_ID);
      window.setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      showToast('Copy karne ke liye UPI ID select karein.');
    }
  };

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric digits, max 12 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    setUtrInput(digitsOnly);
    if (utrError) setUtrError(null);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = utrInput.trim();

    if (!cleaned) {
      setUtrError(
        'Kripya payment karne ke baad apna 12-digit UPI Transaction ID / UTR Number daalein.'
      );
      return;
    }

    if (!/^\d{12}$/.test(cleaned)) {
      setUtrError(
        `Galat UTR Number (${cleaned.length}/12 digits). Kripya poore 12 digits ka UPI Reference / UTR number daalein.`
      );
      return;
    }

    const ok = unlockPro(cleaned);
    if (!ok) {
      setUtrError('UTR verify nahi ho saka. Kripya sahi 12-digit number check karein.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-payment-modal-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl border border-gray-200 max-h-[92vh] overflow-y-auto">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-3" />

        <div className="p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#0F766E]">
                UPI Payment · ₹199 One-Time Lifetime Access
              </p>
              <h2
                id="upi-payment-modal-title"
                className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5"
              >
                Pro Starter Pack Unlock Karein
              </h2>
            </div>
            <button
              type="button"
              onClick={closeUnlockModal}
              aria-label="Modal band karein"
              className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 rounded-xl flex items-center justify-center text-[#4B5563] hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {unlockReason && (
            <div className="rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-3 text-xs sm:text-sm font-medium text-[#9A3412] flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-[#EA580C]" />
              <span>{unlockReason}</span>
            </div>
          )}

          {/* Included Benefits Compact List */}
          <div className="rounded-xl bg-[#F9FAFB] border border-gray-200 p-3.5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-bold text-[#0F766E]">
                ₹199 mein aapko milega:
              </span>
              <span className="text-sm font-extrabold font-mono-num text-[#111827]">
                ₹199
              </span>
            </div>
            <ul className="space-y-1.5">
              {PRO_BENEFITS.map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-[#111827]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 1: QR Code + UPI ID + Direct UPI Pay Button */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
            <div className="text-xs font-bold text-[#111827]">
              Step 1: QR Scan karein ya UPI App se ₹199 pay karein
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Auto-generated UPI QR Code */}
              <div className="w-40 h-40 rounded-xl border border-gray-200 bg-white p-2 flex items-center justify-center shrink-0">
                {qrDataUrl && !qrError ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI QR Code for ${UPI_ID}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-[#4B5563] p-2">
                    <QrCode className="w-10 h-10 text-[#0F766E] mb-1" />
                    <span className="text-[11px] font-medium">
                      UPI ID use karein
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-3">
                {/* UPI ID with Copy button */}
                <div className="rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] p-3">
                  <div className="text-[11px] font-semibold text-[#0F766E]">
                    Merchant UPI ID
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="font-mono-num text-sm font-bold text-[#111827] select-all truncate">
                      {UPI_ID}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-[#99F6E4] text-xs font-bold text-[#0F766E] hover:bg-[#CCFBF1] inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span className="text-[#16A34A]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct UPI Deep Link Button */}
                <a
                  href={UPI_PAY_URL}
                  className="min-h-[48px] w-full px-4 py-3 rounded-xl bg-[#0F766E] hover:bg-[#0D5E58] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Pay ₹199 via UPI App</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
                <p className="text-[11px] text-[#4B5563] text-center sm:text-left">
                  GPay, PhonePe, Paytm ya kisi bhi UPI app se pay karein.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: 12-Digit UTR Verification Form */}
          <form
            onSubmit={handleVerifySubmit}
            noValidate
            className="rounded-2xl border border-gray-200 bg-[#F9FAFB] p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="utr-number-input"
                className="text-xs font-bold text-[#111827]"
              >
                Step 2: 12-Digit UPI Transaction ID / UTR Number daalein
              </label>
              <span className="text-xs font-mono-num font-semibold text-[#4B5563]">
                {utrInput.length}/12
              </span>
            </div>

            <input
              id="utr-number-input"
              type="text"
              inputMode="numeric"
              pattern="\d{12}"
              maxLength={12}
              value={utrInput}
              onChange={handleUtrChange}
              placeholder="Jaise: 412345678901"
              aria-invalid={Boolean(utrError)}
              aria-describedby={utrError ? 'utr-error-msg' : undefined}
              className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-white border font-mono-num text-base tracking-wider text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                utrError
                  ? 'border-[#DC2626] focus:ring-[#DC2626]/25'
                  : 'border-gray-300 focus:border-[#0F766E] focus:ring-[#0F766E]/25'
              }`}
            />

            {utrError && (
              <div
                id="utr-error-msg"
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-2.5 text-xs font-medium text-[#DC2626]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{utrError}</span>
              </div>
            )}

            <PrimaryButton type="submit" variant="accent" fullWidth>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Unlock Pro</span>
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
};
