// api/models/BanquetHallSuitable.js
module.exports = {
    tableName: 'banquethall_suitable',
    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',
            autoIncrement: true
        },
        banquetHall: {
            model: 'BanquetManageHalls'
        },
        suitable: {
            model: 'BanquetSuitable'
        }
    }
};