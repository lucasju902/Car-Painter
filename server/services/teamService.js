const Team = require("../models/team.model");

class TeamService {
  static async getList() {
    const list = await Team.forge().fetchAll();
    return list;
  }

  static async getListByUserId(userid) {
    const list = await Team.where({ userid }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const team = await Team.where({ id }).fetch();
    return team;
  }

  static async create(payload) {
    let team = await Team.forge(payload).save();
    team = team.toJSON();
    team = this.getByID(team.id);
    return team;
  }

  static async updateById(id, payload) {
    let team = await Team.where({ id }).fetch();
    await team.save(payload);
    team = this.getByID(id);
    return team;
  }

  static async deleteById(id) {
    const team = await Team.where({ id }).fetch();
    await team.destroy();
    return true;
  }
}

module.exports = TeamService;
