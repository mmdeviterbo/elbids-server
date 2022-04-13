import {DATE_FORMAT} from '../types'
export default (date, date_format: DATE_FORMAT)=>{
  if(date_format === DATE_FORMAT.DATE_HOUR) return new Date(date).toLocaleString()
  else{
    let month: number = (new Date(date).getMonth())+1
    let day:number = new Date(date).getDate()
    let year: number = new Date(date).getFullYear()
    return `${month}/${day}/${year}`
  }
}