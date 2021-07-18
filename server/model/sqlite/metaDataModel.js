const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const MetadataSchema = sequelize.define(
  'Metadata',
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileHash: {
      type: DataTypes.STRING,
    },
    result: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    timestamps: false,
    createdAt: false,
    modelName: 'Metadata',
  }
)
MetadataSchema.sync()
class MetadataModel {
  static async get(ctx) {
    const result = await MetadataSchema.findOne({
      where: {
        url: ctx.reqPDFUrl,
      },
    })
    return result
  }

  static async set(obj) {
    await MetadataSchema.create(obj)
  }
}

module.exports = MetadataModel
