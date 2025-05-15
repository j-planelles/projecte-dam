/**
 * Converts kilograms to pounds
 * @param {number} kg - Weight in kilograms
 * @return {number} Weight in pounds
 */
export function kgToLbs(kg: number) {
  return kg * 2.20462;
}

/**
 * Converts pounds to kilograms
 * @param {number} lbs - Weight in pounds
 * @return {number} Weight in kilograms
 */
export function lbsToKg(lbs: number) {
  return lbs / 2.20462;
}

/**
 * Converts miles to kilometers
 * @param {number} miles - Distance in miles
 * @return {number} Distance in kilometers
 */
export function milesToKm(miles: number) {
  return miles * 1.60934;
}

/**
 * Converts kilometers to miles
 * @param {number} km - Distance in kilometers
 * @return {number} Distance in miles
 */
export function kmToMiles(km: number) {
  return km / 1.60934;
}
