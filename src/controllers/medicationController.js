import { MedicationModel } from "../models/medicationModel.js";

export const MedicationController = {
  async getAll(req, res) {
    try {
      const meds = await MedicationModel.getAll();
      res.json(meds);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const med = await MedicationModel.getById(req.params.id);
      res.json(med);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { price, quantity } = req.body;

      if (price < 0 || quantity < 0) {
        return res.status(400).json({ error: "Price and quantity cannot be negative" });
      }

      const med = await MedicationModel.create(req.body);
      res.status(201).json(med);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { price, quantity } = req.body;

      if (price !== undefined && price < 0) {
        return res.status(400).json({ error: "Price cannot be negative" });
      }

      if (quantity !== undefined && quantity < 0) {
        return res.status(400).json({ error: "Quantity cannot be negative" });
      }

      const med = await MedicationModel.update(req.params.id, req.body);
      res.json(med);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await MedicationModel.remove(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
