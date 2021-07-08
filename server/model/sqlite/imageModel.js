const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const ImageSchema = sequelize.define(
  'Image',
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.BLOB,
    },
  },
  {
    sequelize,
    timestamps: false,
    createdAt: false,
    modelName: 'Image',
  }
)
ImageSchema.sync()

class ImageModel {
  static async get(ctx) {
    const result = await ImageSchema.findOne({
      where: {
        url: ctx.reqPDFUrl,
      },
    })
    return result
  }

  static async set(obj) {
    await ImageSchema.create(obj)
  }
}

module.exports = ImageModel
