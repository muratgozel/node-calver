export default class LocalDate {
  constructor() {
    this.date = new Date(Date.now())
  }

  getFullYear() {
    return this.date.getFullYear()
  }

  getMonth() {
    return this.date.getMonth()
  }

  getWeek() {
    return this.getWeek()
  }

  getDate() {
    return this.date.getDate()
  }

  getWeek() {
    const d = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate()
    )
    const daynum = d.getDay() || 7

    d.setDate(d.getDate() + 4 - daynum)

    const yearstart = new Date(d.getFullYear(), 0, 1)

    return Math.ceil(((d - yearstart) / 86400000 + 1) / 7)
  }
}

