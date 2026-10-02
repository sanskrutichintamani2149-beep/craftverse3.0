import assert from 'node:assert/strict';
import {
  calculateSIP,
  calculateEMI,
  calculateCTCToTakeHome,
  maskSensitiveFinancialIdentifiers,
} from './calculators';

function runCalculatorUnitTests() {
  console.log('=== Running DhanaDrishti Deterministic Calculator Unit Tests ===');

  // 1. Hand-verified SIP test: Rs 5,000/month at 12% for 10 years -> ~Rs 11.6 Lakh (Rs 11,61,695)
  const sipNormal = calculateSIP(5000, 12, 10);
  assert.equal(sipNormal.valid, true);
  assert.equal(sipNormal.investedAmount, 600000);
  assert.equal(sipNormal.futureValue, 1161695);
  assert.equal(sipNormal.estimatedReturns, 561695);
  console.log(
    `[PASS] SIP Normal (₹5,000/mo, 12%, 10 yrs): Invested = ₹${sipNormal.investedAmount.toLocaleString('en-IN')}, FV = ₹${sipNormal.futureValue.toLocaleString('en-IN')} (~₹11.62 Lakh)`
  );

  // 2. SIP boundary & decimal tests
  const sipZeroReturn = calculateSIP(5000, 0, 5);
  assert.equal(sipZeroReturn.valid, true);
  assert.equal(sipZeroReturn.futureValue, 300000);
  assert.equal(sipZeroReturn.estimatedReturns, 0);

  const sipDecimal = calculateSIP(7500.5, 11.5, 7.5);
  assert.equal(sipDecimal.valid, true);
  assert.ok(sipDecimal.futureValue > sipDecimal.investedAmount);

  const sipNegative = calculateSIP(-1000, 12, 10);
  assert.equal(sipNegative.valid, false);
  const sipZeroPrincipal = calculateSIP(0, 12, 10);
  assert.equal(sipZeroPrincipal.valid, false);
  const sipHuge = calculateSIP(500000000, 12, 10);
  assert.equal(sipHuge.valid, false);
  const sipNaN = calculateSIP(NaN, 12, 10);
  assert.equal(sipNaN.valid, false);
  console.log('[PASS] SIP Edge Cases (0% rate, decimals, negative, zero, huge, NaN)');

  // 3. Hand-verified EMI test: Rs 10,00,000 at 10% for 5 years (60 months) -> ~Rs 21,247
  const emiNormal = calculateEMI(1000000, 10, 60);
  assert.equal(emiNormal.valid, true);
  assert.equal(emiNormal.monthlyEmi, 21247);
  assert.equal(emiNormal.totalPayment, 1274823);
  assert.equal(emiNormal.totalInterest, 274823);
  console.log(
    `[PASS] EMI Normal (₹10,00,000, 10%, 5 yrs): Monthly EMI = ₹${emiNormal.monthlyEmi.toLocaleString('en-IN')}, Total Interest = ₹${emiNormal.totalInterest.toLocaleString('en-IN')}`
  );

  // 4. EMI boundary & decimal tests
  const emiZeroRate = calculateEMI(120000, 0, 12);
  assert.equal(emiZeroRate.valid, true);
  assert.equal(emiZeroRate.monthlyEmi, 10000);
  assert.equal(emiZeroRate.totalInterest, 0);

  const emiDecimal = calculateEMI(2550000, 8.75, 180);
  assert.equal(emiDecimal.valid, true);
  assert.ok(emiDecimal.monthlyEmi > 0);

  const emiNegative = calculateEMI(-500000, 10, 60);
  assert.equal(emiNegative.valid, false);
  const emiZeroMonths = calculateEMI(500000, 10, 0);
  assert.equal(emiZeroMonths.valid, false);
  const emiInfinity = calculateEMI(Infinity, 10, 60);
  assert.equal(emiInfinity.valid, false);
  console.log('[PASS] EMI Edge Cases (0% rate, decimals, negative, zero tenure, Infinity)');

  // 5. CTC to Take-Home tests
  const ctcRebate = calculateCTCToTakeHome({ annualCtc: 1200000, regime: 'new' });
  assert.equal(ctcRebate.valid, true);
  assert.equal(ctcRebate.estimatedAnnualTax, 0); // Under ₹12.75L gross in New Regime -> 0 tax via 87A rebate
  console.log(
    `[PASS] CTC ₹12,00,000 (New Regime): Tax = ₹${ctcRebate.estimatedAnnualTax}, Monthly Take-Home = ₹${ctcRebate.monthlyTakeHome.toLocaleString('en-IN')}`
  );

  const ctcHigher = calculateCTCToTakeHome({
    annualCtc: 2000000,
    regime: 'new',
    deduction80C: 150000,
    hraAndOtherDeductions: 100000,
  });
  assert.equal(ctcHigher.valid, true);
  assert.ok(ctcHigher.estimatedAnnualTax > 0);
  assert.ok(ctcHigher.monthlyTakeHome > 0 && ctcHigher.monthlyTakeHome < 2000000 / 12);
  console.log(
    `[PASS] CTC ₹20,00,000 (New Regime): Tax = ₹${ctcHigher.estimatedAnnualTax.toLocaleString('en-IN')}, Monthly Take-Home = ₹${ctcHigher.monthlyTakeHome.toLocaleString('en-IN')}`
  );

  const ctcInvalid = calculateCTCToTakeHome({ annualCtc: -100 });
  assert.equal(ctcInvalid.valid, false);

  // 6. Privacy Masking test
  const maskedSample = maskSensitiveFinancialIdentifiers(
    'PAN: ABCDE1234F, Aadhaar: 1234 5678 9012, Card: 4111-2222-3333-4444'
  );
  assert.ok(maskedSample.includes('XXXXXX234F'));
  assert.ok(maskedSample.includes('XXXXXXXX9012'));
  assert.ok(maskedSample.includes('XXXXXXXXXXXX4444'));
  console.log(`[PASS] Privacy Identifier Masking: "${maskedSample}"`);

  console.log('=== ALL CALCULATOR UNIT TESTS PASSED ===');
}

runCalculatorUnitTests();
