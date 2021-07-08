const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const PagesizeSchema = sequelize.define(
  'Pagesize',
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
    modelName: 'Pagesize',
  }
)
PagesizeSchema.sync()

class PagesizeModel {
  static async get(ctx) {
    const result = await PagesizeSchema.findOne({
      where: {
        url: ctx.reqPDFUrl,
      },
    })
    return result
  }

  static async set(obj) {
    await PagesizeSchema.create(obj)
  }
}

module.exports = PagesizeModel
