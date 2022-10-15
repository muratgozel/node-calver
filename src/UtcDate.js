export default class UtcDate {
  constructor() {
    this.date = new Date(Date.now())
  }

  getFullYear() {
    return this.date.getUTCFullYear()
  }

  getMonth() {
    return this.date.getUTCMonth()
  }

  getWeek() {
    return this.getUTCWeek()
  }

  getDate() {
    return this.date.getUTCDate()
  }

  getUTCWeek() {
    const d = new Date(
      Date.UTC(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate()
      )
    );
    const daynum = d.getUTCDay() || 7

    d.setUTCDate(d.getUTCDate() + 4 - daynum)

    const yearstart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))

    return Math.ceil(((d - yearstart) / 86400000 + 1) / 7)
  }
}
