/**
 * Group.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    nameSearch: {
      type: 'string',
    },
    channexId: {
      type: 'string',
    },
  },
  beforeCreate: async function (group, cb) {
    console.log('Creating', group.name);
    if (group.name) {
      group.nameSearch = group.name.toLowerCase();
    }
    let channexRes = await sails.helpers.createChannexGroup.with({
      title: group.name,
    });
    if (!channexRes) {
      cb(new Error('Channex Group not created'));
    }
    group.channexId = channexRes;
    group.uniqueId = channexRes;
    return cb();
  },
  beforeUpdate: function (group, cb) {
    if (group.name) {
      group.nameSearch = group.name.toLowerCase();
      return cb();
    } else {
      return cb();
    }
  },
};
