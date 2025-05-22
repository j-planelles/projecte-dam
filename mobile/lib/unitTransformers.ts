/**
 * Converteix quilograms a lliures.
 * @param {number} kg - El pes en quilograms. Ha de ser un valor numèric.
 * @returns {number} El pes equivalent en lliures.
 * @example
 * kgToLbs(10) // Retorna aproximadament 22.0462
 */
export function kgToLbs(kg: number): number {
  // Factor de conversió de quilograms a lliures
  return kg * 2.20462;
}

/**
 * Converteix lliures a quilograms.
 * @param {number} lbs - El pes en lliures. Ha de ser un valor numèric.
 * @returns {number} El pes equivalent en quilograms.
 * @example
 * lbsToKg(22.0462) // Retorna aproximadament 10
 */
export function lbsToKg(lbs: number): number {
  // Factor de conversió de lliures a quilograms
  return lbs / 2.20462;
}

/**
 * Converteix milles a quilòmetres.
 * @param {number} miles - La distància en milles. Ha de ser un valor numèric.
 * @returns {number} La distància equivalent en quilòmetres.
 * @example
 * milesToKm(10) // Retorna aproximadament 16.0934
 */
export function milesToKm(miles: number): number {
  // Factor de conversió de milles a quilòmetres
  return miles * 1.60934;
}

/**
 * Converteix quilòmetres a milles.
 * @param {number} km - La distància en quilòmetres. Ha de ser un valor numèric.
 * @returns {number} La distància equivalent en milles.
 * @example
 * kmToMiles(16.0934) // Retorna aproximadament 10
 */
export function kmToMiles(km: number): number {
  // Factor de conversió de quilòmetres a milles
  return km / 1.60934;
}