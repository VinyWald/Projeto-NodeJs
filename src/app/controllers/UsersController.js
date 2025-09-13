import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";

import User from "../models/users";
import DummyJob from "../jobs/DummyJob";
import Queue from "../../lib/Queue";
import NewEmail from "../jobs/NewEmailJob";

class UserController {

    async index(req, res) {

        const {
            name,
            email,
            createdBefore,
            createdAfter,
            updateBefore,
            updateAfter,
            sort
        } = req.query;

        const page = req.query.page || 1;
        const limit = req.query.limit || 25;

        let where = {};
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
        const data = await User.findAll({
            attributes: { exclude: ["password", "passwoed_hash"] },
            where,
            order,
            limit,
            offset: limit * page - limit,
        });
        return res.json(data);
    }

    async show(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json();
        }
        return res.json(user);

    }
    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),
            passwordConf: Yup.string().when("password", (password, field) =>
                password ? field.required().oneOf([Yup.ref("password")]) : field
            ),
        });

        if (!(await schema.isValid(req.body))) {

            return res.status(400).json({ error: "Error on validate schema." })
        }

        const { id, name, email, fileid, createdAt, updatedAt } = await User.create(req.body);


        
        await Queue.add(NewEmail.key, { name, email });

        return res.status(201).json({ id, name, email, fileid, createdAt, updatedAt });

    }
    async update(req, res) {
        const userSchema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(8),
            password: Yup.string().min(8).when("oldPassword", (oldPassword, field) =>
                oldPassword ? field.required() : field
            ),
            passwordConf: Yup.string().when("password", (password, field) =>
                password ? field.required().oneOf([Yup.ref("password")]) : field
            ),
        });

        if (!(await userSchema.isValid(req.body))) {
            console.log("Erro de validação:", await userSchema.validate(req.body, { abortEarly: false }).catch(err => err.errors));
            return res.status(400).json({ error: "Error on validate schema." })
        }

        const users = await User.findByPk(req.params.id);
        if (!users) {
            return res.status(404).json();
        }

        const { oldPassword } = req.body;
        if (oldPassword && !(await users.checkPassword(oldPassword))) {
            return res.status(401).json({ error: "User password not match." });
        }




        const Users = await User.update(req.body,
            { where: { id: req.params.id } }
        );
        return res.status(201).json(Users);

    }
    async delete(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json();
        }
        await user.destroy();
        return res.json();
    }

} export default new UserController();