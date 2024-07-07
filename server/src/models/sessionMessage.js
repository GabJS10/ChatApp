import { sequelize } from "../database/database.js";
import { DataTypes, Op } from "sequelize";

const SessionMessage = sequelize.define("sessionMessage", {
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fromSelf: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    files: {
        type: DataTypes.BLOB,
        allowNull: true,
    }

});

SessionMessage.findMessagesPerUser = async function (userId) {
    const messages = await SessionMessage.findAll({ where: { [Op.or]: [{ from: userId }, { to: userId }] }} );
    const m = [];
    messages.forEach((message) => {
        m.push({from:message.dataValues.from, to:message.dataValues.to, content:message.dataValues.content, fromSelf:message.dataValues.fromSelf, files:message.dataValues.files});
    });
    return m
} 
export default SessionMessage