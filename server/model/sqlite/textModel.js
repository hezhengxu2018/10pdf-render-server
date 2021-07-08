const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const TextSchema = sequelize.define(
  'Text',
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    timestamps: false,
    createdAt: false,
    modelName: 'Text',
  }
)
TextSchema.sync()

class TextModel {
  static async get(ctx) {
    const result = await TextSchema.findOne({
      where: {
        url: ctx.reqPDFUrl,
      },
    })
    return result
  }

  static async set(obj) {
    await TextSchema.create(obj)
  }
}

module.exports = TextModel
