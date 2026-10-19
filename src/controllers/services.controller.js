import ServiceManager from '../managers/ServiceManager.js';
import { ValidationError } from '../utils/errors.js';

const serviceManager = new ServiceManager();

const notFound = (res, sid) =>
  res.status(404).json({ status: 'error', error: `No existe un servicio con id ${sid}` });

const parseFilters = (query) => {
  const { category, available } = query;
  const filters = {};

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      throw new ValidationError('El filtro category debe ser un texto no vacío');
    }
    filters.category = category.trim();
  }

  if (available !== undefined) {
    if (available !== 'true' && available !== 'false') {
      throw new ValidationError('El filtro available solo acepta los valores true o false');
    }
    filters.available = available === 'true';
  }

  return filters;
};

export const getServices = async (req, res, next) => {
  try {
    const filters = parseFilters(req.query);
    const services = await serviceManager.getServices(filters);
    return res.status(200).json({ status: 'success', payload: services });
  } catch (error) {
    return next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(sid);
    if (!service) return notFound(res, sid);
    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await serviceManager.addService(req.body);
    return res.status(201).json({ status: 'success', payload: service });
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.updateService(sid, req.body);
    if (!service) return notFound(res, sid);
    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.deleteService(sid);
    if (!service) return notFound(res, sid);
    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return next(error);
  }
};
