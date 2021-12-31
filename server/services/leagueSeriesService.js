const LeagueSeries = require("../models/leagueSeries.model");

class LeagueSeriesService {
  static async getList() {
    const list = await LeagueSeries.forge().fetchAll();
    return list;
  }

  static async getListByUserId(userid) {
    const list = await LeagueSeries.query((qb) => {
      qb.join("leagues", "league_series.league_id", "=", "leagues.id");
      qb.where("leagues.userid", userid);
    }).fetchAll();
    return list;
  }

  static async getByID(id) {
    const leagueSeries = await LeagueSeries.where({ id }).fetch();
    return leagueSeries;
  }

  static async create(payload) {
    let leagueSeries = await LeagueSeries.forge(payload).save();
    leagueSeries = leagueSeries.toJSON();
    leagueSeries = this.getByID(leagueSeries.id);
    return leagueSeries;
  }

  static async updateById(id, payload) {
    let leagueSeries = await LeagueSeries.where({ id }).fetch();
    await leagueSeries.save(payload);
    leagueSeries = this.getByID(id);
    return leagueSeries;
  }

  static async deleteById(id) {
    const leagueSeries = await LeagueSeries.where({ id }).fetch();
    await leagueSeries.destroy();
    return true;
  }
}

module.exports = LeagueSeriesService;
