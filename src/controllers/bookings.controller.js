import BookingManager from '../managers/BookingManager.js';
import ServiceManager from '../managers/ServiceManager.js';

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

const bookingNotFound = (res, bid) =>
  res.status(404).json({ status: 'error', error: `No existe una reserva con id ${bid}` });

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingManager.createBooking(req.body);
    return res.status(201).json({ status: 'success', payload: booking });
  } catch (error) {
    return next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(bid);
    if (!booking) return bookingNotFound(res, bid);
    return res.status(200).json({ status: 'success', payload: booking });
  } catch (error) {
    return next(error);
  }
};

export const addServiceToBooking = async (req, res, next) => {
  try {
    const { bid, sid } = req.params;

    const booking = await bookingManager.getBookingById(bid);
    if (!booking) return bookingNotFound(res, bid);

    const service = await serviceManager.getServiceById(sid);
    if (!service) {
      return res.status(404).json({ status: 'error', error: `No existe un servicio con id ${sid}` });
    }
    if (!service.available) {
      return res.status(400).json({ status: 'error', error: `El servicio ${sid} no está disponible para reservar` });
    }

    const updated = await bookingManager.addServiceToBooking(bid, sid);
    return res.status(200).json({ status: 'success', payload: updated });
  } catch (error) {
    return next(error);
  }
};
