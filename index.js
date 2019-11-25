const BASE_URL = '/v1/holidays/';
const { createInstance } = require('@salling-group/auth');
const { version } = require('./package');

/**
 * @typedef {Object} Holiday A holiday entry.
 * @property {string} date The date of the holiday.
 * @property {string} name The name of the holiday.
 * @property {boolean} nationalHoliday Whether it is a national holiday.
 */

/**
 * Converts a date object to a string, and returns just the string if a string is given.
 *
 * @param {Date|string} date The Date object or string.
 * @returns {String} The corresponding date string.
 */
function toDateFormat(date) {
  if (typeof date === 'string') {
    return date;
  }
  return [
    date.getFullYear(),
    (date.getMonth() + 1)
      .toString()
      .padStart(2, '0'),
    date.getDate()
      .toString()
      .padStart(2, '0'),
  ].join('-');
}

/**
 * Wraps the Salling Group Holidays API.
 * Dates should either be a Date object or a string in the format "YYYY-MM-DD".
 */
class HolidaysAPI {
  /**
   * Initialize a new Holidays API wrapper.
   *
   * @param {Object} options Options for the instance.
   * @param {Object} options.auth Credentials for the instance.
   * @param {String} options.auth.type The type of authentication.
   * @param {String} [options.auth.issuer] The issuer used for JWT.
   * @param {String} [options.auth.secret] The secret used for JWT.
   * @param {String} [options.auth.token] The token used for Bearer.
   * @param {String} [options.applicationName]
   * The name of the application which will use this instance.
   * This will be sent in the user-agent header.
   */
  constructor(options) {
    this.instance = createInstance({
      ...options,
      'baseName': `Holidays SDK v${version}`,
    });
  }

  /**
   * Check if the given date is a holiday.
   *
   * @param {Date|string} date Either a Date or a date in the format "YYYY-MM-DD
   * @returns {Promise<Boolean>} Whether the date is a holiday.
   */
  async isHoliday(date) {
    const response = await this.instance.get(`${BASE_URL}is-holiday`, { 'params': { 'date': toDateFormat(date) } });
    return response.data;
  }

  /**
   * Get the holidays in-between two dates.
   * @param {Date|string} startDate
   * @param endDate
   * @returns {Promise<[Holiday]>} Holidays between the two dates.
   */
  async holidaysInBetween(startDate, endDate) {
    const response = await this.instance.get(BASE_URL, {
      'params': {
        'endDate': toDateFormat(endDate),
        'startDate': toDateFormat(startDate),
      },
    });
    return response.data;
  }

  /**
   * Get all holidays between today and a given date.
   *
   * @param {Date|string} date The end date.
   * @returns {Promise<[Holiday]>} Holidays between today and the given end date.
   */
  async holidaysUntil(date) {
    const response = await this.instance.get(BASE_URL, {
      'params': {
        'endDate': toDateFormat(date),
      },
    });
    return response.data;
  }

  /**
   * Get all holidays within the upcoming year from today.
   *
   * @returns {Promise<[Holiday]>} Holidays in the upcoming year from today.
   */
  async holidaysWithinUpcomingYear() {
    const response = await this.instance.get(BASE_URL);
    return response.data;
  }

  /**
   * Get the next upcoming holiday.
   *
   * @returns {Promise<Holiday>} The next upcoming holiday.
   */
  async nextHoliday() {
    return (await this.holidaysWithinUpcomingYear())[0];
  }
}

module.exports = HolidaysAPI;
