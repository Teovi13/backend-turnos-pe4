import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ValidationError } from '../utils/errors.js';
import { readJsonArray, writeJsonArray } from '../utils/jsonFile.js';

const DEFAULT_PATH = fileURLToPath(new URL('../data/bookings.json', import.meta.url));

const REQUIRED_FIELDS = ['clientName', 'clientEmail', 'date', 'time'];
const STATUSES = ['pending', 'confirmed', 'cancelled'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const isMissing = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

const isValidDate = (value) => {
  if (!DATE_REGEX.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

const validateBooking = (data) => {
  const missing = REQUIRED_FIELDS.filter((field) => isMissing(data[field]));

  if (missing.length > 0) {
    throw new ValidationError(`Reserva incompleta. Faltan los campos: ${missing.join(', ')}`);
  }

  const errors = [];

  if (typeof data.clientName !== 'string') errors.push('clientName debe ser un texto');
  if (typeof data.clientEmail !== 'string' || !EMAIL_REGEX.test(data.clientEmail.trim())) {
    errors.push('clientEmail debe ser un email válido');
  }
  if (typeof data.date !== 'string' || !isValidDate(data.date)) {
    errors.push('date debe tener el formato YYYY-MM-DD y ser una fecha real');
  }
  if (typeof data.time !== 'string' || !TIME_REGEX.test(data.time)) {
    errors.push('time debe tener el formato HH:MM (24 horas)');
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    errors.push(`status solo acepta: ${STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }
};

export default class BookingManager {
  constructor(filePath = DEFAULT_PATH) {
    this.filePath = filePath;
  }

  async createBooking(bookingData) {
    const data = bookingData ?? {};
    validateBooking(data);

    const newBooking = {
      id: randomUUID(),
      clientName: data.clientName.trim(),
      clientEmail: data.clientEmail.trim().toLowerCase(),
      date: data.date,
      time: data.time,
      status: data.status ?? 'pending',
      services: [],
    };

    const bookings = await readJsonArray(this.filePath);
    bookings.push(newBooking);
    await writeJsonArray(this.filePath, bookings);

    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await readJsonArray(this.filePath);
    return bookings.find((booking) => booking.id === id) ?? null;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await readJsonArray(this.filePath);
    const booking = bookings.find((item) => item.id === bookingId);

    if (!booking) return null;

    const item = booking.services.find((entry) => entry.service === serviceId);

    if (item) {
      item.quantity += 1;
    } else {
      booking.services.push({ service: serviceId, quantity: 1 });
    }

    await writeJsonArray(this.filePath, bookings);

    return booking;
  }
}
