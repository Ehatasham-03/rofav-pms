// api/models/BanquetHallFacility.js
module.exports = {
    tableName: 'banquethall_facility',
    primaryKey: 'id',
    attributes: {
        id: {
            type: 'number',
            autoIncrement: true
        },
        banquetHall: {
            model: 'BanquetManageHalls'
        },
        facility: {
            model: 'BanquetFacilities'
        }
    }
};