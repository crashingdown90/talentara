import { COMMISSION_RATES } from "./constants";

export interface BookingPrices {
  /** Fee dasar talent (dailyRate x totalDays) */
  talentFee: number;
  /** Komisi yang dipotong dari talent (10% dari talentFee) */
  talentCommission: number;
  /** Komisi yang dibebankan ke client (5% dari talentFee) */
  clientCommission: number;
  /** Total pendapatan platform (talentCommission + clientCommission) */
  platformRevenue: number;
  /** Total yang harus dibayar client (talentFee + clientCommission) */
  totalAmount: number;
  /** Total yang diterima talent (talentFee - talentCommission) */
  talentPayout: number;
}

/**
 * Calculate booking prices including commissions
 *
 * @param dailyRate - Daily rate talent (Rupiah)
 * @param totalDays - Jumlah hari kerja
 * @returns BookingPrices object
 *
 * @example
 * calculateBookingPrices(400000, 2)
 * // talentFee: 800.000
 * // talentCommission: 80.000 (10%)
 * // clientCommission: 40.000 (5%)
 * // platformRevenue: 120.000
 * // totalAmount: 840.000 (client bayar)
 * // talentPayout: 720.000 (talent terima)
 */
export function calculateBookingPrices(
  dailyRate: number,
  totalDays: number
): BookingPrices {
  if (dailyRate < 0 || totalDays < 1) {
    throw new Error(
      `Invalid booking parameters: dailyRate=${dailyRate}, totalDays=${totalDays}. ` +
      "dailyRate must be >= 0 and totalDays must be >= 1."
    );
  }

  const talentFee = dailyRate * totalDays;
  const talentCommission = Math.round(talentFee * COMMISSION_RATES.TALENT);
  const clientCommission = Math.round(talentFee * COMMISSION_RATES.CLIENT);
  const platformRevenue = talentCommission + clientCommission;
  const totalAmount = talentFee + clientCommission;
  const talentPayout = talentFee - talentCommission;

  return {
    talentFee,
    talentCommission,
    clientCommission,
    platformRevenue,
    totalAmount,
    talentPayout,
  };
}

/**
 * Calculate total days between two dates (inclusive)
 */
export function calculateTotalDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Inclusive
}
