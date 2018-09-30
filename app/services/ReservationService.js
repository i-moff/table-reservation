const db = require('./../../db');
const ApiError = require('./../utils/ApiError');
const httpStatus = require('http-status');

const GUESTS_COUNT_MIN = 1;
const GUESTS_COUNT_MAX = 10;
const DURATION_MIN = 0.5;
const DURATION_MAX = 6;

const DATETIME_PATTERN = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
const TABLE_RESERVATION = 'reservations';

class ReservationService {
  /**
   * @param {Number} id
   */
  static async getItem(id) {
    // NOTICE: method first() throws exception if no items
    const queryResult = (await db
      .select("reservations.*", "tables.*", "reservations.id as id")
      .from(TABLE_RESERVATION)
      .leftJoin("tables", "tables.id", "reservations.table_id")
      .where({ "reservations.id": id }))[0];

    if (!queryResult) {
      return null;
    }

    return (({ id, guests, start, end, ...tableData }) => ({
      id,
      guests,
      start,
      end,
      table: {
        ...tableData
      }
    }))(queryResult);
  }

  /**
   * @param {Object} data
   */
  static async create(data) {
    ReservationService.validateData(data);

    const reservationData = ReservationService.prepareReservationData(data);
    const freeTable = await ReservationService.getFreeTable(
      reservationData.start,
      reservationData.end,
      reservationData.guests
    );
    if (!freeTable) {
      throw new ApiError('Sorry, we don\'t have free tables.', httpStatus.NOT_FOUND);
    }

    return db(TABLE_RESERVATION).returning('id').insert({ ...reservationData, table_id: freeTable.id });
  }

  static async update(id, data) {
    ReservationService.validateData(data);
    const reservationData = ReservationService.prepareReservationData(data);

    // TODO: add possibility to check for free tables with ignore current reservation
    const freeTable = await ReservationService.getFreeTable(
      reservationData.start,
      reservationData.end,
      reservationData.guests
    );
    if (!freeTable) {
      throw new ApiError('Sorry, we don\'t have free tables.', httpStatus.CONFLICT);
    }

    return db(TABLE_RESERVATION).where({ id }).update(reservationData);
  }

  /**
   * @param {Number} id
   */
  static remove(id) {
    return db(TABLE_RESERVATION).where({ id }).del();
  }

  /**
   * @param data
   */
  static validateData(data) {
    if (!data.guests || data.guests < GUESTS_COUNT_MIN || data.guests > GUESTS_COUNT_MAX) {
      throw new ApiError(
        `Invalid count of guests (min - ${GUESTS_COUNT_MIN}), max - ${GUESTS_COUNT_MAX}`,
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (!data.duration || data.duration < DURATION_MIN || data.duration > DURATION_MAX) {
      throw new ApiError(
        `Invalid duration (min - ${DURATION_MIN}, max - ${DURATION_MAX})`,
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (!data.time || !DATETIME_PATTERN.test(data.time)) {
      throw new ApiError(
        'Invalid time format. Please use ISO8601 format (e.g: 2018-09-17T18:00:00Z)',
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  /**
   * @param data
   * @returns {{start: Date, end: Date, guests: *}}
   */
  static prepareReservationData(data) {
    const dateFrom = new Date(data.time);
    const dateEnd = new Date(dateFrom.setTime(dateFrom.getTime() + (data.duration * 60 * 60 * 1000)));

    return {
      start: dateFrom,
      end: dateEnd,
      guests: data.guests
    }
  }

  /**
   * @param {Date} from
   * @param {Date} to
   * @param count
   * @returns {Promise<void>}
   */
  static async getFreeTable(from, to, count) {
    const subQuery = db(TABLE_RESERVATION)
      .where('start', '<=', from).andWhere('end', '>=', from)
      .orWhere('start', '<=', to).andWhere('end', '>=', to)
      .select('table_id');

    return db('tables')
      .where('id', 'NOT IN', subQuery)
      .andWhere('capacity', '>=', count)
      .orderBy('capacity', 'asc')
      .first();
  }
}

module.exports = ReservationService;
