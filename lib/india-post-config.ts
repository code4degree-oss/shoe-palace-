// ─── India Post Bulk Booking Excel Configuration ───────────────────
// These are the FIXED values that go into every row of the India Post Excel export.
// Only receiver details change per order.

export const INDIA_POST_CONFIG = {
  // ─── Sender Details (Same for all shipments) ─────────────────
  sender: {
    name: 'Shoe Place Herbal Products',
    mobileNo: '9270201252',
    city: 'Narayangaon',
    stateUT: 'Narayangaon',
    pincode: '410504',
    addressLine1: 'Narayangaon',
    addressLine2: 'Narayangaon',
    addressLine3: '',
    emailId: '',
    altContact: '',
    kyc: '',
    tax: '',
    companyName: '',
  },

  // ─── Parcel Dimensions (Same for all shipments) ──────────────
  dimensions: {
    length: 14,
    breadthDiameter: 9,
    height: 1,
  },

  // ─── Fixed Fields ────────────────────────────────────────────
  barcodeNo: '',               // Empty — India Post generates this
  reg: false,                  // FALSE for all
  otp: false,                  // FALSE for all
  ack: false,                  // FALSE for all
  shapeOfArticle: 'NROL',     // Non-Rolled
  deliveryInstruction: 'ND',   // Normal Delivery
  deliverySlot: '02:00-04:00',
  instructionRTS: 'RTS',       // Return to Sender
  altAddressFlag: false,       // FALSE for all
  priorityFlag: '',            // Empty

  // ─── Empty Fields (Not used) ─────────────────────────────────
  prepaymentCode: '',
  valueOfPrepayment: '',
  codrCod: '',
  valueForCodrCod: '',
  insuranceType: '',
  valueOfInsurance: '',
  bulkReference: '',
};

// ─── Excel Column Headers (in exact order for India Post template) ──
export const INDIA_POST_COLUMNS = [
  'SERIAL NUMBER',
  'BARCODE NO',
  'PHYSICAL WEIGHT',
  'REG',
  'P',
  'RECEIVER CITY',
  'RECEIVER PINCODE',
  'RECEIVER NAME',
  'RECEIVER ADD LINE 1',
  'RECEIVER ADD LINE 2',
  'RECEIVER ADD LINE 3',
  'ACK',
  'SENDER MOBILE NO',
  'RECEIVER MOBILE NO',
  'PREPAYMENT CODE',
  'VALUE OF PREPAYMENT',
  'CODR/COD',
  'VALUE FOR CODR/COD',
  'INSURANCE TYPE',
  'VALUE OF INSURANCE',
  'SHAPE OF ARTICLE',
  'LENGTH',
  'BREADTH/DIAMETER',
  'HEIGHT',
  'PRIORITY FLAG',
  'DELIVERY INSTRUCTION',
  'DELIVERY SLOT',
  'INSTRUCTION RTS',
  'SENDER NAME',
  'SENDER COMPANY NAME',
  'SENDER CITY',
  'SENDER STATE/UT',
  'SENDER PINCODE',
  'SENDER EMAILID',
  'SENDER ALT CONTACT',
  'SENDER KYC',
  'SENDER TAX',
  'RECEIVER COMPANY NAME',
  'RECEIVER STATE',
  'RECEIVER EMAILID',
  'RECEIVER ALT CONTACT',
  'RECEIVER KYC',
  'RECEIVER TAX REF',
  'ALT ADDRESS FLAG',
  'BULK REFERENCE',
  'SENDER ADD LINE 1',
  'SENDER ADD LINE 2',
  'SENDER ADD LINE 3',
];
