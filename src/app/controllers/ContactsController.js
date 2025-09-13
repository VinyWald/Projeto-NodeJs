import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

import Customer from "../models/Customer";
import Contacts from "../models/Contacts";

class ContactsController {

    async index(req, res) {

        const {
            name,
            email,
            status,
            createdBefore,
            createdAfter,
            updateBefore,
            updateAfter,
            sort
        } = req.query;

        const page = req.query.page || 1;
        const limit = req.query.limit || 25;

        let where = { customer_id: req.params.customerId };
        let order = [];

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name,
                },
            }

        }
        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email,
                },
            }

        }
        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: status.split(",").map(item => item.toUpperCase()),
                },
            }

        }
        if (createdBefore) {
            where = {
                ...where,
                createdAt: {
                    [Op.gte]: parseISO(createdBefore),
                },
            }

        }
        if (createdAfter) {
            where = {
                ...where,
                createdAt: {
                    [Op.lte]: parseISO(createdAfter),
                },
            }

        }
        if (updateBefore) {
            where = {
                ...where,
                updateAt: {
                    [Op.gte]: parseISO(updateBefore),
                },
            }

        }
        if (updateAfter) {
            where = {
                ...where,
                updateAt: {
                    [Op.lte]: parseISO(updateAfter),
                },
            }

        }
        if (sort) {
            order = sort.split(",").map(item => item.split(","));


        }
        const data = await Contacts.findAll({
            where,
            include: [
                {
                    model: Customer,
                    attributes: ["id", "status"],
                    required: true,

                },
            ],
            order,
            limit,
            offset: limit * page - limit,
        });
        return res.json(data);
    }
    async show(req, res) {
        const contact = await Contacts.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id,

             
            },

        });
        // const contact = await Contacts.findByPk(req.params.id,{
        //     include:[Customer],
        // });
        if (!contact) {
            return res.status(404).json();
        }
        return res.json(contact);

    }
    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            status: Yup.string().uppercase(),

        });

        if (!(await schema.isValid(req.body))) {

            return res.status(400).json({ error: "Error on validate schema." })
        }
        const contact = await Contacts.create({
            customer_id: req.params.customerId,
            ...req.body

        });
        return res.status(201).json(contact);

    }
    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            status: Yup.string().uppercase(),

        });

        if (!(await schema.isValid(req.body))) {

            return res.status(400).json({ error: "Error on validate schema." })
        }
        const contacts = await Contacts.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id,
            },

        });
        if (!contacts) {
            return res.status(404).json();
        }
        await contacts.update(req.body);
        return res.json(contacts);
    }
    async delete(req, res) { 
        const contacts = await Contacts.findOne({
            where: {
                customer_id: req.params.customerId,
                id: req.params.id,
            },

        });
        if (!contacts) {
            return res.status(404).json();
        }
        await contacts.destroy();
        return res.json();
    }
}
export default new ContactsController()