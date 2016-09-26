const todaysDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const date_string = `${year}-${month}-${day}`;
    return date_string
}

const shouldExchange = (date_exchanged) => {
    const one_day = 24*60*60*1000
    const today = todaysDate().split('-').join(',');
    let exchange_array = date_exchanged.split('-');
    const format_day = exchange_array[2].substring(0,2);
    exchange_array.pop();
    exchange_array.push(format_day);
    const exchanged_date = new Date(exchange_array.join('-')).getTime()
    const todays_date = new Date(today).getTime()
    const diff_in_days = Math.floor(Math.abs((exchanged_date - todays_date)/one_day));
    if(diff_in_days >= 85){
        return true
    } else {
        return false
    }
}

module.exports.getDate = todaysDate()

module.exports.shouldExchange = shouldExchange